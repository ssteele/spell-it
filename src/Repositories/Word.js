
export async function addWord(db, word) {
  const transaction = db.transaction('words', 'readwrite');
  const store = transaction.objectStore('words');

  store.add(word);
  transaction.oncomplete = () => {
    console.log('Word added successfully!');
  };
  transaction.onerror = (event) => {
    console.error('Error adding word:', event.target.error);
  };
}

export async function getWords(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('words', 'readonly');
    const store = transaction.objectStore('words');

    const index = store.index('levelIndex');
    const request = index.getAll(0);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function getWordsByLevelAndLanguage(db, level, language) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('words', 'readonly');
    const store = transaction.objectStore('words');
    const index = store.index('levelAndLanguageIndex');

    // Compound key as an array
    const keyRange = IDBKeyRange.only([level, language]);

    const request = index.getAll(keyRange);
    request.onsuccess = () => {
      resolve(request.result); // Returns an array of matching words
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

export async function getWord(db, wordId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('words', 'readonly');
    const store = transaction.objectStore('words');

    const request = store.get(wordId);
    request.onsuccess = () => {
      resolve(request.result);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
