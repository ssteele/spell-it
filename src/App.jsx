import SpellIt from '@/Pages/SpellIt';
import Settings from '@/Pages/Settings';
import { getDatabase } from '@/Utils/Database.js';
import '@/App.css'

const db = getDatabase();

const urlParams = new URLSearchParams(window.location.search);
const page = urlParams.get('p');

function App() {
  switch (page) {
    case 'settings':
      return (
        <Settings
          db={db}
        />
      );
  
    default:
      return (
        <SpellIt
          db={db}
        />
      );
  }
}

export default App
