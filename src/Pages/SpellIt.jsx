import { useEffect, useState } from 'react'

import { LetterList } from '@/Constants/Letters';
import { SupportedLanguages } from '@/Constants/Words';
import { getUser } from '@/Repositories/User';
import { getWordsByLevelAndLanguage } from '@/Repositories/Word';

const stateSelectedUserId = localStorage.getItem('state-selected-user');
const selectedUserId = stateSelectedUserId ? Number(stateSelectedUserId) : null;

const stateSelectedLanguage = localStorage.getItem('state-selected-language');
const selectedLanguage = (stateSelectedLanguage && SupportedLanguages.includes(stateSelectedLanguage)) ? stateSelectedLanguage : 'en';

const stateDoShowHints = localStorage.getItem('state-do-show-hints');
const doShowHints = stateDoShowHints ? 'false' !== stateDoShowHints : true;

const stateDoHintsMatchMouth = localStorage.getItem('state-do-hints-match-mouth');
const doHintsMatchMouth = stateDoHintsMatchMouth ? 'false' !== stateDoHintsMatchMouth : true;

const stateHintCount = localStorage.getItem('state-hint-count');
const hintCount = stateHintCount ? Number(stateHintCount) : 4;

const alphabetLetters = LetterList[selectedLanguage];
const vowels = alphabetLetters.filter((letter) => 'aeiou'.includes(letter));
const consonants = alphabetLetters.filter((letter) => !'aeiou'.includes(letter));

export function SpellIt({ db }) {
  const [user, setUser] = useState({});
  const [input, setInput] = useState('');
  const [hints, setHints] = useState([]);
  const [words, setWords] = useState([]);
  const [targetWord, setTargetWord] = useState('');
  const [targetLetters, setTargetLetters] = useState([]);

  useEffect(() => {
    focusInput();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      getUser(db, selectedUserId).then((u) => {
        setUser(u);
      }).catch((error) => {
        console.error('Error getting user:', error);
        setUser({});
      });
    }
  }, [db]);

  useEffect(() => {
    const currentLevel = user?.currentLevel || 0;
    getWordsByLevelAndLanguage(db, currentLevel, selectedLanguage).then((words) => {
      setWords(words);
      renderTargetWord(words);
    }).catch((error) => {
      console.error('Error getting words:', error);
    });
  }, [user]);

  useEffect(() => {
    updateHintLetters('');
  }, [targetWord]);

  useEffect(() => {
    updateHintLetters(input);
    focusInput();
  }, [input]);

  const focusInput = () => {
    const inputEl = document.getElementById('input'); 
    inputEl.focus();
  }

  const renderTargetWord = (words) => {
    const targetWord = words[Math.floor(Math.random() * words?.length)];
    setTargetWord(targetWord);
    setTargetLetters([...targetWord?.value]);
    setInput('');
    focusInput();
  };

  const updateHintLetters = (input) => {
    if (!targetWord?.value) {
      return;
    }

    if (input !== targetWord?.value.slice(0, input.length)) {
      setHints(['_back']);
      return;
    }

    if (input === targetWord?.value) {
      setHints(['_check']);
      return;
    }

    const targetIndex = input.length;
    const targetLetter = targetLetters[targetIndex];

    let letters = alphabetLetters;
    if (doHintsMatchMouth) {
      letters = consonants;
      if (vowels.includes(targetLetter)) {
        letters = vowels;
      }
    }

    const hintLetters = [...letters]
      .filter((letter) => letter !== targetLetter)
      .sort(() => Math.random() - 0.5)
      .slice(0, hintCount - 1)
      .concat(targetLetter)
      .sort(() => Math.random() - 0.5);
    setHints(hintLetters);
  };

  const clickHint = (letter) => {
    if ('_back' === letter) {
      const backspacedInput = input.substring(0, input.length - 1);
      setInput(backspacedInput);
      return;
    }

    if ('_check' === letter) {
      renderTargetWord(words);
      return;
    }

    setInput(input + letter);
  };

  const listenToKey = (key) => {
    if ('Enter' === key && input === targetWord?.value) {
      renderTargetWord(words);
    }
  }

  const spellItText = () => {
    switch (selectedLanguage) {
      case 'en':
        return 'Spell it';

      case 'es':
        return 'Deletrealo';
    }
  };

  return (
    <>
      <input
        autoComplete="off"
        className="fixed p-2 top-4 right-4"
        id="input"
        placeholder={spellItText()}
        type="text"
        value={input}
        onKeyUp={(e) => listenToKey(e?.key)}
        onChange={(e) => setInput(e?.target?.value)}
      />

      <section className="flex h-screen">
        {doShowHints && hintCount > 0 && (
          <section className="grid grid-cols-1 gap-y-20 content-center px-4 bg-gray-200 sm:px-12">
            {hints.map((letter, idx) => (
              <section
                className="cursor-pointer"
                key={idx}
                onClick={() => clickHint(letter)}
              >
                {1 === letter.length && (
                  <span className="text-2xl font-bold">{letter}</span>
                )}
                <img
                  className="h-16 w-16 sm:h-24 sm:w-24"
                  src={`img/${selectedLanguage}/abcs/${letter}.svg`}
                />
              </section>
            ))} 
          </section>
        )}

        <section className="grid grid-cols-1 gap-y-8 w-full items-center justify-items-center">
          {!!targetWord?.value && (input.length <= targetWord?.value?.length) && (
            <section>
              <img
                className="h-36 w-36 sm:h-72 sm:w-72"
                src={`img/${selectedLanguage}/targets/${targetWord?.value}.svg`}
              />
            </section>
          )}

          <section className="h-32 min-w-32 text-6xl sm:text-9xl">{input}</section>
        </section>
      </section>

      <section className="fixed bottom-4 right-4">{user?.name}</section>
    </>
  )
}

export default SpellIt;
