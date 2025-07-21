import { Hono } from 'hono';
import { container } from 'tsyringe';

import { zValidator } from '@hono/zod-validator';
import { ChirpController } from '@/chirps/chirps.controller.ts';
import { createChirpSchema, paramChirpSchema } from '@/common/schemas/chirp.schema.ts';
import { withAuth } from '@/middleware/auth.ts';

const chirp = new Hono();
const controller = container.resolve(ChirpController);

chirp.get('/', async (ctx) => {
  console.log(ctx.req.param());
  return controller.getAll(ctx);
});

chirp.get('/:id', async (ctx) => {
  return controller.get(ctx);
});

chirp.post('/', withAuth, zValidator('json', createChirpSchema), async (ctx) => {
  const data = ctx.req.valid('json');
  const user_id = ctx.var.jwtPayload.id;
  return controller.create(ctx, { ...data, user_id });
});

chirp.patch(
  '/:id',
  withAuth,
  zValidator('param', paramChirpSchema),
  zValidator('json', createChirpSchema.partial()),
  async (ctx) => {
    const data = ctx.req.valid('json');
    return controller.update(ctx, data);
  },
);

chirp.delete('/:id', withAuth, zValidator('param', paramChirpSchema), async (ctx) => {
  return controller.delete(ctx);
});

export default chirp;
