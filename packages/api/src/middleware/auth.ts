import type { MiddlewareHandler } from 'hono';
import { verify } from 'hono/jwt';

export const withAuth: MiddlewareHandler = async (c, next) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return c.json({ error: 'No token' }, 401);

  try {
    const payload = await verify(token, process.env.JWT_SECRET! || 'your_secret_key');
    c.set('jwtPayload', payload);
    await next();
  } catch (e) {
    return c.json({ error: 'Invalid token' }, 401);
  }
};
