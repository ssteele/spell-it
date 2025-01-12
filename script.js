const { useEffect, useState } = React;

const wordList = {
  en: [
    'bag', 'bat', 'bed', 'box', 'bus', 'can', 'car', 'cat', 'cow', 'cup', 'dog', 'fox', 'hat', 'hen', 'leg', 'pan', 'pig', 'run', 'six',
    'sun', 'ten', 'top', 'wet',
  ],
  es: [
    'cama', 'casa', 'gato', 'luna', 'mano', 'mesa', 'moto', 'nube', 'pato', 'pelo', 'piña', 'rana', 'sol', 'taza', 'tren', 'vaca',
  ],
};
const letterList = {
  en: [...'abcdefghijklmnopqrstuvwxyz'],
  es: [...'abcdefghijklmnñopqrstuvwxyz'],
};
const supportedLanguages = Object.keys(wordList);

const stateSelectedLanguage = localStorage.getItem('state-selected-language');
const selectedLanguage = (stateSelectedLanguage && supportedLanguages.includes(stateSelectedLanguage)) ? stateSelectedLanguage : 'en';

const stateDoShowHints = localStorage.getItem('state-do-show-hints');
const doShowHints = stateDoShowHints ? 'false' !== stateDoShowHints : true;

const stateHintCount = localStorage.getItem('state-hint-count');
const hintCount = stateHintCount ? Number(stateHintCount) : 4;

const targetList = wordList[selectedLanguage];
const target = targetList[Math.floor(Math.random() * targetList.length)];
const alphabetLetters = letterList[selectedLanguage];

function SpellItApp() {
  const [input, setInput] = useState('');
  const [hints, setHints] = useState([]);

  const targetLetters = [...target];

  useEffect(() => {
    const inputEl = document.getElementById('input'); 
    inputEl.focus(); 
  }, []);

  useEffect(() => {
    updateHintLetters(input);
  }, [input]);

  const updateHintLetters = (input) => {
    if (input !== target.slice(0, input.length)) {
      setHints(['_back']);
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

  const clickHint = (letter) => {
    if ('_back' === letter) {
      const backspacedInput = input.substring(0, input.length - 1);
      setInput(backspacedInput);
      return;
    }

    if ('_check' === letter) {
      window.location.reload();
      return;
    }

    setInput(input + letter);
  };

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
      
      <section className="flex h-screen">
        {doShowHints && hintCount > 0 && (
          <section className="grid grid-cols-1 gap-y-20 content-center px-4 bg-gray-200 sm:px-12">
            {hints.map((letter, idx) => (
              <section key={idx} onClick={() => clickHint(letter)}>
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
          {input.length <= target.length && (
            <section>
              <img
                className="h-36 w-36 sm:h-72 sm:w-72"
                src={`img/${selectedLanguage}/targets/${target}.svg`}
              />
            </section>
          )}

          <section className="h-32 min-w-32 text-6xl sm:text-9xl">{input}</section>
        </section>
      </section>
    </>
  )
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<SpellItApp />);
