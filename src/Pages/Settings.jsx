import { useEffect, useState } from 'react'

import { DEFAULT_SETTING } from '@/Constants/Settings';
import { SUPPORTED_LANGUAGE_CODES, SUPPORTED_LANGUAGE_LEVELS, SUPPORTED_LANGUAGE_META } from '@/Constants/Words';
import { getUser, getUsers, updateUser } from '@/Repositories/User';

export function Settings({ db }) {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  const [selectedUserId, setSelectedUserId] = useState(() => {
    const stateSelectedUserId = localStorage.getItem('state-selected-user-id');
    return stateSelectedUserId ? stateSelectedUserId : '';
  });

  const [selectedUserLevel, setSelectedUserLevel] = useState(() => {
    const stateSelectedLevel = localStorage.getItem('state-selected-level');
    return stateSelectedLevel ? stateSelectedLevel : DEFAULT_SETTING?.selectedUserLevel;
  });

  const [selectedUserLanguage, setSelectedUserLanguage] = useState(() => {
    const stateSelectedLanguageCode = localStorage.getItem('state-selected-language-code');
    return (stateSelectedLanguageCode && SUPPORTED_LANGUAGE_CODES.includes(stateSelectedLanguageCode))
      ? stateSelectedLanguageCode : DEFAULT_SETTING?.selectedUserLanguage;
  });

  const [repeatNext, setRepeatNext] = useState(() => {
    const stateRepeatNext = localStorage.getItem('state-repeat-next');
    return stateRepeatNext ? stateRepeatNext : DEFAULT_SETTING?.repeatNext;
  });

  const [doShowHints, setDoShowHints] = useState(() => {
    const stateDoShowHints = localStorage.getItem('state-do-show-hints');
    return stateDoShowHints ? 'false' !== stateDoShowHints : DEFAULT_SETTING?.doShowHints;
  });

  const [doHintsMatchMouth, setDoHintsMatchMouth] = useState(() => {
    const stateDoHintsMatchMouth = localStorage.getItem('state-do-hints-match-mouth');
    return stateDoHintsMatchMouth ? 'false' !== stateDoHintsMatchMouth : DEFAULT_SETTING?.doHintsMatchMouth;
  });

  const [hintCount, setHintCount] = useState(() => {
    const stateHintCount = localStorage.getItem('state-hint-count');
    return stateHintCount ? stateHintCount : DEFAULT_SETTING?.hintCount;
  });

  const [doFocusInput, setDoFocusInput] = useState(() => {
    const stateDoFocusInput = localStorage.getItem('state-do-focus-input');
    return stateDoFocusInput ? 'false' !== stateDoFocusInput : DEFAULT_SETTING?.doFocusInput;
  });

  const [doVoiceWords, setDoVoiceWords] = useState(() => {
    const stateDoVoiceWords = localStorage.getItem('state-do-voice-words');
    return stateDoVoiceWords ? 'false' !== stateDoVoiceWords : DEFAULT_SETTING?.doVoiceWords;
  });

  const [doVoiceInput, setDoVoiceInput] = useState(() => {
    const stateDoVoiceInput = localStorage.getItem('state-do-voice-input');
    return stateDoVoiceInput ? 'false' !== stateDoVoiceInput : DEFAULT_SETTING?.doVoiceInput;
  });

  const [doTrackProgress, setDoTrackProgress] = useState(() => {
    const stateDoTrackProgress = localStorage.getItem('state-do-track-progress');
    return stateDoTrackProgress ? 'false' !== stateDoTrackProgress : DEFAULT_SETTING?.doTrackProgress;
  });

  useEffect(() => {
    getUsers(db).then((users) => {
      setUsers(users);
    }).catch((error) => {
      console.error('Error getting users:', error);
    });
  }, [db]);

  useEffect(() => {
    const userId = Number(selectedUserId);
    if (userId) {
      getUser(db, userId).then((user) => {
        setUser(user);

        const userLevel = user?.currentLevel || DEFAULT_SETTING?.selectedUserLevel;
        setSelectedUserLevel(userLevel);
        localStorage.setItem('state-selected-level', userLevel);

        const userLanguage = user?.currentLanguage || DEFAULT_SETTING?.selectedUserLanguage;
        setSelectedUserLanguage(userLanguage);
        localStorage.setItem('state-selected-language-code', userLanguage);

        const userHintCount = user?.currentHintCount || DEFAULT_SETTING?.hintCount;
        setHintCount(userHintCount);
        localStorage.setItem('state-hint-count', userHintCount);
      }).catch((error) => {
        console.error('Error getting user:', error);
      });
    }
  }, [selectedUserId]);

  const persistSelectedUserId = (userId) => {
    setSelectedUserId(userId);
    localStorage.setItem('state-selected-user-id', userId);
  }

  const persistSelectedUserLevel = (level) => {
    const numberLevel = Number(level);
    setSelectedUserLevel(numberLevel);
    localStorage.setItem('state-selected-level', level);
    updateUser(db, { ...user, currentLevel: numberLevel });
  }

  const persistSelectedUserLanguage = (languageCode) => {
    setSelectedUserLanguage(languageCode);
    localStorage.setItem('state-selected-language-code', languageCode);
    updateUser(db, { ...user, currentLanguage: languageCode });
  }

  const persistDoShowHints = (doShowHints) => {
    setDoShowHints(doShowHints);
    localStorage.setItem('state-do-show-hints', doShowHints);
  }

  const persistDoHintsMatchMouth = (doHintsMatchMouth) => {
    setDoHintsMatchMouth(doHintsMatchMouth);
    localStorage.setItem('state-do-hints-match-mouth', doHintsMatchMouth);
  }

  const persistUserHintCount = (count) => {
    setHintCount(count);
    localStorage.setItem('state-hint-count', count);
    updateUser(db, { ...user, currentHintCount: count });
  }

  const persistRepeatNext = (count) => {
    setRepeatNext(count);
    localStorage.setItem('state-repeat-next', count);
  }

  const persistDoFocusInput = (doFocusInput) => {
    setDoFocusInput(doFocusInput);
    localStorage.setItem('state-do-focus-input', doFocusInput);
  }

  const persistDoVoiceWords = (doVoiceWords) => {
    setDoVoiceWords(doVoiceWords);
    localStorage.setItem('state-do-voice-words', doVoiceWords);
  }

  const persistDoVoiceInput = (doVoiceInput) => {
    setDoVoiceInput(doVoiceInput);
    localStorage.setItem('state-do-voice-input', doVoiceInput);
  }

  const persistDoTrackProgress = (doTrackProgress) => {
    setDoTrackProgress(doTrackProgress);
    localStorage.setItem('state-do-track-progress', doTrackProgress);
  }

  return (
    <>
      <section className="w-9/12 my-8 mx-auto text-lg lg:text-xl lg:w-1/2">
        <section className="mb-4 grid grid-cols-2">
          <h1 className="mb-8 text-2xl lg:mb-12 lg:text-4xl">Settings</h1>

          <nav className="grid grid-cols-3 gap-3 justify-self-end">
            <a href="/" >
              <img
                className="h-8 w-8 sm:h-8 sm:w-8"
                src="img/play.svg"
              />
            </a>

            <a href="/?p=report">
              <img
                className="h-8 w-8 sm:h-8 sm:w-8"
                src="img/report.svg"
              />
            </a>

            <span className="opacity-25">
              <img
                className="h-8 w-8 sm:h-8 sm:w-8"
                src="img/settings.svg"
              />
            </span>
          </nav>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-12">
          <label htmlFor="selectUserId">User:</label>
          <select
            name="selectUserId"
            id="selectUserId"
            value={selectedUserId}
            onChange={(e) => persistSelectedUserId(e?.target?.value)}
          >
            {!selectedUserId && (
              <option value="0"></option>
            )}

            {users.length && users.map((u, idx) => (
              <option
                key={idx}
                value={u?.id}
              >{u?.name}</option>
            ))}
          </select>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-12">
          <label htmlFor="selectUserLevel">Level:</label>
          <select
            name="selectUserLevel"
            id="selectUserLevel"
            value={selectedUserLevel}
            onChange={(e) => persistSelectedUserLevel(e?.target?.value)}
          >
            { SUPPORTED_LANGUAGE_LEVELS.map((level, idx) => (
              <option
                key={idx}
                value={level}
              >{level}</option>
            ))}
          </select>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-12">
          <label htmlFor="selectUserLanguage">Language:</label>
          <select
            name="selectUserLanguage"
            id="selectUserLanguage"
            value={selectedUserLanguage}
            onChange={(e) => persistSelectedUserLanguage(e?.target?.value)}
          >
            { SUPPORTED_LANGUAGE_META.map((language, idx) => (
              <option
                key={idx}
                value={language?.code}
              >{language?.name}</option>
            ))}
          </select>
        </section>

        <section className="mt-4 px-4 py-6 grid grid-cols-1 gap-x-12 border-2 border-gray-300 rounded-lg">
          <section>
            <input
              checked={doShowHints}
              className="h-3 w-3 lg:h-5 lg:w-5"
              id="doShowHints"
              name="doShowHints"
              type="checkbox"
              onChange={(e) => persistDoShowHints(e?.target?.checked)}
            />
            <label htmlFor="doShowHints"> Hints:</label>
          </section>

          {doShowHints && (
            <section className="mt-2 mx-8 grid grid-cols-1 gap-y-2 lg:grid-cols-2 lg:gap-x-12">
              <section>
                <input
                  checked={doHintsMatchMouth}
                  className="h-3 w-3 lg:h-5 lg:w-5"
                  id="doHintsMatchMouth"
                  name="doHintsMatchMouth"
                  type="checkbox"
                  onChange={(e) => persistDoHintsMatchMouth(e?.target?.checked)}
                />
                <label htmlFor="doHintsMatchMouth"> Match mouth</label>
              </section>

              <input
                placeholder="Hint count"
                type="text"
                value={hintCount}
                onChange={(e) => persistUserHintCount(e?.target?.value)}
              />
            </section>
          )}
        </section>

        <section className="mt-4 grid grid-cols-2 gap-12">
          <label htmlFor="repeatNext">Repeat next:</label>
          <input
            id="repeatNext"
            placeholder="10"
            type="text"
            value={repeatNext}
            onChange={(e) => persistRepeatNext(e?.target?.value)}
          />
        </section>

        <section className="mt-4">
          <input
            checked={doFocusInput}
            className="h-3 w-3 lg:h-5 lg:w-5"
            id="doFocusInput"
            name="doFocusInput"
            type="checkbox"
            onChange={(e) => persistDoFocusInput(e?.target?.checked)}
          />
          <label htmlFor="doFocusInput"> Focus input</label>
        </section>

        <section className="mt-4">
          <input
            checked={doVoiceWords}
            className="h-3 w-3 lg:h-5 lg:w-5"
            id="doVoiceWords"
            name="doVoiceWords"
            type="checkbox"
            onChange={(e) => persistDoVoiceWords(e?.target?.checked)}
          />
          <label htmlFor="doVoiceWords"> Voice words</label>
        </section>

        <section className="mt-4">
          <input
            checked={doVoiceInput}
            className="h-3 w-3 lg:h-5 lg:w-5"
            id="doVoiceInput"
            name="doVoiceInput"
            type="checkbox"
            onChange={(e) => persistDoVoiceInput(e?.target?.checked)}
          />
          <label htmlFor="doVoiceInput"> Voice input</label>
        </section>

        <section className="mt-4">
          <input
            checked={doTrackProgress}
            className="h-3 w-3 lg:h-5 lg:w-5"
            id="doTrackProgress"
            name="doTrackProgress"
            type="checkbox"
            onChange={(e) => persistDoTrackProgress(e?.target?.checked)}
          />
          <label htmlFor="doTrackProgress"> Track progress</label>
        </section>
      </section>
    </>
  )
}

export default Settings
