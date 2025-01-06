const { useEffect, useState } = React;

const targetList = ['sun', 'bed', 'box', 'can', 'car', 'cat', 'cow', 'dog', 'hat', 'hen', 'pan', 'pig', 'run', 'six', 'ten', 'top'];
const target = targetList[Math.floor(Math.random() * targetList.length)];

function SpellItApp() {
  const [input, setInput] = useState('');
  const [hints, setHints] = useState([]);

  const hintCount = 2;

  const alphabetLetters = [...'abcdefghijklmnopqrstuvwxyz'];
  const targetLetters = [...target];

  const updateHintLetters = (input) => {
    if (input !== target.slice(0, input.length)) {
      setHints(['_blank']);
      return;
    }

    if (input === target) {
      setHints(['_check']);
      return;
    }

    const targetIndex = input.length;
    const targetLetter = targetLetters[targetIndex];
    const hintLetters = [...alphabetLetters]
      .filter((letter) => letter !== targetLetter)
      .sort(() => Math.random() - 0.5)
      .slice(0, hintCount - 1)
      .concat(targetLetter)
      .sort(() => Math.random() - 0.5);
    setHints(hintLetters);
  };

  useEffect(() => {
    const inputEl = document.getElementById('input'); 
    inputEl.focus(); 
  }, []);

  useEffect(() => {
    updateHintLetters(input);
  }, [input]);

  return (
    <>
      <input
        className="fixed p-2 top-4 right-4"
        id="input"
        placeholder="Spell it"
        type="text"
        value={input}
        onChange={(e) => setInput(e?.target?.value)}
      />
      
      <section className="flex h-screen mx-12">
        {hintCount > 0 && (
          <section className="grid grid-cols-1 gap-y-20 content-center">
            {hints.map((letter, idx) => (
              <section key={idx}>
                {1 === letter.length && (
                  <span className="text-2xl font-bold">{letter}</span>
                )}
                <img
                  className="max-h-24 max-w-24"
                  src={`img/abcs/${letter}.svg`}
                />
              </section>
            ))} 
          </section>
        )}

        <section className="grid grid-cols-1 gap-y-8 w-full items-center justify-items-center">
          {input.length <= target.length && (
            <section>
              <img
                className="h-72 w-72"
                src={`img/targets/${target}.svg`}
              />
            </section>
          )}

          <section className="h-32 text-9xl">{input}</section>
        </section>
      </section>
    </>
  )
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<SpellItApp />);
