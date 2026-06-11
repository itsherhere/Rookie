import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export function validate<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: result.error.flatten().fieldErrors,
      });
      return;
    }

    // Replace req.body with sanitized + coerced data
    req.body = result.data;
    next();
  };
}
