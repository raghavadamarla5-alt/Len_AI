import { cookies } from 'next/headers';
import { db } from './mockDb';

export function getSessionUser() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('auth_session')?.value;

  if (!sessionId) {
    return null;
  }

  const user = db.users.get(sessionId);
  return user || null;
}
