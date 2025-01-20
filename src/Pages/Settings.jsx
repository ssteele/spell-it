import { useState } from 'react'

import { SupportedLanguages } from '@/Constants/Words';

export function Settings({ db }) {
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const stateSelectedLanguage = localStorage.getItem('state-selected-language');
    return (stateSelectedLanguage && SupportedLanguages.includes(stateSelectedLanguage)) ? stateSelectedLanguage : 'en';
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
    return stateHintCount ? Number(stateHintCount) : 4;
  });

  const persistSelectedLanguage = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('state-selected-language', language);
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
            <label htmlFor="selectLanguage">Language:</label>
            <select
              name="selectLanguage"
              id="selectLanguage"
              value={selectedLanguage}
              onChange={(e) => persistSelectedLanguage(e?.target?.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
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
