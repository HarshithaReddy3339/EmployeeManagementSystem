
require('dotenv').config();

const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { randomUUID } = require('crypto');
const readline = require('readline/promises');

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const email = (
      await rl.question('Enter Admin email: ')
    ).trim().toLowerCase();

    const password = await rl.question('Enter Admin password: ');

    if (!email || password.length < 8) {
      throw new Error('Enter a valid email and a password of at least 8 characters.');
    }

    const existing = await pool.query(
      'SELECT id FROM "User" WHERE email = $1',
      [email],
    );

    if (existing.rowCount > 0) {
      console.log('An account with this email already exists.');
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await pool.query(
      `INSERT INTO "User"
       (id, email, "passwordHash", role, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, 'ADMIN', NOW(), NOW())`,
      [randomUUID(), email, passwordHash],
    );

    console.log('Admin account created successfully.');
  } finally {
    rl.close();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Admin creation failed:', error.message);
  process.exitCode = 1;
});

