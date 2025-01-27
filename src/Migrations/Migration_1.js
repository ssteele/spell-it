import { addUser } from '@/Repositories/User.js';
import { addWord } from '@/Repositories/Word.js';
import { getDateOffset } from '@/Utils/Date.js';

export function migration1(db) {
  const words = [
    {
      level: 0,
      en: [
        'ant', 'bag', 'bat', 'bed', 'box', 'bug', 'bus', 'can', 'car', 'cat', 'cow', 'cup', 'dog', 'fan', 'fox', 'hat', 'hen', 'jar',
        'leg', 'map', 'net', 'owl', 'pan', 'pig', 'pot', 'run', 'saw', 'six', 'sun', 'ten', 'top', 'tub', 'wet',
      ],
      es: [
        'agua', 'baño', 'boca', 'bote', 'caja', 'cama', 'casa', 'dos', 'foca', 'fotos', 'gato', 'jugo', 'lobo', 'luna', 'mano', 'mesa',
        'mono', 'moto', 'nido', 'nube', 'ojos', 'pala', 'pan', 'pata', 'pato', 'pelo', 'pie', 'piña', 'queso', 'rana', 'sol', 'sopa',
        'taza', 'toro', 'tren', 'tres', 'uno', 'vaca',
      ],
    },
    {
      level: 1,
      en: [
        'the', 'and', 'said', 'was', 'with', 'my', 'they', 'you', 'have', 'what', 'are', 'can', 'like', 'she', 'he', 'we', 'to', 'do',
        'come', 'here', 'where', 'who', 'why', 'when', 'one', 'two', 'three', 'four', 'five', 'go', 'no', 'yes', 'all', 'be', 'me', 'on',
        'off', 'up', 'down', 'look',
      ],
      es: [
        'el', 'la', 'de', 'un', 'una', 'los', 'las', 'por', 'para', 'con', 'mi', 'tu', 'su', 'este', 'esta', 'ese', 'esa', 'aquí', 'allí',
        'también', 'comer', 'correr', 'saltar', 'jugar', 'leer', 'escribir', 'mirar', 'escuchar', 'dormir', 'cantar', 'casa', 'libro',
        'lápiz', 'mesa', 'silla', 'mamá', 'papá', 'escuela', 'amigo', 'flor',
      ],
    },
    {
      level: 2,
      en: [
        'about', 'better', 'bring', 'carry', 'clean', 'done', 'draw', 'drink', 'eight', 'fall', 'far', 'full', 'got', 'grow', 'hold',
        'hurt', 'keep', 'kind', 'laugh', 'light', 'long', 'much', 'myself', 'never', 'only', 'own', 'pick', 'seven', 'shall', 'show',
        'six', 'small', 'start', 'ten', 'today', 'together', 'try', 'warm', 'why', 'write',
      ],
      es: [
        'porque', 'cuando', 'donde', 'quien', 'cómo', 'ahora', 'entonces', 'siempre', 'nunca', 'después', 'antes', 'sobre', 'dentro',
        'fuera', 'más', 'menos', 'cada', 'todo', 'algunos', 'ninguno', 'aprender', 'pensar', 'ayudar', 'buscar', 'empezar', 'terminar',
        'contar', 'preguntar', 'responder', 'caminar', 'familia', 'amigo', 'jardín', 'ventana', 'puerta', 'cuaderno', 'mochila', 'pelota',
        'reloj', 'calle',
      ],
    },
    {
      level: 3,
      en: [
        'afraid', 'almost', 'alone', 'along', 'although', 'answer', 'around', 'beautiful', 'believe', 'between', 'building', 'busy',
        'caught', 'change', 'circle', 'clear', 'close', 'complete', 'different', 'direction', 'early', 'enough', 'everything', 'except',
        'favorite', 'finally', 'important', 'inside', 'instead', 'learning', 'money', 'nothing', 'often', 'question', 'reason', 'remember',
        'special', 'straight', 'suddenly', 'through',
      ],
      es: [
        'aunque', 'durante', 'mientras', 'todavía', 'también', 'además', 'ahora', 'entonces', 'luego', 'porque', 'aunque', 'según',
        'debajo', 'encima', 'alrededor', 'adelante', 'atrás', 'juntos', 'solo', 'siempre', 'comprender', 'explicar', 'imaginar',
        'construir', 'dibujar', 'descubrir', 'observar', 'escribir', 'escuchar', 'recordar', 'naturaleza', 'planeta', 'montaña', 'río',
        'ciudad', 'vecino', 'historia', 'aventura', 'pensamiento', 'imaginación',
      ],
    },
    {
      level: 4,
      en: [
        'accident', 'address', 'answer', 'appear', 'arrive', 'attempt', 'attention', 'audience', 'balance', 'believe', 'calendar',
        'career', 'certain', 'challenge', 'character', 'compare', 'complete', 'consider', 'courage', 'create', 'decision', 'describe',
        'develop', 'difference', 'direction', 'discover', 'distance', 'education', 'energy', 'especially', 'example', 'famous', 'favorite',
        'imagine', 'include', 'knowledge', 'prepare', 'reason', 'strength', 'thoughtful',
      ],
      es: [
        'aunque', 'mientras', 'durante', 'entonces', 'también', 'además', 'después', 'alrededor', 'encima', 'debajo', 'siempre', 'nunca',
        'todavía', 'quizá', 'pronto', 'luego', 'porque', 'según', 'entonces', 'porqué', 'analizar', 'comparar', 'decidir', 'entender',
        'explicar', 'investigar', 'organizar', 'participar', 'planear', 'reflexionar', 'ambiente', 'descubrimiento', 'aventura',
        'educación', 'ciencia', 'historia', 'herramienta', 'solución', 'problema', 'proyecto',
      ],
    },
    {
      level: 5,
      en: [
        'accurate', 'advantage', 'ambition', 'analyze', 'argument', 'attention', 'available', 'average', 'boundary', 'calculate', 'career',
        'century', 'challenge', 'community', 'complex', 'conclusion', 'confident', 'consequence', 'convince', 'curiosity', 'determine',
        'develop', 'equation', 'essential', 'estimate', 'evidence', 'explanation', 'flexible', 'frequent', 'generous', 'gratitude',
        'impact', 'improve', 'increase', 'influence', 'organize', 'persuade', 'potential', 'predict', 'resources',
      ],
      es: [
        'aunque', 'mientras', 'durante', 'además', 'alrededor', 'debajo', 'encima', 'finalmente', 'actualmente', 'posiblemente',
        'rápidamente', 'lentamente', 'tampoco', 'todavía', 'quizá', 'sin embargo', 'a pesar de', 'por lo tanto', 'en cambio', 'a menudo',
        'analizar', 'argumentar', 'comparar', 'construir', 'desarrollar', 'evaluar', 'identificar', 'justificar', 'observar', 'resolver',
        'biografía', 'consecuencia', 'evidencia', 'hipótesis', 'información', 'investigación', 'narrativa', 'procedimiento', 'propósito',
        'resumen',
      ],
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
