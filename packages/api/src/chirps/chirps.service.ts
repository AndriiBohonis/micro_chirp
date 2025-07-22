import type { Knex } from 'knex';
import { injectable } from 'tsyringe';
import { db } from '@/config/db.ts';

import type { PaginatedResponse, PaginationOptions } from '@/common/models/base.model.ts';
import type { ChirpModel } from '@/common/models/chirp.model.ts';
import { findAll } from '@/utils/find-all-builder.ts';
import type { ChirpCreateDto } from '@/common/dtos/chirp.dto.ts';

@injectable()
export class ChirpService {
  private db: Knex;
  private table = 'chirps';

  constructor() {
    this.db = db;
  }

  async create(chirp: ChirpCreateDto): Promise<ChirpModel> {
    const [created] = await this.db(this.table).insert(chirp).returning('*');
    return created;
  }

  async findById(id: number): Promise<ChirpModel | null> {
    const chirp = await this.db(this.table).where({ id }).first();
    return chirp || null;
  }

  async findAllChirps(
    options?: PaginationOptions<Partial<ChirpModel>>,
  ): Promise<PaginatedResponse<ChirpModel>> {
    return findAll(this.db, this.table, {
      ...options,
      populate: [
        {
          table: 'users',
          localKey: 'user_id',
          foreignKey: 'id',
          select: ['username', 'first_name', 'last_name'],
          as: 'user',
        },
      ],
    });
  }

  async update(
    id: number,
    data: Partial<Omit<ChirpModel, 'id' | 'created_at'>>,
  ): Promise<ChirpModel | null> {
    await this.verifyOwnership(id, data?.user_id);
    const [updated] = await this.db(this.table)
      .where({ id })
      .update({ ...data, updated_at: new Date() })
      .returning('*');
    return updated || null;
  }

  async delete(id: number, user_id: number): Promise<number> {
    await this.verifyOwnership(id, user_id);
    return await this.db(this.table).where({ id }).del();
  }

  async verifyOwnership(chirpId: number, userId?: number): Promise<boolean> {
    if (!chirpId || !userId) {
      return false;
    }
    const chirp = await this.findById(chirpId);
    if (!chirp) {
      return false;
    }
    return chirp.user_id === userId;
  }
}
