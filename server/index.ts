/**
 * Rental-log Full-Stack Express Server & Ledger API
 * Provides authenticated REST endpoints for properties, investments, deposits, withdrawals, and ledger audit.
 */

import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// CORS & Security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    platform: 'Rental-log API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

/**
 * Endpoints specification:
 * - POST /api/auth/register
 * - POST /api/auth/login
 * - GET  /api/properties
 * - GET  /api/properties/:id
 * - POST /api/investments/execute
 * - GET  /api/investments/my
 * - POST /api/wallet/deposit
 * - POST /api/wallet/withdraw
 * - GET  /api/transactions
 * - GET  /api/admin/audit-logs
 * - POST /api/admin/withdrawals/:id/review
 */

export default app;
