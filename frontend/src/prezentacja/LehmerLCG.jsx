import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';

import { postJson } from '../api.js';
import { Scene3D } from '../components/Scene3D.jsx';
import { Scene2D } from '../components/Scene2D.jsx';
import LehmerParamsPanel from '../components/LehmerParamsPanel.jsx';

const danePoczatkowe = {
  lValue: 0,
  modulus: 0,
  actualPeriod: 0,
  sequence: [],
  stats: { mean: 0, variance: 0 },
  validations: {
    lGreaterThanFour: false,
    periodAtLeastHundred: false,
    multiplierModulo: false,
    seedOdd: false,
  },
};

export default function AlgorytmLehmera({ params: parametry, setParams: ustawParametry, theme }) {
  const [dane, ustawDane] = useState(danePoczatkowe);
  const [czyLaduje, ustawCzyLaduje] = useState(true);
  const [blad, ustawBlad] = useState('');

  useEffect(() => {
    const kontroler = new AbortController();

    async function zaladujDane() {
      ustawCzyLaduje(true);
      ustawBlad('');

      try {
        const wynik = await postJson('/api/lehmer', parametry, kontroler.signal);
        ustawDane(wynik);
        console.log('[Lehmer] Parametry i wyniki', {
          parametry,
          liczbaWartosci: wynik.sequence.length,
          srednia: wynik.stats.mean,
          wariancja: wynik.stats.variance,
          dane: wynik,
        });
      } catch (bladZapytania) {
        if (bladZapytania.name !== 'AbortError') {
          ustawBlad('Nie mozna pobrac wynikow z backendu Python.');
        }
      } finally {
        ustawCzyLaduje(false);
      }
    }

    zaladujDane();

    return () => kontroler.abort();
  }, [parametry]);

  const kolorWalidacji = (wartosc, cel, tolerancja) =>
    Math.abs(wartosc - cel) < tolerancja ? '#16a34a' : '#dc2626';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <LehmerParamsPanel parametry={parametry} ustawParametry={ustawParametry} theme={theme} />

      {blad && <div style={errorStyle}>{blad}</div>}
      {czyLaduje && <div style={loadingStyle}>Liczenie w backendzie Python...</div>}
      <section style={cardStyle(theme)}>
        <h3 style={{ marginTop: 0, marginBottom: 20, color: theme.header }}>
          Parametry konstrukcyjne LCG
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div
            style={{
              background: theme.background ?? '#f9f9f9',
              borderRadius: 10,
              padding: '16px 20px',
              border: `1px solid ${theme.border ?? '#e0e0e0'}`,
            }}
          >
            <p style={{ margin: '0 0 12px 0', fontWeight: 600, fontSize: 14, color: theme.header }}>
              Wyniki parametrow
            </p>
            <div style={{ fontSize: 16, lineHeight: 2 }}>
              <div>
                <em>L</em> = {dane.lValue}
              </div>
              <div>
                <em>m</em> = {dane.modulus}
              </div>
            </div>
          </div>

          <div
            style={{
              background: theme.background ?? '#f9f9f9',
              borderRadius: 10,
              padding: '16px 20px',
              border: `1px solid ${theme.border ?? '#e0e0e0'}`,
            }}
          >
            <p style={{ margin: '0 0 12px 0', fontWeight: 600, fontSize: 14, color: theme.header }}>
              Weryfikacja warunkow
            </p>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <ValidationItem valid={dane.validations.lGreaterThanFour} label="L > 4" />
              <ValidationItem valid={dane.validations.periodAtLeastHundred} label="k >= 100" />
              <ValidationItem valid={dane.validations.multiplierModulo} label="a mod 8 in {3, 5}" />
              <ValidationItem valid={dane.validations.seedOdd} label="X0 jest nieparzyste" />
            </ul>
          </div>
        </div>
      </section>

      <section style={cardStyle(theme)}>
        <h3 style={{ marginTop: 0 }}>Weryfikacja niezaleznosci</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={canvasBoxStyle}>
            <Canvas camera={{ position: [7, 7, 7] }}>
              <Scene3D vals={dane.sequence} />
            </Canvas>
          </div>
          <div style={canvasBoxStyle}>
            <Scene2D vals={dane.sequence} width={400} height={400} />
          </div>
        </div>
      </section>

      <section style={cardStyle(theme)}>
        <h3>Weryfikacja statystyczna</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ ...formulaStyle, textAlign: 'center' }}>
            <p>
              <strong>Srednia arytmetyczna</strong>
            </p>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: kolorWalidacji(dane.stats.mean, 0.5, 0.05),
              }}
            >
              {dane.stats.mean.toFixed(5)}
            </div>
            <small>Cel: 0.5000</small>
          </div>
          <div style={{ ...formulaStyle, textAlign: 'center' }}>
            <p>
              <strong>Wariancja</strong>
            </p>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: kolorWalidacji(dane.stats.variance, 0.0833, 0.01),
              }}
            >
              {dane.stats.variance.toFixed(5)}
            </div>
            <small>Cel: 0.0833 (1/12)</small>
          </div>
        </div>
      </section>

      <section style={cardStyle(theme)}>
        <h3 style={{ marginTop: 0 }}>
          Wygenerowany ciag
          <span
            style={{ marginLeft: 10, fontSize: '13px', fontWeight: 'normal', color: theme.background }}
          >
            (n = {dane.sequence.length})
          </span>
        </h3>
        <div style={listContainerStyle}>
          {dane.sequence.map((wartosc, indeks) => (
            <div key={indeks} style={listItemStyle}>
              <span style={{ color: '#000000', fontSize: '10px' }}>[{indeks}]</span>
              <span style={{ fontWeight: '500', color: '#000000' }}>{wartosc.toFixed(6)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function ValidationItem({ valid, label }) {
  return (
    <li style={{ color: valid ? '#16a34a' : '#dc2626', marginBottom: '2px' }}>
      {valid ? 'OK' : 'NIE'} {label}
    </li>
  );
}

const cardStyle = (theme) => ({
  background: theme.card,
  padding: '20px',
  borderRadius: 12,
  border: `1px solid ${theme.border}`,
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
});

const formulaStyle = {
  background: '#f8fafc',
  padding: '15px',
  borderRadius: 8,
  border: '1px solid #e2e8f0',
};

const canvasBoxStyle = {
  height: 400,
  background: '#fff',
  borderRadius: 12,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid #eee',
  position: 'relative',
};

const listContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
  gap: '6px',
  padding: '15px',
  background: '#f6f8fa',
  borderRadius: '8px',
  fontFamily: 'monospace',
};

const listItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '6px',
  borderBottom: '1px solid #334155',
  padding: '3px 6px',
};

const loadingStyle = {
  padding: '12px 16px',
  borderRadius: 8,
  background: '#eff6ff',
  border: '1px solid #bfdbfe',
  color: '#1d4ed8',
};

const errorStyle = {
  padding: '12px 16px',
  borderRadius: 8,
  background: '#fef2f2',
  border: '1px solid #fecaca',
  color: '#991b1b',
};
