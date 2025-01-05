const { useState } = React;

function SpellItApp() {
  const [word, setWord] = useState('foobar');
  const [targetIndex, setTargetIndex] = useState(0);

  const target = 'sun';

  const alphabetLetters = [...'abcdefghijklmnopqrstuvwxyz'];
  const targetLetters = [...target];
  const targetLetter = targetLetters[targetIndex];

  const hintCount = 4;
  const hintLetters = [...alphabetLetters]
    .sort(() => Math.random() - 0.5)
    .slice(0, hintCount - 1)
    .concat(targetLetter)
    .sort(() => Math.random() - 0.5);


  return (
    <>
      <input
        className="input fixed p-2 top-4 right-4"
        id="input"
        placeholder="Spell it"
        type="text"
        value={word}
        onChange={(e) => {
          const text = e?.target?.value;
          setWord(text);
        }}
      />
      
      <section className="body flex h-screen mx-12">
        {hintCount > 0 && (
          <section className="grid grid-cols-1 gap-y-20 content-center">
            {hintLetters.map((letter, idx) => (
              <section className="abc" key={idx}>
                <span className="text-2xl font-bold">{letter}</span>
                <img
                  className="max-h-24 max-w-24"
                  src={`img/abcs/${letter}.svg`}
                />
              </section>
            ))} 
          </section>
        )}

        <section className="main grid grid-cols-1 gap-y-8 w-full items-center justify-items-center">
          <section className="target">
            <img
              className="h-72 w-72"
              src={`img/target/${target}.svg`}
            />
          </section>

          <section className="word h-32 text-9xl">{word}</section>
        </section>
      </section>
    </>
  )
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<SpellItApp />);
