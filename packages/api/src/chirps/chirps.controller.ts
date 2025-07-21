import { injectable } from 'tsyringe';
import type { Context } from 'hono';
import { ChirpService } from '@/chirps/chirps.service.ts';
import type { ChirpModel } from '@/common/models/chirp.model.ts';

@injectable()
export class ChirpController {
  constructor(private chirpService: ChirpService) {}

  async create(ctx: Context, data: Omit<ChirpModel, 'id' | 'created_at' | 'updated_at'>) {
    const chirp = await this.chirpService.create(data);

    return ctx.json(chirp);
  }

  async get(ctx: Context) {
    const id = Number(ctx.req.param('id'));
    const chirp = await this.chirpService.findById(id);

    if (!chirp) {
      return ctx.json({ error: 'Not found' }, 404);
    }

    return ctx.json(chirp);
  }

  async getAll(ctx: Context) {
    const chirps = await this.chirpService.findAllChirps(ctx.req.query());

    return ctx.json(chirps);
  }

  async update(ctx: Context, data: Partial<Omit<ChirpModel, 'id' | 'created_at'>>) {
    const id = Number(ctx.req.param('id'));
    const updated = await this.chirpService.update(id, data);
    if (!updated) {
      return ctx.json({ error: 'Not found' }, 404);
    }

    return ctx.json(updated);
  }

  async delete(ctx: Context) {
    const id = Number(ctx.req.param('id'));
    const user_id = ctx.var.jwtPayload.id;
    await this.chirpService.delete(id, user_id);

    return ctx.json({ success: true });
  }
}
