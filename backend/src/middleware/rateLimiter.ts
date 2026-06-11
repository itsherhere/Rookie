import rateLimit from 'express-rate-limit';

const message = (minutes: number) => ({
  success: false,
  error: `Too many requests. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.`,
});

// General API — 100 requests per minute
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: message(1),
});

// User creation — 10 per 15 minutes (prevents account spam)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: message(15),
});

// Job applications — 20 per 10 minutes (prevents application spam)
export const applicationLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: message(10),
});
