import { Hono } from 'hono';
import { AuthController } from '@/auth/auth.controller.ts';

import { zValidator } from '@hono/zod-validator';

import { container } from 'tsyringe';
import { loginSchema, registerSchema } from '@/common/schemas/auth.schema.ts';

const auth = new Hono();

auth.post('/login', zValidator('form', loginSchema), async (ctx) => {
  const validated = ctx.req.valid('form');
  const controller = container.resolve(AuthController);

  return await controller.login(ctx, validated);
});

auth.post('/register', zValidator('form', registerSchema), async (ctx) => {
  const validated = ctx.req.valid('form');
  const controller = container.resolve(AuthController);

  return await controller.register(ctx, validated);
});

export default auth;
