import { addUser } from '@/Repositories/User.js';
import { getDateOffset } from '@/Utils/Date.js';

export function migration1(db) {
  const users = [
  ];
  users.map(u => addUser(db, u));
}
