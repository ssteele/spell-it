import { addUser } from '@/Repositories/User.js';
import { addWord } from '@/Repositories/Word.js';
import { getDateOffset } from '@/Utils/Date.js';

export function migration1(db) {
  const words = [
    {
      level: 0,
      en: [
        'ant', 'bag', 'bat', 'bed', 'box', 'bug', 'bus', 'can', 'car', 'cat', 'cow', 'cup', 'dog', 'fan', 'fox', 'hat', 'hen', 'jar', 'leg',
        'map', 'net', 'owl', 'pan', 'pig', 'pot', 'run', 'saw', 'six', 'sun', 'ten', 'top', 'tub', 'wet',
      ],
      es: [
        'agua', 'baño', 'boca', 'bote', 'caja', 'cama', 'casa', 'dos', 'foca', 'fotos', 'gato', 'jugo', 'lobo', 'luna', 'mano', 'mesa', 'mono',
        'moto', 'nido', 'nube', 'ojos', 'pala', 'pan', 'pata', 'pato', 'pelo', 'pie', 'piña', 'queso', 'rana', 'sol', 'sopa', 'taza', 'toro',
        'tren', 'tres', 'uno', 'vaca',
      ],
    },
    {
      level: 1,
      en: [],
      es: [],
    },
    {
      level: 2,
      en: [],
      es: [],
    },
  ];
  words.map(({ level, en, es }) => {
    en.map(w => addWord(db, { language: 'en', level, value: w }));
    es.map(w => addWord(db, { language: 'es', level, value: w }));
  });

  const users = [
  ];
  users.map(u => addUser(db, u));
}
