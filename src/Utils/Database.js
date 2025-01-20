import { migration1 } from '@/Migrations/Migration_1.js';

const dbTable = 'SpellingGameDB';
const dbVersion = 1;

let db = null;

function getDatabase() {
  return new Promise((resolve, reject) => {
    if (db) {
      // return existing connection
      return resolve(db);
    }

    // open new connection
    const request = indexedDB.open(dbTable, dbVersion);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // set up object stores (only runs if the DB doesn't exist or version changes)
      if (!db.objectStoreNames.contains('users')) {
        const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true, });
        userStore.createIndex('nameIndex', 'name', { unique: false });
        userStore.createIndex('emailIndex', 'email', { unique: true });
      }

      if (!db.objectStoreNames.contains('words')) {
        const wordStore = db.createObjectStore('words', { keyPath: 'id', autoIncrement: true, });
        wordStore.createIndex('languageIndex', 'language', { unique: false });
        wordStore.createIndex('levelIndex', 'level', { unique: false });
      }

      if (!db.objectStoreNames.contains('progress')) {
        const progressStore = db.createObjectStore('progress', { keyPath: 'id', autoIncrement: true, });
        progressStore.createIndex('userIdIndex', 'userId', { unique: false });
        progressStore.createIndex('wordIdIndex', 'wordId', { unique: false });
      }

      switch (dbVersion) {
        case 1:
          migration1();
          break;
      
        default:
          break;
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db); // return the database connection
    };

    request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
}

export { getDatabase };
