const { useEffect, useState } = React;

function SpellItSettings() {
  const [showHints, setShowHints] = useState(() => {
    return 'true' === localStorage.getItem('state-do-show-hints');
  });
  const [hintCount, setHintCount] = useState(() => {
    return localStorage.getItem('state-hint-count') ? Number(localStorage.getItem('state-hint-count')) : 4;
  });

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
      <section className="w-1/2 mt-16 mx-auto text-5xl">
        <input
          checked={showHints}
          className="h-8 w-8"
          id="showHints"
          name="showHints"
          type="checkbox"
          onChange={(e) => persistShowHints(e?.target?.checked)}
        />
        <label htmlFor="showHints"> Hints</label>

        {showHints && (
          <input
            className="ml-12 p-2"
            placeholder="Hint count"
            type="text"
            value={hintCount}
            onChange={(e) => persistHintCount(e?.target?.value)}
          />
        )}

      </section>
    </>
  )
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<SpellItSettings />);