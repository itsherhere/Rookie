import { verifyToken } from '@clerk/backend';
import type { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';
import type { Role } from '../types';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        clerkUserId: string;
        role: Role;
        email: string;
      };
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'Missing authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY!,
    });

    if (!payload?.sub) {
      res.status(401).json({ success: false, error: 'Invalid token' });
      return;
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_user_id', payload.sub)
      .single();

    if (error || !user) {
      res.status(401).json({ success: false, error: 'User not found' });
      return;
    }

    req.auth = {
      userId: user.id,
      clerkUserId: user.clerk_user_id,
      role: user.role,
      email: user.email,
    };

    next();
  } catch (err) {
    console.error('[requireAuth] error:', err);
    res.status(401).json({ success: false, error: 'Authentication failed' });
  }
}

export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    if (!roles.includes(req.auth.role)) {
      res.status(403).json({ success: false, error: 'Insufficient permissions' });
      return;
    }

    next();
  };
}