import { z } from 'zod';

export const createChirpSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

export const paramChirpSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Invalid ID'),
});
