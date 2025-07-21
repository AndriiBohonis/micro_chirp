import { z } from 'zod';
import { loginSchema, registerSchema } from '@common/schemas/auth.schema';

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDro = z.infer<typeof registerSchema>;
