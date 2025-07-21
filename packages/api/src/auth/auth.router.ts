import { Hono } from 'hono';
import { AuthController } from '@/auth/auth.controller.ts';

import { zValidator } from '@hono/zod-validator';

import { container } from 'tsyringe';
import { loginSchema, registerSchema } from '@/common/schemas/auth.schema.ts';
import { withAuth } from '@/middleware/auth.ts';

const auth = new Hono();

auth.post('/login', zValidator('json', loginSchema), async (ctx) => {
  const validated = ctx.req.valid('json');
  const controller = container.resolve(AuthController);

  return await controller.login(ctx, validated);
});

auth.post('/register', zValidator('json', registerSchema), async (ctx) => {
  const validated = ctx.req.valid('json');
  const controller = container.resolve(AuthController);

  return await controller.register(ctx, validated);
});
auth.get('/me', withAuth, async (ctx) => {
  const controller = container.resolve(AuthController);
  return await controller.me(ctx);
});

export default auth;
