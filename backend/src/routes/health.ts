import { Router } from 'express';
import type { Request, Response } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

// GET /health
router.get('/', async (_req: Request, res: Response) => {
  const start = Date.now();

  // Ping the database
  let dbStatus: 'connected' | 'disconnected' = 'connected';
  try {
    const { error } = await supabase.from('users').select('id').limit(1);
    if (error) dbStatus = 'disconnected';
  } catch {
    dbStatus = 'disconnected';
  }

  const uptimeSeconds = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  const uptimeFormatted = `${hours}h ${minutes}m ${seconds}s`;

  res.status(dbStatus === 'connected' ? 200 : 503).json({
    status: dbStatus === 'connected' ? 'ok' : 'degraded',
    db: dbStatus,
    uptime: uptimeFormatted,
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    responseTime: `${Date.now() - start}ms`,
    timestamp: new Date().toISOString(),
  });
});

export default router;
