import { hashPassword } from './auth';
import { id, readDb, writeDb } from './store';

export async function ensureSeedAdmin() {
  const db = readDb();
  if (db.users.length > 0) return;

  const email = (process.env.BESTEMAIL_ADMIN_EMAIL || 'admin@bestemail.in').toLowerCase();
  const password = process.env.BESTEMAIL_ADMIN_PASSWORD || 'ChangeMe123!';
  const name = process.env.BESTEMAIL_ADMIN_NAME || 'Admin';

  db.users.push({
    id: id('usr'),
    email,
    name,
    role: 'admin',
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  });

  writeDb(db);
}
