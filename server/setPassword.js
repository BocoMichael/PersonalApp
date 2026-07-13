import bcrypt from 'bcrypt';
import db from './db.js';

const email = 'michael@example.com';
const plainPassword = '040201';

const run = async () => {
  const hash = await bcrypt.hash(plainPassword, 10);

  const result = await db.query(
    'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id, username, email',
    [hash, email]
  );

  if (result.rows.length === 0) {
    console.log('❌ Walang nahanap na user sa email na iyan.');
  } else {
    console.log('✓ Na-set na ang password para kay:', result.rows[0]);
  }

  process.exit();
};

run();