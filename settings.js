const { useEffect, useState } = React;

const supportedLanguages = ['en', 'es'];

function SpellItSettings() {
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const stateSelectedLanguage = localStorage.getItem('state-selected-language');
    return (stateSelectedLanguage && supportedLanguages.includes(stateSelectedLanguage)) ? stateSelectedLanguage : 'en';
  });
  const [showHints, setShowHints] = useState(() => {
    const stateDoShowHints = localStorage.getItem('state-do-show-hints');
    return stateDoShowHints ? 'false' !== stateDoShowHints : true;
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

  const persistHintCount = (count) => {
    setHintCount(count);
    localStorage.setItem('state-hint-count', count);
  }

  return (
    <>
      <section className="w-1/2 mt-16 mx-auto">
        <h1 className="mb-20 text-6xl lg:mb-12 lg:text-4xl">Settings</h1>

        <section className="text-4xl lg:text-2xl">
          <section className="mt-8 lg:mt-4">
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

          <section className="mt-8 lg:mt-4">
            <input
              checked={showHints}
              className="h-6 w-6"
              id="showHints"
              name="showHints"
              type="checkbox"
              onChange={(e) => persistShowHints(e?.target?.checked)}
            />
            <label htmlFor="showHints"> Show Hints:</label>

            {showHints && (
              <input
                className="ml-12 p-2 w-16"
                placeholder="Hint count"
                type="text"
                value={hintCount}
                onChange={(e) => persistHintCount(e?.target?.value)}
              />
            )}
          </section>
        </section>
      </section>
    </>
  )
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<SpellItSettings />);
