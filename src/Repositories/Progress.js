import { MILLISECONDS_TO_ANSWER } from "@/Constants/Time";

export async function updateProgress(
  db,
  userId,
  wordId,
  input,
  isCorrect,
  isComplete,
) {
  const timestamp = Date.now();

  const transaction = db.transaction('progress', 'readwrite');
  const store = transaction.objectStore('progress');

  const index = store.index('userAndWordIndex');
  const request = index.getAll([userId, wordId]);
  request.onsuccess = () => {

    let progress = null;

    const filteredEntries = request.result.filter(entry => {
      const millisecondsElapsed = timestamp - entry?.timestamp;
      if (                                                          // only return entries that are:
        !entry.isComplete                                           // ...not complete
        && millisecondsElapsed < MILLISECONDS_TO_ANSWER             // ...still within time limit
        && input.length >= entry.input.length - 1                   // ...similar number of characters
      ) {
        return entry;
      }
    });
    console.log('SHS filteredEntries:', filteredEntries); // @debug
    if (filteredEntries.length) {
      progress = filteredEntries.at(-1);
    }

    // if no progress exists, create a new entry
    if (!progress) {
      progress = {
        id: timestamp,
        userId,
        wordId,
        errors: 0,
        input,
        isComplete: false,
        timestamp,
      };
    }

    // updates
    progress.input = input;
    progress.isComplete = isComplete;
    progress.timestamp = timestamp;
    if (!isCorrect) {
      progress.errors += 1;
    }

    store.put(progress);
    transaction.oncomplete = () => {
      console.log('Progress updated!');
    };
    transaction.onerror = (event) => {
      console.error('Error updating progress:', event.target.error);
    };
  };
}
