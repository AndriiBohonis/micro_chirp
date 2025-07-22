import { z } from 'zod';
import { createChirpSchema } from '@/common/schemas/chirp.schema';

export type ChirpCreateDto = z.infer<typeof createChirpSchema>;
