import { getDatabase } from '../Utils/Database.js';

export async function addUser(user) {
  const db = await getDatabase();
  const transaction = db.transaction('users', 'readwrite');
  const store = transaction.objectStore('users');

  store.add(user);
  transaction.oncomplete = () => {
    console.log('User added successfully!');
  };
  transaction.onerror = (event) => {
    console.error('Error adding user:', event.target.error);
  };
}
