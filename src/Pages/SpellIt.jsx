import { useEffect, useState } from 'react'

import { LETTER_LIST } from '@/Constants/Letters';
import { DEFAULT_SETTING } from '@/Constants/Settings';
import { SUPPORTED_LANGUAGE_CODES, SUPPORTED_LANGUAGE_META } from '@/Constants/Words';
import { getUser } from '@/Repositories/User';
import { updateProgress } from '@/Repositories/Progress';
import { getWordsByLevelAndLanguage } from '@/Repositories/Word';

export function SpellIt({ db }) {
  const [user, setUser] = useState({});
  const [input, setInput] = useState('');
  const [hints, setHints] = useState([]);
  const [words, setWords] = useState([]);
  const [previousWordsSet, setPreviousWordsSet] = useState(new Set());
  const [targetWord, setTargetWord] = useState('');
  const [targetLetters, setTargetLetters] = useState([]);

  const stateSelectedUserId = localStorage.getItem('state-selected-user-id');
  const selectedUserId = stateSelectedUserId ? stateSelectedUserId : 0;

  if (!selectedUserId) {
    setTimeout(() => {
      window.location.href = '?p=settings';
    }, 2000);
  }

  const stateSelectedLevel = localStorage.getItem('state-selected-level');
  const selectedLevel = stateSelectedLevel ? Number(stateSelectedLevel) : DEFAULT_SETTING.selectedUserLevel;

  const stateSelectedLanguageCode = localStorage.getItem('state-selected-language-code');
  const selectedLanguageCode = (stateSelectedLanguageCode && SUPPORTED_LANGUAGE_CODES.includes(stateSelectedLanguageCode))
    ? stateSelectedLanguageCode
    : DEFAULT_SETTING.selectedUserLanguage;

  const stateRepeatThreshold = localStorage.getItem('state-repeat-threshold');
  const repeatThreshold = stateRepeatThreshold ? Number(stateRepeatThreshold) : DEFAULT_SETTING.repeatNext;

  const stateDoShowHints = localStorage.getItem('state-do-show-hints');
  const doShowHints = stateDoShowHints ? 'false' !== stateDoShowHints : DEFAULT_SETTING.doShowHints;

  const stateDoHintsMatchMouth = localStorage.getItem('state-do-hints-match-mouth');
  const doHintsMatchMouth = stateDoHintsMatchMouth ? 'false' !== stateDoHintsMatchMouth : DEFAULT_SETTING.doHintsMatchMouth;

  const stateHintCount = localStorage.getItem('state-hint-count');
  const hintCount = stateHintCount ? Number(stateHintCount) : DEFAULT_SETTING.hintCount;

  const stateDoFocusInput = localStorage.getItem('state-do-focus-input');
  const doFocusInput = stateDoFocusInput ? 'false' !== stateDoFocusInput : DEFAULT_SETTING.doFocusInput;

  const stateDoVoiceWords = localStorage.getItem('state-do-voice-words');
  const doVoiceWords = stateDoVoiceWords ? 'false' !== stateDoVoiceWords : DEFAULT_SETTING.doVoiceWords;

  const stateDoVoiceInput = localStorage.getItem('state-do-voice-input');
  const doVoiceInput = stateDoVoiceInput ? 'false' !== stateDoVoiceInput : DEFAULT_SETTING.doVoiceInput;

  const stateDoTrackProgress = localStorage.getItem('state-do-track-progress');
  const doTrackProgress = stateDoTrackProgress ? 'false' !== stateDoTrackProgress : DEFAULT_SETTING.doTrackProgress;

  const voiceSynth = window?.speechSynthesis;
  const utteranceRate = 0.75;

  const alphabetLetters = LETTER_LIST[selectedLanguageCode];
  const vowels = alphabetLetters.filter((letter) => 'aeiou'.includes(letter));
  const consonants = alphabetLetters.filter((letter) => !'aeiou'.includes(letter));

  useEffect(() => {
    if (selectedUserId) {
      getUser(db, Number(selectedUserId)).then((u) => {
        setUser(u);
      }).catch((error) => {
        console.error('Error getting user:', error);
      });
    }
  }, [db]);

  useEffect(() => {
    if (!!user?.id) {
      getWordsByLevelAndLanguage(db, selectedLevel, selectedLanguageCode).then((fetchedWords) => {
        setWords(fetchedWords);
      }).catch((error) => {
        console.error('Error getting words:', error);
      });
    }
  }, [user]);

  useEffect(() => {
    if (words?.length) {
      renderTargetWord(words);
    }
  }, [words]);

  useEffect(() => {
    if (!targetWord?.value) {
      return;
    }
    updateHintLetters('');
  }, [targetWord]);

  useEffect(() => {
    updateUserProgress(input);
    updateHintLetters(input);
    focusInput();
  }, [input]);

  const focusInput = () => {
    if (doFocusInput) {
      const inputEl = document.getElementById('input'); 
      inputEl.focus();
    }
  }

  const updateInput = (input) => {
    setInput(input);
    if (!!input) {
      speakInput(input);
    }
  }

  const getRandomTargetWord = (words) => {
    if (words?.length) {
      const targetWord = words[Math.floor(Math.random() * words?.length)];
      if (previousWordsSet.has(targetWord?.value)) {
        return getRandomTargetWord(words);
      }
      return targetWord;
    }
  };

  const savePreviousWord = (previousWord) => {
    if (previousWord) {
      previousWordsSet.add(previousWord);
      if (previousWordsSet.size > repeatThreshold) {
        const [firstIn] = previousWordsSet;
        previousWordsSet.delete(firstIn);
      }
      setPreviousWordsSet(previousWordsSet);
    }
  };

  const speakTargetWord = (word) => {
    if (!doVoiceWords) return;

    const utterance = new SpeechSynthesisUtterance(word); 
    utterance.lang = synthLanguage();
    utterance.rate = utteranceRate;
    voiceSynth.speak(utterance);
  };

  const speakInput = (input) => {
    if (!doVoiceInput) return;

    const utterance = new SpeechSynthesisUtterance(input); 
    utterance.lang = synthLanguage();
    utterance.rate = utteranceRate;
    voiceSynth.speak(utterance);
  };

  const renderTargetWord = (words) => {
    if (words?.length) {
      const targetWord = getRandomTargetWord(words);
      setTargetWord(targetWord);
      setTargetLetters([...targetWord?.value]);
      updateInput('');
      speakTargetWord(targetWord?.value);
      focusInput();
    }
  };

  const nextWord = (previousWord, words) => {
    savePreviousWord(previousWord);
    renderTargetWord(words);
  };

  const updateUserProgress = (input) => {
    if (!doTrackProgress || !targetWord?.value || !input) {
      return;
    }

    const isCorrect = input === targetWord?.value.slice(0, input.length);
    const isComplete = input === targetWord?.value;

    updateProgress(db, Number(selectedUserId), targetWord?.id, input, isCorrect, isComplete).then((u) => {
    }).catch((error) => {
      console.error('Error updating progress:', error);
    });
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
      updateInput(backspacedInput);
      return;
    }

    if ('_check' === letter) {
      nextWord(input, words);
      return;
    }

    updateInput(input + letter);
  };

  const listenToKey = (key) => {
    if ('Enter' === key && input === targetWord?.value) {
      nextWord(input, words);
    }
  }

  const synthLanguage = () => {
    return SUPPORTED_LANGUAGE_META.find((language) => selectedLanguageCode === language?.code)?.synth || 'en-US';
  };

  const spellItText = () => {
    return SUPPORTED_LANGUAGE_META.find((language) => selectedLanguageCode === language?.code)?.text || 'Spell it';
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
        onChange={(e) => updateInput(e?.target?.value)}
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
                  src={`img/${selectedLanguageCode}/abcs/${letter}.svg`}
                />
              </section>
            ))} 
          </section>
        )}

        <section className="grid grid-cols-1 gap-y-8 w-full items-center justify-items-center">
          {!!targetWord?.value && (input.length <= targetWord?.value?.length) && (
            <section>
              <img
                className="cursor-pointer h-36 w-36 sm:h-72 sm:w-72"
                src={`img/${selectedLanguageCode}/targets/${targetWord?.value}.svg`}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src='img/play.svg';
                }}
                onClick={() => speakTargetWord(targetWord?.value)}
              />
            </section>
          )}

          <section
            className="cursor-pointer h-32 min-w-32 text-6xl sm:text-9xl"
            onClick={() => speakInput(input)}
          >{input}</section>
        </section>
      </section>

      <section className="fixed bottom-4 right-4 text-xs">{user?.name}</section>
    </>
  )
}

export default SpellIt;
