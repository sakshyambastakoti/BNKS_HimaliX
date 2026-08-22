import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.routes.js';
import { initDatabase } from './database/db.js';
import { CryptoService } from './services/crypto.service.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());

// Request logger for development
app.use((req, _res, next) => {
  const start = Date.now();
  const { method, url } = req;
  console.log(`📡 [${new Date().toLocaleTimeString()}] ${method} ${url}`);
  next();
});

// API Routes
app.use('/api', apiRoutes);

// Root greeting
app.get('/', (_req, res) => {
  res.json({
    message: '⚡ OffPay Local Backend Server is running.',
    documentation: '/docs',
    endpoints: {
      health: 'GET /api/health',
      auth: 'POST /api/auth/signup, POST /api/auth/login',
      wallet: 'GET /api/wallet/balance, POST /api/wallet/topup',
      bonds: 'POST /api/bonds/issue, POST /api/bonds/reverse',
      sync: 'POST /api/transactions/sync',
    },
  });
});

/**
 * Bootstrap Server
 */
async function startServer() {
  try {
    console.log('🚀 Initializing OffPay Central Server...');
    
    // 1. Initialize SQLite Database
    await initDatabase();

    // 2. Initialize Cryptographic Engine
    await CryptoService.initialize();

    // 3. Start listening on all network interfaces (0.0.0.0) so phone can connect
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n=================================================`);
      console.log(`✅ OffPay Server running on: http://localhost:${PORT}`);
      console.log(`📱 Local Network URL for Phones: http://<YOUR_PC_IP>:${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
      console.log(`=================================================\n`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
