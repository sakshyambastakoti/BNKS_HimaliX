import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/db.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

const JWT_SECRET = process.env.JWT_SECRET || 'offpay_super_secret_jwt_key_2026_dev_mode';

export class AuthController {
  public static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { fullName, phone, email, password, publicKey } = req.body;

      if (!fullName || !phone || !email || !password) {
        res.status(400).json({ error: 'Missing required fields: fullName, phone, email, password' });
        return;
      }

      // Check if user already exists
      const existing = await db.get(
        'SELECT user_id FROM users WHERE phone = ? OR email = ?',
        [phone, email]
      );

      if (existing) {
        res.status(409).json({ error: 'A user with this phone or email already exists' });
        return;
      }

      const userId = `usr-${uuidv4()}`;
      const passwordHash = await bcrypt.hash(password, 10);
      const userPublicKey = publicKey || 'mock-public-key-dev';
      const initialBalance = 3000.0; // Initial testing balance in NPR

      await db.run(
        `INSERT INTO users (user_id, full_name, phone, email, password_hash, public_key, online_balance, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, fullName, phone, email, passwordHash, userPublicKey, initialBalance, new Date().toISOString()]
      );

      const token = jwt.sign({ userId, email, phone }, JWT_SECRET, { expiresIn: '30d' });

      res.status(201).json({
        message: 'Account created successfully',
        token,
        user: {
          userId,
          fullName,
          phone,
          email,
          publicKey: userPublicKey,
          onlineBalance: initialBalance,
        },
      });
    } catch (err: any) {
      console.error('Signup error:', err);
      res.status(500).json({ error: 'Internal server error during signup', details: err.message });
    }
  }

  public static async login(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, password } = req.body; // identifier can be phone or email

      if (!identifier || !password) {
        res.status(400).json({ error: 'Please provide identifier (phone or email) and password' });
        return;
      }

      const user = await db.get<{
        user_id: string;
        full_name: string;
        phone: string;
        email: string;
        password_hash: string;
        public_key: string;
        online_balance: number;
      }>(
        'SELECT * FROM users WHERE phone = ? OR email = ?',
        [identifier, identifier]
      );

      if (!user) {
        res.status(401).json({ error: 'Invalid credentials: User not found' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid credentials: Password incorrect' });
        return;
      }

      const token = jwt.sign(
        { userId: user.user_id, email: user.email, phone: user.phone },
        JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          userId: user.user_id,
          fullName: user.full_name,
          phone: user.phone,
          email: user.email,
          publicKey: user.public_key,
          onlineBalance: user.online_balance,
        },
      });
    } catch (err: any) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Internal server error during login', details: err.message });
    }
  }

  public static async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const user = await db.get<{
        user_id: string;
        full_name: string;
        phone: string;
        email: string;
        public_key: string;
        online_balance: number;
      }>(
        'SELECT user_id, full_name, phone, email, public_key, online_balance FROM users WHERE user_id = ?',
        [userId]
      );

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.status(200).json({
        user: {
          userId: user.user_id,
          fullName: user.full_name,
          phone: user.phone,
          email: user.email,
          publicKey: user.public_key,
          onlineBalance: user.online_balance,
        },
      });
    } catch (err: any) {
      console.error('GetMe error:', err);
      res.status(500).json({ error: 'Failed to fetch user profile', details: err.message });
    }
  }
}
