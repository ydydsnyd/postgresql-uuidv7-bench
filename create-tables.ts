import { Client } from 'pg';

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

export async function createTables() {
  await client.connect();

  await client.query(`
    DROP TABLE IF EXISTS serial_table;
    DROP TABLE IF EXISTS serial_with_random_table;
    DROP TABLE IF EXISTS uuidv4_table;
    DROP TABLE IF EXISTS uuidv7_table;
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS serial_table (
      id SERIAL PRIMARY KEY
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS serial_with_random_table (
      id SERIAL PRIMARY KEY,
      random VARCHAR(21) NOT NULL UNIQUE
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS uuidv4_table (
      id UUID PRIMARY KEY
    );
  `);

  await client.query(`
    CREATE TABLE IF NOT EXISTS uuidv7_table (
      id UUID PRIMARY KEY
    );
  `);

  console.log('Tables created successfully');
  await client.end();
}
