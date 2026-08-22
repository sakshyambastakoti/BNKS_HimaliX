import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/db.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export class WalletController {
  public static async getBalance(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      const user = await db.get<{ online_balance: number }>(
        'SELECT online_balance FROM users WHERE user_id = ?',
        [userId]
      );

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Sum active offline bonds
      const bonds = await db.all<{ bond_id: string; value: number; status: string; expires_at: string }>(
        "SELECT bond_id, value, status, expires_at FROM issued_bonds WHERE owner_id = ? AND status = 'active'",
        [userId]
      );

      const offlineTotal = bonds.reduce((sum, b) => sum + b.value, 0);
      const onlineBalance = user.online_balance || 0;
      const totalBalance = onlineBalance + offlineTotal;

      res.status(200).json({
        onlineBalance,
        offlineBalance: offlineTotal,
        totalBalance,
        activeBonds: bonds,
      });
    } catch (err: any) {
      console.error('GetBalance error:', err);
      res.status(500).json({ error: 'Failed to fetch balance', details: err.message });
    }
  }

  public static async topup(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { amount } = req.body;

      const numAmount = parseFloat(amount);
      if (!numAmount || numAmount <= 0) {
        res.status(400).json({ error: 'Valid positive amount is required' });
        return;
      }

      const user = await db.get<{ online_balance: number }>(
        'SELECT online_balance FROM users WHERE user_id = ?',
        [userId]
      );

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const newBalance = user.online_balance + numAmount;
      await db.run('UPDATE users SET online_balance = ? WHERE user_id = ?', [newBalance, userId]);

      const txId = `tx-topup-${uuidv4().slice(0, 8)}`;
      await db.run(
        `INSERT INTO transactions (tx_id, sender_id, receiver_id, amount, is_offline, created_at)
         VALUES (?, ?, ?, ?, 0, ?)`,
        [txId, 'BANK_DEPOSIT', userId, numAmount, new Date().toISOString()]
      );

      res.status(200).json({
        message: `Successfully topped up NPR ${numAmount}`,
        txId,
        newOnlineBalance: newBalance,
      });
    } catch (err: any) {
      console.error('Topup error:', err);
      res.status(500).json({ error: 'Failed to topup balance', details: err.message });
    }
  }

  public static async getTransactions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;

      const txs = await db.all(
        `SELECT tx_id, sender_id, receiver_id, amount, is_offline, created_at 
         FROM transactions 
         WHERE sender_id = ? OR receiver_id = ? 
         ORDER BY created_at DESC 
         LIMIT 50`,
        [userId, userId]
      );

      res.status(200).json({
        transactions: txs,
      });
    } catch (err: any) {
      console.error('GetTransactions error:', err);
      res.status(500).json({ error: 'Failed to fetch transaction history', details: err.message });
    }
  }
}
