import { useEffect, useState } from 'react'

import { SupportedLanguages, SupportedLanguageMeta } from '@/Constants/Words';
import { getUser, getUsers, updateUser } from '@/Repositories/User';

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
    return (stateSelectedLanguageCode && SupportedLanguages.includes(stateSelectedLanguageCode)) ? stateSelectedLanguageCode : 'en';
  });

  const [showHints, setShowHints] = useState(() => {
    const stateDoShowHints = localStorage.getItem('state-do-show-hints');
    return stateDoShowHints ? 'false' !== stateDoShowHints : true;
  });

  const [hintsMatchMouth, setHintsMatchMouth] = useState(() => {
    const stateDoHintsMatchMouth = localStorage.getItem('state-do-hints-match-mouth');
    return stateDoHintsMatchMouth ? 'false' !== stateDoHintsMatchMouth : true;
  });

  const [hintCount, setHintCount] = useState(() => {
    const stateHintCount = localStorage.getItem('state-hint-count');
    return stateHintCount ? stateHintCount : 4;
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

  const persistSelectedLanguageCode = (languageCode) => {
    setSelectedLanguageCode(languageCode);
    localStorage.setItem('state-selected-language-code', languageCode);
  }

  const persistSelectedUserLevel = (level) => {
    setSelectedUserLevel(level);
    updateUser(db, { ...user, currentLevel: level });
  }

  const persistShowHints = (doShowHints) => {
    setShowHints(doShowHints);
    localStorage.setItem('state-do-show-hints', doShowHints);
  }

  const persistDoHintsMatchMouth = (doHintsMatchMouth) => {
    setHintsMatchMouth(doHintsMatchMouth);
    localStorage.setItem('state-do-hints-match-mouth', doHintsMatchMouth);
  }

  const persistHintCount = (count) => {
    setHintCount(count);
    localStorage.setItem('state-hint-count', count);
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
            <label htmlFor="selectUserLevel">Level:</label>
            <select
              name="selectUserLevel"
              id="selectUserLevel"
              value={selectedUserLevel}
              onChange={(e) => persistSelectedUserLevel(e?.target?.value)}
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </section>

          <section className="mt-8 px-4 py-6 grid grid-cols-1 gap-x-12 border-2 border-gray-300 rounded-lg lg:mt-4">
            <section>
              <input
                checked={showHints}
                className="h-6 w-6"
                id="showHints"
                name="showHints"
                type="checkbox"
                onChange={(e) => persistShowHints(e?.target?.checked)}
              />
              <label htmlFor="showHints"> Hints:</label>
            </section>

            {showHints && (
              <section className="mt-4 mx-8 grid grid-cols-1 gap-y-2 lg:grid-cols-2 lg:gap-x-12">
                <section>
                  <input
                    checked={hintsMatchMouth}
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
        </section>
      </section>
    </>
  )
}

export default Settings
