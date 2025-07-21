import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { config } from 'dotenv';
import auth from '@/auth/auth.router.ts';
import 'reflect-metadata';
import chirp from '@/chirps/chirps.router.ts';

config();

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

app.get('/', (c) => {
  return c.text(`Server is running`);
});

app.route('/api', auth);
app.route('/api/chirps', chirp);

const port = Number(process.env.API_PORT || 3000);
console.log(`Server is running on http://localhost:${port}`);

serve({ fetch: app.fetch, port });
