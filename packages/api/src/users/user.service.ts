import { db } from '@/config/db.ts';
import type { Knex } from 'knex';
import type { UserModel } from '@/common/models/user.model.ts';
import { sanitize } from '@/common/utils.ts';

export class UserService {
  private table = 'users';
  private db: Knex;

  constructor() {
    this.db = db;
  }

  private sanitizeUser(user: UserModel | null): UserModel | null {
    if (!user) {
      return null;
    }

    return sanitize(user, ['password']);
  }

  async create(user: Omit<UserModel, 'id' | 'created_at' | 'updated_at'>): Promise<UserModel> {
    const [createdUser] = await this.db(this.table).insert(user).returning('*');
    return createdUser;
  }

  async findById(id: number): Promise<UserModel | null> {
    const user = await this.db(this.table).where({ id }).first();
    return this.sanitizeUser(user);
  }

  async findByUsernameOrEmail(
    params: Partial<{ username: string; email: string }>,
  ): Promise<UserModel | null> {
    const { username, email } = params;
    if (!username && !email) {
      return null;
    }

    const user = await this.db(this.table)
      .where((builder) => {
        if (username) builder.orWhere('username', username);
        if (email) builder.orWhere('email', email);
      })
      .first();

    return user;
  }

  async update(
    id: number,
    data: Partial<Omit<UserModel, 'id' | 'created_at'>>,
  ): Promise<UserModel | null> {
    const [updatedUser] = await this.db(this.table)
      .where({ id })
      .update({ ...data, updated_at: new Date() })
      .returning('*');
    return this.sanitizeUser(updatedUser);
  }

  async delete(id: number): Promise<number> {
    return await this.db(this.table).where({ id }).del();
  }
}
