import pool from '../config/database.js';
import schema from './schema.js';

async function runMigrations() {
  try {
    console.log('Running database migrations...');
    await pool.query(schema);
    console.log('Migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();
