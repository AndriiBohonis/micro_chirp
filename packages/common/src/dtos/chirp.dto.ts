import { z } from 'zod';
import { createChirpSchema } from '@common/schemas/chirp.schema';

export type chirpCreateDto = z.infer<typeof createChirpSchema>;
