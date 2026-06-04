import { useEffect, useState } from 'react';
import { postJson } from '../api.js';
import VonNeumannParamsPanel from '../components/VonNeumannParamsPanel.jsx';

export default function Zadanie2({ theme }) {
  const [seed, setSeed] = useState(12);
  const [mDigits, setMDigits] = useState(2);
  const [count, setCount] = useState(100);
  const [steps, setSteps] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadSteps() {
      setError('');

      try {
        const result = await postJson(
          '/api/von-neumann',
          { seed, digits: mDigits, count },
          controller.signal,
        );
        setSteps(result.steps);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Nie można pobrać wyników z backendu Python.');
        }
      }
    }

    loadSteps();

    return () => controller.abort();
  }, [seed, mDigits, count]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <VonNeumannParamsPanel
        seed={seed}
        setSeed={setSeed}
        mDigits={mDigits}
        setMDigits={setMDigits}
        count={count}
        setCount={setCount}
        theme={theme}
      />

      {error && <div style={errorStyle}>{error}</div>}

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
          Metoda środkowych kwadratów
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
          {steps.map((step, i) => (
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
              <strong>{step.value}</strong>
            </div>
          ))}
        </div>

        <h3
          style={{
            fontSize: '14px',
            marginBottom: '15px',
          }}
        >
          Szczegółowa wizualizacja obliczeń
        </h3>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {steps.map((step, i) => (
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
                  {step.prev}^2 = {step.square}
                </span>

                <div style={{ fontSize: '16px' }}>
                  <span style={{ color: '#94a3b8' }}>{step.prefix}</span>

                  <span
                    style={{
                      color: theme.primary,
                      fontWeight: 'bold',
                      border: `1px solid ${theme.primary}`,
                      padding: '0 4px',
                      background: 'rgba(37,99,235,0.05)',
                    }}
                  >
                    {step.middle}
                  </span>

                  <span style={{ color: '#94a3b8' }}>{step.suffix}</span>
                </div>

                <div
                  style={{
                    fontWeight: 'bold',
                  }}
                >
                  -&gt; {step.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {steps.length > 0 && steps[steps.length - 1].value === 0 && (
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
