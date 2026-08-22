import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database/db.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { CryptoService } from '../services/crypto.service.js';

export interface SyncTransactionVoucher {
  txId: string;
  senderId: string;
  receiverId: string;
  totalAmount: number;
  bonds: Array<{
    bondId: string;
    value: number;
    serverSignature: string;
  }>;
  timestamp: string;
  nonce: string;
  senderSignature?: string;
}

export class SyncController {
  public static async syncTransactions(req: AuthRequest, res: Response): Promise<void> {
    try {
      const syncingUserId = req.user?.userId;
      const { transactions } = req.body;

      if (!Array.isArray(transactions) || transactions.length === 0) {
        res.status(400).json({ error: 'transactions array is required' });
        return;
      }

      const results = [];

      for (const tx of transactions as SyncTransactionVoucher[]) {
        const { txId, senderId, receiverId, totalAmount, bonds, timestamp, nonce, senderSignature } = tx;

        // 1. Value Integrity Check
        const totalBondValue = bonds.reduce((sum, b) => sum + b.value, 0);
        if (totalBondValue !== totalAmount) {
          results.push({
            txId,
            status: 'REJECTED',
            reason: `Value mismatch: Stated amount NPR ${totalAmount} != Bonds value NPR ${totalBondValue}`,
          });
          continue;
        }

        // 2. Bond Server Signature Verification & Double-Spend Check
        let isDoubleSpend = false;
        let invalidBondSignature = false;
        const bondIds = bonds.map((b) => b.bondId);

        for (const bond of bonds) {
          // Check if already redeemed
          const alreadyRedeemed = await db.get(
            'SELECT * FROM bond_redemptions WHERE bond_id = ?',
            [bond.bondId]
          );

          if (alreadyRedeemed) {
            isDoubleSpend = true;
            break;
          }

          // Check if bond exists in issued_bonds
          const dbBond = await db.get<{
            bond_id: string;
            value: number;
            owner_id: string;
            issued_at: string;
            expires_at: string;
            server_signature: string;
          }>('SELECT * FROM issued_bonds WHERE bond_id = ?', [bond.bondId]);

          if (dbBond) {
            const isValid = CryptoService.verifyBondSignature(
              {
                bondId: dbBond.bond_id,
                value: dbBond.value,
                ownerId: dbBond.owner_id,
                issuedAt: dbBond.issued_at,
                expiresAt: dbBond.expires_at,
              },
              dbBond.server_signature
            );

            if (!isValid) {
              invalidBondSignature = true;
              break;
            }
          }
        }

        if (isDoubleSpend) {
          // Log fraud flag
          await db.run(
            `INSERT INTO fraud_flags (flag_id, user_id, flag_type, severity, details, created_at)
             VALUES (?, ?, 'DOUBLE_SPEND', 'CRITICAL', ?, ?)`,
            [
              `flag-${uuidv4().slice(0, 8)}`,
              senderId,
              JSON.stringify({ txId, bonds: bondIds, reportedBy: syncingUserId }),
              new Date().toISOString(),
            ]
          );

          results.push({
            txId,
            status: 'REJECTED',
            reason: 'Double-spend detected: One or more bonds were already redeemed',
          });
          continue;
        }

        if (invalidBondSignature) {
          results.push({
            txId,
            status: 'REJECTED',
            reason: 'Invalid server signature on one or more bonds (Counterfeit attempt)',
          });
          continue;
        }

        // 3. Record Redemptions and Settle
        const redeemedAt = new Date().toISOString();

        for (const bond of bonds) {
          await db.run(
            `INSERT INTO bond_redemptions (redemption_id, bond_id, tx_id, redeemed_by, redeemed_at)
             VALUES (?, ?, ?, ?, ?)`,
            [`red-${uuidv4().slice(0, 8)}`, bond.bondId, txId, receiverId, redeemedAt]
          );

          // Mark bond status as spent
          await db.run("UPDATE issued_bonds SET status = 'spent' WHERE bond_id = ?", [bond.bondId]);
        }

        // Record in central transactions table
        await db.run(
          `INSERT OR IGNORE INTO transactions (tx_id, sender_id, receiver_id, amount, is_offline, sender_signature, created_at)
           VALUES (?, ?, ?, ?, 1, ?, ?)`,
          [txId, senderId, receiverId, totalAmount, senderSignature || 'ed25519-sig', timestamp || redeemedAt]
        );

        // Credit receiver's online balance
        const receiver = await db.get<{ online_balance: number }>(
          'SELECT online_balance FROM users WHERE user_id = ?',
          [receiverId]
        );

        if (receiver) {
          await db.run(
            'UPDATE users SET online_balance = ? WHERE user_id = ?',
            [receiver.online_balance + totalAmount, receiverId]
          );
        }

        results.push({
          txId,
          status: 'SETTLED',
          amount: totalAmount,
          receiverId,
          settledAt: redeemedAt,
        });
      }

      res.status(200).json({
        message: 'Sync batch processed successfully',
        results,
      });
    } catch (err: any) {
      console.error('Sync error:', err);
      res.status(500).json({ error: 'Failed to process sync transactions', details: err.message });
    }
  }
}
