import { Router, Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { BondsController } from '../controllers/bonds.controller.js';
import { WalletController } from '../controllers/wallet.controller.js';
import { SyncController } from '../controllers/sync.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { CryptoService } from '../services/crypto.service.js';

const router = Router();

// Health check & Server info
router.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'online',
    system: 'OffPay Central Settlement Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    serverPublicKey: CryptoService.getServerPublicKey(),
  });
});

// Auth Routes
router.post('/auth/signup', AuthController.signup);
router.post('/auth/login', AuthController.login);
router.get('/auth/me', requireAuth, AuthController.getMe);

// Wallet Routes
router.get('/wallet/balance', requireAuth, WalletController.getBalance);
router.post('/wallet/topup', requireAuth, WalletController.topup);
router.get('/wallet/transactions', requireAuth, WalletController.getTransactions);

// Offline Bonds Routes
router.post('/bonds/issue', requireAuth, BondsController.issueBonds);
router.post('/bonds/reverse', requireAuth, BondsController.reverseBonds);

// Offline Settlement & Sync
router.post('/transactions/sync', requireAuth, SyncController.syncTransactions);

export default router;
