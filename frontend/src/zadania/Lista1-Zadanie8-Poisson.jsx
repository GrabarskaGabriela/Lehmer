import { useEffect, useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { postJson } from '../api.js';

const initialData = {
  lambdaValue: 2,
  samples: [],
  histogram: [],
  stats: { mean: 0, variance: 0 },
  theoreticalMean: 2,
  theoreticalVariance: 2,
  modulus: 0,
  lValue: 0,
};

export default function Lista1Poisson({ theme }) {
  const [params, setParams] = useState({
    k: 536870912,
    a: 1103515245,
    x0: 12345,
    n: 100,
    lambda: 2,
  });
  const [data, setData] = useState(initialData);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      setError('');

      try {
        const result = await postJson('/api/poisson', params, controller.signal);
        setData(result);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Nie można pobrać wyników z backendu Python.');
        }
      }
    }

    loadData();

    return () => controller.abort();
  }, [params]);

  const maxCount = Math.max(1, ...data.histogram.map((item) => item.count));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <section style={cardStyle(theme)}>
        <p style={eyebrowStyle}>Lista 1 - Zadanie 8</p>
        <h2 style={{ color: theme.header, marginTop: 0 }}>
          Generowanie rozkładu Poissona
        </h2>
        <p style={{ color: theme.muted, lineHeight: 1.7 }}>
          Liczby jednostajne generowane są algorytmem LCG Lehmera, a następnie zamieniane na
          wartości rozkładu Poissona metodą dystrybuanty skumulowanej.
        </p>
        <BlockMath math="P(X = k) = e^{-\lambda}\frac{\lambda^k}{k!}" />
      </section>

      <ParamsPanel params={params} setParams={setParams} theme={theme} />

      {error && <div style={errorStyle}>{error}</div>}

      <section style={cardStyle(theme)}>
        <h3 style={sectionTitleStyle}>Wyniki</h3>
        <div style={statsGridStyle}>
          <ResultBox label="Średnia z próby" value={data.stats.mean.toFixed(4)} />
          <ResultBox label="Wariancja z próby" value={data.stats.variance.toFixed(4)} />
          <ResultBox label="E(X) teoretyczne" value={data.theoreticalMean.toFixed(4)} />
          <ResultBox label="Var(X) teoretyczne" value={data.theoreticalVariance.toFixed(4)} />
        </div>

        <p style={{ color: theme.muted, fontSize: 13, marginBottom: 0 }}>
          LCG: <InlineMath math={`m=2^{${data.lValue}}=${data.modulus}`} /> | lambda ={' '}
          {data.lambdaValue}
        </p>
      </section>

      <section style={cardStyle(theme)}>
        <h3 style={sectionTitleStyle}>Histogram wartości</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.histogram.map((item) => (
            <div key={item.value} style={barRowStyle}>
              <span style={barLabelStyle}>{item.value}</span>
              <div style={barTrackStyle}>
                <div
                  style={{
                    ...barFillStyle,
                    width: `${(item.count / maxCount) * 100}%`,
                  }}
                />
              </div>
              <span style={barCountStyle}>{item.count}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={cardStyle(theme)}>
        <h3 style={sectionTitleStyle}>Pierwsze próbki</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>i</th>
                <th style={cellStyle}>U_i</th>
                <th style={cellStyle}>X_i</th>
                <th style={cellStyle}>F(X_i)</th>
              </tr>
            </thead>
            <tbody>
              {data.samples.slice(0, 30).map((sample) => (
                <tr key={sample.index}>
                  <td style={cellStyle}>{sample.index}</td>
                  <td style={cellStyle}>{sample.u.toFixed(6)}</td>
                  <td style={cellStyle}>{sample.value}</td>
                  <td style={cellStyle}>{sample.cumulative.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ParamsPanel({ params, setParams, theme }) {
  const updateParam = (name) => (event) => {
    setParams((current) => ({
      ...current,
      [name]: Number(event.target.value),
    }));
  };

  return (
    <section style={cardStyle(theme)}>
      <h3 style={sectionTitleStyle}>Parametry</h3>
      <div style={inputGridStyle}>
        <Input label="Okres k" value={params.k} onChange={updateParam('k')} />
        <Input label="Mnożnik a" value={params.a} onChange={updateParam('a')} />
        <Input label="Ziarno X0" value={params.x0} onChange={updateParam('x0')} />
        <Input label="Liczba próbek n" value={params.n} onChange={updateParam('n')} />
        <Input label="Lambda" value={params.lambda} onChange={updateParam('lambda')} step="0.1" />
      </div>
    </section>
  );
}

function Input({ label, value, onChange, step = '1' }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontWeight: 700 }}>
      <span style={{ fontSize: 12 }}>{label}</span>
      <input type="number" value={value} onChange={onChange} step={step} style={inputStyle} />
    </label>
  );
}

function ResultBox({ label, value }) {
  return (
    <div style={resultBoxStyle}>
      <small style={{ color: '#64748b', fontWeight: 700 }}>{label}</small>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#065f46' }}>{value}</div>
    </div>
  );
}

const cardStyle = (theme) => ({
  background: theme.card,
  padding: '24px',
  borderRadius: 12,
  border: `1px solid ${theme.border}`,
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
});

const eyebrowStyle = {
  margin: '0 0 8px',
  color: '#059669',
  fontSize: '12px',
  fontWeight: 700,
  textTransform: 'uppercase',
};

const sectionTitleStyle = {
  marginTop: 0,
  marginBottom: 14,
};

const inputGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: 14,
};

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '9px 10px',
  borderRadius: 6,
  border: '1px solid #cbd5e1',
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 14,
  marginBottom: 14,
};

const resultBoxStyle = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  padding: 14,
};

const barRowStyle = {
  display: 'grid',
  gridTemplateColumns: '48px 1fr 48px',
  gap: 10,
  alignItems: 'center',
};

const barLabelStyle = {
  fontFamily: 'monospace',
  fontWeight: 700,
};

const barTrackStyle = {
  height: 14,
  background: '#ecfdf5',
  borderRadius: 999,
  overflow: 'hidden',
};

const barFillStyle = {
  height: '100%',
  background: '#10b981',
};

const barCountStyle = {
  textAlign: 'right',
  fontFamily: 'monospace',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#ffffff',
};

const cellStyle = {
  border: '1px solid #cbd5e1',
  padding: '9px 12px',
  textAlign: 'center',
};

const errorStyle = {
  padding: '12px 16px',
  borderRadius: 8,
  background: '#fef2f2',
  border: '1px solid #fecaca',
  color: '#991b1b',
};
