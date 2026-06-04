import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { BlockMath, InlineMath } from 'react-katex';

import { postJson } from '../api.js';
import { Scene3D } from '../components/Scene3D.jsx';
import { Scene2D } from '../components/Scene2D.jsx';
import LehmerParamsPanel from '../components/LehmerParamsPanel.jsx';

const initialData = {
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

export default function Zadanie1({ params, setParams, theme }) {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      setIsLoading(true);
      setError('');

      try {
        const result = await postJson('/api/lehmer', params, controller.signal);
        setData(result);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Nie można pobrać wyników z backendu Python.');
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadData();

    return () => controller.abort();
  }, [params]);

  const getValidationColor = (value, target, tolerance) =>
    Math.abs(value - target) < tolerance ? '#16a34a' : '#dc2626';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <LehmerParamsPanel params={params} setParams={setParams} theme={theme} />

      {error && <div style={errorStyle}>{error}</div>}
      {isLoading && <div style={loadingStyle}>Liczenie w backendzie Python...</div>}

      <section style={cardStyle(theme)}>
        <h3 style={{ marginTop: 0, color: theme.header }}>
          Zadanie 1: Parametry konstrukcyjne LCG
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={formulaStyle}>
            <p>
              <strong>Wzory konstrukcyjne:</strong>
            </p>
            <BlockMath math="m = 2^L" />
            <BlockMath math="k = 2^{L-2}" />
            <BlockMath math="x_j = (a \cdot x_{j-1}) \pmod{m}" />
            <BlockMath math="r_j = x_j / m" />
          </div>

          <div style={formulaStyle}>
            <p>
              <strong>Wyniki parametrów:</strong>
            </p>
            <div style={{ marginBottom: '15px', fontSize: '16px', lineHeight: '1.8' }}>
              <InlineMath math={`L = ${data.lValue}`} /> <br />
              <InlineMath math={`m = ${data.modulus}`} /> <br />
              <InlineMath math={`k = ${data.actualPeriod}`} />
            </div>

            <p
              style={{
                fontSize: '13px',
                fontWeight: 'bold',
                borderTop: '1px solid #ddd',
                paddingTop: '5px',
                marginBottom: '8px',
              }}
            >
              Weryfikacja warunków:
            </p>
            <ul style={{ fontSize: '12px', listStyle: 'none', padding: 0, margin: 0 }}>
              <ValidationItem valid={data.validations.lGreaterThanFour} label="L > 4" />
              <ValidationItem valid={data.validations.periodAtLeastHundred} label="k >= 100" />
              <ValidationItem valid={data.validations.multiplierModulo} label="a mod 8 in {3, 5}" />
              <ValidationItem valid={data.validations.seedOdd} label="X0 jest nieparzyste" />
            </ul>
          </div>
        </div>
      </section>

      <section style={cardStyle(theme)}>
        <h3 style={{ marginTop: 0 }}>Weryfikacja niezależności (2D i 3D)</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={canvasBoxStyle}>
            <Canvas camera={{ position: [7, 7, 7] }}>
              <Scene3D vals={data.sequence} />
            </Canvas>
            <div style={labelOverlay}>Widok 3D (x, y, z)</div>
          </div>
          <div style={canvasBoxStyle}>
            <Scene2D vals={data.sequence} width={380} height={380} />
            <div style={labelOverlay}>Widok 2D (x, y)</div>
          </div>
        </div>
      </section>

      <section style={cardStyle(theme)}>
        <h3>Weryfikacja statystyczna</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ ...formulaStyle, textAlign: 'center' }}>
            <p>
              <strong>
                Średnia arytmetyczna (<InlineMath math="\bar{X}" />)
              </strong>
            </p>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: getValidationColor(data.stats.mean, 0.5, 0.05),
              }}
            >
              {data.stats.mean.toFixed(5)}
            </div>
            <small>Cel: 0.5000</small>
          </div>
          <div style={{ ...formulaStyle, textAlign: 'center' }}>
            <p>
              <strong>
                Wariancja (<InlineMath math="S^2" />)
              </strong>
            </p>
            <div
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: getValidationColor(data.stats.variance, 0.0833, 0.01),
              }}
            >
              {data.stats.variance.toFixed(5)}
            </div>
            <small>Cel: 0.0833 (1/12)</small>
          </div>
        </div>
      </section>

      <section style={cardStyle(theme)}>
        <h3 style={{ marginTop: 0 }}>
          Pełny ciąg wygenerowanych elementów
          <span
            style={{ marginLeft: 10, fontSize: '13px', fontWeight: 'normal', color: theme.muted }}
          >
            (n = {data.sequence.length})
          </span>
        </h3>
        <div style={listContainerStyle}>
          {data.sequence.map((val, idx) => (
            <div key={idx} style={listItemStyle}>
              <span style={{ color: '#94a3b8', fontSize: '10px' }}>[{idx}]</span>
              <span style={{ fontWeight: '500', color: '#f8fafc' }}>{val.toFixed(6)}</span>
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

const labelOverlay = {
  position: 'absolute',
  bottom: 10,
  right: 10,
  fontSize: '10px',
  background: 'rgb(0 0 0 / 0.8)',
  padding: '2px 6px',
  borderRadius: '4px',
  color: '#64748b',
};

const listContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
  gap: '6px',
  padding: '15px',
  background: '#6e838d',
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
