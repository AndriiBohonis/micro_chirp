import type { Context } from 'hono';
import bcrypt from 'bcryptjs';
import { UserService } from '@/users/user.service.ts';
import { AuthService } from '@/auth/auth.service.ts';
import { injectable } from 'tsyringe';
import type { LoginDto, RegisterDto } from '@/common/dtos/auth.dto.ts';
import type { UserModel } from '@/common/models/user.model.ts';

@injectable()
export class AuthController {
  private userService: UserService;
  private authService: AuthService;

  constructor(userService: UserService, authService: AuthService) {
    this.userService = userService;
    this.authService = authService;
  }

  async login(ctx: Context, data: LoginDto) {
    const { email, password } = data;
    const user = await this.userService.findByUsernameOrEmail({ email });
    if (!user) {
      return ctx.json({ error: 'User not found' }, 400);
    }
    const isPasswordValid = await bcrypt.compare(password, user?.password || '');
    if (!isPasswordValid) {
      return ctx.json({ error: 'Invalid password' }, 400);
    }
    const session = this.authService.createSession(user);
    return ctx.json(session);
  }

  async register(ctx: Context, data: RegisterDto) {
    const { username, email, password } = data;

    const userExists = await this.userService.findByUsernameOrEmail({ username, email });

    if (userExists) {
      return ctx.json({ error: 'User already exists' }, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.userService.create({
      ...data,
      password: hashedPassword,
    });

    const session = this.authService.createSession(newUser);
    return ctx.json(session);
  }

  async me(ctx: Context) {
    const jwtPayload = ctx.get('jwtPayload');
    const user = await this.userService.findById(jwtPayload.id);

    return ctx.json(user);
  }
}
