import { addUser } from '../Repositories/User.js';
import { getDateOffset } from '../Utils/Date.js';

export function migration1() {
  // add initial data
  const users = [
  ];
  users.map(u => addUser(u));
}
