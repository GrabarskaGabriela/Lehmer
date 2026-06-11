import { useState } from 'react';

import AlgorytmLehmera from './prezentacja/LehmerLCG.jsx';
import Zadanie2 from './prezentacja/VonNeumannMiddleSquare.jsx';

import Lista0 from './zadania/Lista0-Zadanie9.jsx';
import Zadanie3 from './zadania/Lista1-Zadanie8-Rozklad-Poissona.jsx';
import Zadanie4 from './zadania/Lista2-Zadanie-4-Proces-Poissona.jsx';

const theme = {
  primary: '#10b981',
  header: '#065f46',
  bg: '#f0fdf4',
  card: '#ffffff',
  border: '#bbf7d0',
  text: '#14532d',
  muted: '#4b5563',
};

export default function App() {
  const [activeTab, setActiveTab] = useState('zad1');

  const [params, setParams] = useState({
    k: 100,
    a: 101,
    x0: 3,
    n: 100,
  });

  const navItemStyle = (id) => ({
    padding: '10px 20px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: 6,
    fontWeight: 'bold',
    background: activeTab === id ? theme.primary : 'transparent',
    color: activeTab === id ? 'white' : theme.text,
    transition: '0.2s',
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.bg,
      }}
    >
      <header
        style={{
          background: theme.header,
          color: 'white',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '1.5rem',
          }}
        >
          Gabriela Grabarska 43840 s3PAM 1(2) - Podstawy Symulacji Komputerowej – 2026
        </h1>
      </header>

      <nav
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 10,
          padding: '20px',
          background: 'white',
          borderBottom: `1px solid ${theme.border}`,
          flexWrap: 'wrap',
        }}
      >
        <button style={navItemStyle('zad1')} onClick={() => setActiveTab('zad1')}>
          Algorytm LCG Lehmera
        </button>

        <button style={navItemStyle('zad2')} onClick={() => setActiveTab('zad2')}>
          Algorytm kwadratowy von Neumanna
        </button>

        <button style={navItemStyle('lista0')} onClick={() => setActiveTab('lista0')}>
          Lista 0
        </button>

        <button style={navItemStyle('zad3')} onClick={() => setActiveTab('zad3')}>
          Lista 1
        </button>

        <button style={navItemStyle('zad4')} onClick={() => setActiveTab('zad4')}>
          Lista 2
        </button>
      </nav>

      <main
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: '20px',
        }}
      >
        <section
          style={{
            animation: 'fadeIn 0.3s ease-in',
          }}
        >
          {activeTab === 'zad1' && <AlgorytmLehmera params={params} setParams={setParams} theme={theme} />}

          {activeTab === 'zad2' && <Zadanie2 theme={theme} />}

          {activeTab === 'lista0' && <Lista0 params={params} theme={theme} />}

          {activeTab === 'zad3' && <Zadanie3 params={params} theme={theme} />}

          {activeTab === 'zad4' && <Zadanie4 params={params} theme={theme} />}
        </section>
      </main>

      <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
    </div>
  );
}
