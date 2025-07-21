import jwt from 'jsonwebtoken';
import { injectable } from 'tsyringe';
import type { UserModel } from '@/common/models/user.model.ts';
import { sanitize } from '@/common/utils.ts';

@injectable()
export class AuthService {
  private readonly jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your_secret_key';
  }

  createSession(user: UserModel): { access_token: string; user: Omit<UserModel, 'password'> } {
    const payload = {
      id: user.id,
      username: user.username,
    };

    const access_token = jwt.sign(payload, this.jwtSecret);

    return {
      access_token,
      user: sanitize(user, ['password']),
    };
  }
}
