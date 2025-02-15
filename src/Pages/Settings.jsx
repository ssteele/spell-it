import { useEffect, useState } from 'react'

import { SupportedLanguageCodes, SupportedLanguageMeta } from '@/Constants/Words';
import { getUser, getUsers, updateUser } from '@/Repositories/User';
import { SupportedLanguageLevels } from '../Constants/Words';

export function Settings({ db }) {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);

  const [selectedUserId, setSelectedUserId] = useState(() => {
    const stateSelectedUserId = localStorage.getItem('state-selected-user-id');
    return stateSelectedUserId ? stateSelectedUserId : '';
  });

  const [selectedUserLevel, setSelectedUserLevel] = useState(() => {
    return user ? user?.currentLevel : 0;
  });

  const [selectedLanguageCode, setSelectedLanguageCode] = useState(() => {
    const stateSelectedLanguageCode = localStorage.getItem('state-selected-language-code');
    return (stateSelectedLanguageCode && SupportedLanguageCodes.includes(stateSelectedLanguageCode)) ? stateSelectedLanguageCode : 'en';
  });

  const [repeatThreshold, setRepeatThreshold] = useState(() => {
    const stateRepeatThreshold = localStorage.getItem('state-repeat-threshold');
    return stateRepeatThreshold ? stateRepeatThreshold : 8;
  });

  const [doShowHints, setDoShowHints] = useState(() => {
    const stateDoShowHints = localStorage.getItem('state-do-show-hints');
    return stateDoShowHints ? 'false' !== stateDoShowHints : true;
  });

  const [doHintsMatchMouth, setDoHintsMatchMouth] = useState(() => {
    const stateDoHintsMatchMouth = localStorage.getItem('state-do-hints-match-mouth');
    return stateDoHintsMatchMouth ? 'false' !== stateDoHintsMatchMouth : true;
  });

  const [hintCount, setHintCount] = useState(() => {
    const stateHintCount = localStorage.getItem('state-hint-count');
    return stateHintCount ? stateHintCount : 4;
  });

  const [doVoiceWords, setDoVoiceWords] = useState(() => {
    const stateDoVoiceWords = localStorage.getItem('state-do-voice-words');
    return stateDoVoiceWords ? 'false' !== stateDoVoiceWords : true;
  });

  const [doVoiceInput, setDoVoiceInput] = useState(() => {
    const stateDoVoiceInput = localStorage.getItem('state-do-voice-input');
    return stateDoVoiceInput ? 'false' !== stateDoVoiceInput : true;
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
        setSelectedUserLevel(user?.currentLevel);
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
    updateUser(db, { ...user, currentLevel: numberLevel });
  }

  const persistSelectedLanguageCode = (languageCode) => {
    setSelectedLanguageCode(languageCode);
    localStorage.setItem('state-selected-language-code', languageCode);
  }

  const persistRepeatThreshold = (count) => {
    setRepeatThreshold(count);
    localStorage.setItem('state-repeat-threshold', count);
  }

  const persistDoShowHints = (doShowHints) => {
    setDoShowHints(doShowHints);
    localStorage.setItem('state-do-show-hints', doShowHints);
  }

  const persistDoHintsMatchMouth = (doHintsMatchMouth) => {
    setDoHintsMatchMouth(doHintsMatchMouth);
    localStorage.setItem('state-do-hints-match-mouth', doHintsMatchMouth);
  }

  const persistHintCount = (count) => {
    setHintCount(count);
    localStorage.setItem('state-hint-count', count);
  }

  const persistDoVoiceWords = (doVoiceWords) => {
    setDoVoiceWords(doVoiceWords);
    localStorage.setItem('state-do-voice-words', doVoiceWords);
  }

  const persistDoVoiceInput = (doVoiceInput) => {
    setDoVoiceInput(doVoiceInput);
    localStorage.setItem('state-do-voice-input', doVoiceInput);
  }

  return (
    <>
      <section className="w-1/2 mt-16 mx-auto">
        <h1 className="mb-20 text-6xl lg:mb-12 lg:text-4xl">Settings</h1>

        <section className="text-4xl lg:text-2xl">
          <section className="mt-8 lg:mt-4 grid grid-cols-2 gap-12">
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

          <section className="mt-8 lg:mt-4 grid grid-cols-2 gap-12">
            <label htmlFor="selectUserLevel">Level:</label>
            <select
              name="selectUserLevel"
              id="selectUserLevel"
              value={selectedUserLevel}
              onChange={(e) => persistSelectedUserLevel(e?.target?.value)}
            >
              { SupportedLanguageLevels.map((level, idx) => (
                <option
                  key={idx}
                  value={level}
                >{level}</option>
              ))}
            </select>
          </section>

          <section className="mt-8 lg:mt-4 grid grid-cols-2 gap-12">
            <label htmlFor="selectLanguageCode">Language:</label>
            <select
              name="selectLanguageCode"
              id="selectLanguageCode"
              value={selectedLanguageCode}
              onChange={(e) => persistSelectedLanguageCode(e?.target?.value)}
            >
              { SupportedLanguageMeta.map((language, idx) => (
                <option
                  key={idx}
                  value={language?.code}
                >{language?.name}</option>
              ))}
            </select>
          </section>

          <section className="mt-8 lg:mt-4 grid grid-cols-2 gap-12">
            <label htmlFor="selectLanguageCode">Repeat threshold:</label>
              <input
                placeholder="10"
                type="text"
                value={repeatThreshold}
                onChange={(e) => persistRepeatThreshold(e?.target?.value)}
              />
          </section>

          <section className="mt-8 px-4 py-6 grid grid-cols-1 gap-x-12 border-2 border-gray-300 rounded-lg lg:mt-4">
            <section>
              <input
                checked={doShowHints}
                className="h-6 w-6"
                id="doShowHints"
                name="doShowHints"
                type="checkbox"
                onChange={(e) => persistDoShowHints(e?.target?.checked)}
              />
              <label htmlFor="doShowHints"> Hints:</label>
            </section>

            {doShowHints && (
              <section className="mt-4 mx-8 grid grid-cols-1 gap-y-2 lg:grid-cols-2 lg:gap-x-12">
                <section>
                  <input
                    checked={doHintsMatchMouth}
                    className="h-6 w-6"
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
                  onChange={(e) => persistHintCount(e?.target?.value)}
                />
              </section>
            )}
          </section>

          <section className="mt-8 lg:mt-4">
            <input
              checked={doVoiceWords}
              className="h-6 w-6"
              id="doVoiceWords"
              name="doVoiceWords"
              type="checkbox"
              onChange={(e) => persistDoVoiceWords(e?.target?.checked)}
            />
            <label htmlFor="doVoiceWords"> Voice words</label>
          </section>

          <section className="mt-8 lg:mt-4">
            <input
              checked={doVoiceInput}
              className="h-6 w-6"
              id="doVoiceInput"
              name="doVoiceInput"
              type="checkbox"
              onChange={(e) => persistDoVoiceInput(e?.target?.checked)}
            />
            <label htmlFor="doVoiceInput"> Voice input</label>
          </section>
        </section>
      </section>
    </>
  )
}

export default Settings
