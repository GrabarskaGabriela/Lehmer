import { useEffect, useState } from 'react';
import { postJson } from '../api.js';
import VonNeumannParamsPanel from '../components/VonNeumannParamsPanel.jsx';

export default function AlgorytmVonNeumanna({ theme }) {
  const [X0, ustawX0] = useState(12);
  const [m, ustawM] = useState(2);
  const [n, ustawN] = useState(100);
  const [kroki, ustawKroki] = useState([]);
  const [blad, ustawBlad] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function zaladujKroki() {
      ustawBlad('');

      try {
        const wynik = await postJson(
          '/api/von-neumann',
          { seed: X0, digits: m, count: n },
          controller.signal,
        );
        ustawKroki(wynik.steps);

        console.log('[von Neumann] Parametry i wyniki', {
          X0,
          m,
          n,
          liczbaWygenerowanychKrokow: wynik.steps.length,
          kroki: wynik.steps,
        });
      } catch (bladZapytania) {
        if (bladZapytania.name !== 'AbortError') {
          ustawBlad('Nie można pobrać wyników z backendu Python.');
        }
      }
    }

    zaladujKroki();

    return () => controller.abort();
  }, [X0, m, n]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <VonNeumannParamsPanel
        X0={X0}
        ustawX0={ustawX0}
        m={m}
        ustawM={ustawM}
        n={n}
        ustawN={ustawN}
        theme={theme}
      />

      {blad && <div style={errorStyle}>{blad}</div>}

      <section
        style={{
          background: theme.card,
          padding: '20px',
          borderRadius: 12,
          border: `1px solid ${theme.border}`,
          color: theme.text,
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: theme.header,
          }}
        >
          Generator von Neumanna
        </h2>

        <p
          style={{
            color: theme.muted,
            marginTop: -5,
            marginBottom: 20,
          }}
        >
          Metoda środka kwadratu
        </p>

        <h3
          style={{
            fontSize: '14px',
            marginBottom: '10px',
          }}
        >
          Wygenerowany ciąg
        </h3>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '30px',
          }}
        >
          {kroki.map((krok, i) => (
            <div
              key={i}
              style={{
                padding: '8px 12px',
                background: '#f1f5f9',
                color: '#1e293b',
                borderRadius: 8,
                fontFamily: 'monospace',
                fontSize: '13px',
                border: '1px solid #e2e8f0',
              }}
            >
              <small style={{ color: '#64748b' }}>X{i + 1}</small>
              <br />
              <strong>{krok.value}</strong>
            </div>
          ))}
        </div>

        <h3
          style={{
            fontSize: '14px',
            marginBottom: '15px',
          }}
        >
          Obliczenia
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {kroki.map((krok, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                background: i % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                fontFamily: 'monospace',
                fontSize: '14px',
              }}
            >
              <div
                style={{
                  minWidth: '60px',
                  fontWeight: 'bold',
                  color: theme.primary,
                }}
              >
                X{i + 1}
              </div>

              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}
              >
                <span>
                  {krok.prev}^2 = {krok.square}
                </span>

                <div style={{ fontSize: '16px' }}>
                  <span style={{ color: '#94a3b8' }}>{krok.prefix}</span>

                  <span
                    style={{
                      color: theme.primary,
                      fontWeight: 'bold',
                      border: `1px solid ${theme.primary}`,
                      padding: '0 4px',
                      background: 'rgba(37,99,235,0.05)',
                    }}
                  >
                    {krok.middle}
                  </span>

                  <span style={{ color: '#94a3b8' }}>{krok.suffix}</span>
                </div>

                <div
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  -&gt; {krok.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {kroki.length > 0 && kroki[kroki.length - 1].value === 0 && (
          <div
            style={{
              marginTop: '20px',
              color: '#dc2626',
              fontSize: '12px',
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
            Generator osiągnął stan 0. Dalsze iteracje zostały zatrzymane.
          </div>
        )}
      </section>
    </div>
  );
}

const errorStyle = {
  padding: '12px 16px',
  borderRadius: 8,
  background: '#fef2f2',
  border: '1px solid #fecaca',
  color: '#991b1b',
};
