import db_config from '../../knexfile.js';
import { knex } from 'knex';

export const db = knex(db_config['development']);
