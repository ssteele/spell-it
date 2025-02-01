export async function createUser(db, user) {
  const transaction = db.transaction('users', 'readwrite');
  const store = transaction.objectStore('users');

  store.add(user);
  transaction.oncomplete = () => {
    console.log('User created!');
  };
  transaction.onerror = (event) => {
    console.error('Error creating user:', event.target.error);
  };
}

export async function updateUser(db, user) {
  const transaction = db.transaction('users', 'readwrite');
  const store = transaction.objectStore('users');

  store.put(user);
  transaction.oncomplete = () => {
    console.log('User updated!');
  };
  transaction.onerror = (event) => {
    console.error('Error updating user:', event.target.error);
  };
}

export async function getUsers(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('users', 'readonly');
    const store = transaction.objectStore('users');

    const request = store.getAll();
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function getUser(db, userId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('users', 'readonly');
    const store = transaction.objectStore('users');

    const request = store.get(userId);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
