import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/db.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { CryptoService } from '../services/crypto.service.js';

export class BondsController {
  /**
   * Breaks down a target amount into standard bond denominations (1000, 500, 200, 100)
   */
  private static calculateDenominations(targetAmount: number): number[] {
    const denominations = [1000, 500, 200, 100];
    const result: number[] = [];
    let remaining = targetAmount;

    for (const denom of denominations) {
      while (remaining >= denom) {
        result.push(denom);
        remaining -= denom;
      }
    }

    if (remaining > 0) {
      throw new Error(`Amount must be a multiple of 100 NPR. Remainder: ${remaining}`);
    }

    return result;
  }

  /**
   * Mints and cryptographically signs offline bond tokens for a user
   */
  public static async issueBonds(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { amount } = req.body;

      const numAmount = parseInt(amount, 10);
      if (!numAmount || numAmount <= 0) {
        res.status(400).json({ error: 'Valid amount is required (e.g. 500, 1000 NPR)' });
        return;
      }

      // Check current user balance
      const user = await db.get<{ online_balance: number }>(
        'SELECT online_balance FROM users WHERE user_id = ?',
        [userId]
      );

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      if (user.online_balance < numAmount) {
        res.status(400).json({
          error: 'Insufficient online balance',
          available: user.online_balance,
          requested: numAmount,
        });
        return;
      }

      // Check velocity limit (Max 3,000 NPR active offline bonds per user)
      const activeBondsSum = await db.get<{ total: number }>(
        "SELECT COALESCE(SUM(value), 0) as total FROM issued_bonds WHERE owner_id = ? AND status = 'active'",
        [userId]
      );

      const currentActive = activeBondsSum?.total || 0;
      if (currentActive + numAmount > 3000) {
        res.status(400).json({
          error: 'Velocity limit exceeded: Maximum 3,000 NPR in active offline bonds allowed',
          currentActive,
          allowed: Math.max(0, 3000 - currentActive),
        });
        return;
      }

      // Calculate denominations
      let bondValues: number[];
      try {
        bondValues = BondsController.calculateDenominations(numAmount);
      } catch (e: any) {
        res.status(400).json({ error: e.message });
        return;
      }

      const issuedAt = new Date().toISOString();
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days expiry

      const createdBonds = [];

      for (const val of bondValues) {
        const bondId = `BOND-${uuidv4().slice(0, 8).toUpperCase()}-${val}`;
        const signature = CryptoService.signBond({
          bondId,
          value: val,
          ownerId: userId!,
          issuedAt,
          expiresAt,
        });

        await db.run(
          `INSERT INTO issued_bonds (bond_id, owner_id, value, server_signature, status, issued_at, expires_at)
           VALUES (?, ?, ?, ?, 'active', ?, ?)`,
          [bondId, userId, val, signature, issuedAt, expiresAt]
        );

        createdBonds.push({
          bondId,
          value: val,
          serverSignature: signature,
          issuedAt,
          expiresAt,
          status: 'available',
        });
      }

      // Deduct online balance
      const newBalance = user.online_balance - numAmount;
      await db.run('UPDATE users SET online_balance = ? WHERE user_id = ?', [newBalance, userId]);

      // Record bond load transaction
      await db.run(
        `INSERT INTO transactions (tx_id, sender_id, receiver_id, amount, is_offline, created_at)
         VALUES (?, ?, ?, ?, 0, ?)`,
        [`tx-load-${uuidv4().slice(0, 8)}`, userId, userId, numAmount, issuedAt]
      );

      res.status(201).json({
        message: `Successfully minted ${createdBonds.length} offline bond tokens`,
        newOnlineBalance: newBalance,
        totalIssued: numAmount,
        bonds: createdBonds,
      });
    } catch (err: any) {
      console.error('IssueBonds error:', err);
      res.status(500).json({ error: 'Failed to issue offline bonds', details: err.message });
    }
  }

  /**
   * Reverses (revokes) unspent bonds and refunds online balance
   */
  public static async reverseBonds(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { bondIds } = req.body;

      if (!Array.isArray(bondIds) || bondIds.length === 0) {
        res.status(400).json({ error: 'bondIds array is required' });
        return;
      }

      let totalRefund = 0;
      const revokedBonds: string[] = [];

      for (const bondId of bondIds) {
        const bond = await db.get<{ bond_id: string; value: number; status: string }>(
          "SELECT bond_id, value, status FROM issued_bonds WHERE bond_id = ? AND owner_id = ? AND status = 'active'",
          [bondId, userId]
        );

        if (bond) {
          await db.run("UPDATE issued_bonds SET status = 'revoked' WHERE bond_id = ?", [bondId]);
          totalRefund += bond.value;
          revokedBonds.push(bondId);
        }
      }

      if (totalRefund === 0) {
        res.status(400).json({ error: 'No active eligible bonds found to reverse' });
        return;
      }

      // Refund to online balance
      const user = await db.get<{ online_balance: number }>(
        'SELECT online_balance FROM users WHERE user_id = ?',
        [userId]
      );
      const newBalance = (user?.online_balance || 0) + totalRefund;
      await db.run('UPDATE users SET online_balance = ? WHERE user_id = ?', [newBalance, userId]);

      res.status(200).json({
        message: `Reversed ${revokedBonds.length} bonds. Refunded NPR ${totalRefund} to online balance.`,
        newOnlineBalance: newBalance,
        refundAmount: totalRefund,
        revokedBonds,
      });
    } catch (err: any) {
      console.error('ReverseBonds error:', err);
      res.status(500).json({ error: 'Failed to reverse bonds', details: err.message });
    }
  }
}
