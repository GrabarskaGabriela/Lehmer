import { useEffect, useState } from 'react';
import { postJson } from '../api.js';

const initialData = {
  lambdaValue: 2,
  maxTime: 10,
  eventCount: 0,
  events: [],
  moments: [],
  intervals: [],
  finalTime: 0,
  theoreticalMean: 20,
  theoreticalVariance: 20,
  modulus: 0,
  lValue: 0,
};

export default function Lista2PoissonProcess({ theme }) {
  const [params, setParams] = useState({
    k: 100,
    a: 101,
    x0: 3,
    maxTime: 10,
    lambda: 2,
  });
  const [data, setData] = useState(initialData);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      setError('');

      try {
        const result = await postJson('/api/poisson-process', params, controller.signal);
        setData(result);
      } catch (requestError) {
        if (requestError.name !== 'AbortError') {
          setError('Nie mozna pobrac wynikow z backendu Python.');
        }
      }
    }

    loadData();

    return () => controller.abort();
  }, [params]);
  const axisMax = data.maxTime || 10;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '10px' }}>
      <section style={cardStyle(theme)}>
        <h2 style={{ color: theme.header, marginTop: 0 }}>
          Zadanie 4 Generowanie procesu Poissona
        </h2>
      </section>

      <ParamsPanel params={params} setParams={setParams} theme={theme} />

      {error && <div style={errorStyle}>{error}</div>}

      <section style={cardStyle(theme)}>
        <h3 style={sectionTitleStyle}>Wyniki</h3>
        <div style={statsGridStyle}>
          <ResultBox label="Liczba zdarzeń" value={String(data.eventCount)} />
          <ResultBox label="Czas T" value={data.maxTime.toFixed(4)} />
          <ResultBox label="E(N(T))" value={data.theoreticalMean.toFixed(4)} />
          <ResultBox label="Var(N(T))" value={data.theoreticalVariance.toFixed(4)} />
        </div>
      </section>

      <section style={cardStyle(theme)}>
        <h3 style={sectionTitleStyle}>Momenty zdarzeń</h3>
        <div style={containerStyle}>
          <div style={axisLineStyle}>
            <div style={arrowHeadStyle} />
          </div>

          <div style={{ ...gridLineStyle, left: '0%' }}>
            <span style={gridLabelStyle}>0</span>
          </div>
          <div style={{ ...gridLineStyle, left: '90%', borderLeft: '2px dashed #ef4444' }}>
            <span style={{ ...gridLabelStyle, color: '#ef4444', fontWeight: 'bold' }}>
              T = {axisMax}
            </span>
          </div>
          {data.events.map((event) => {
            const percentagePosition = (event.time / axisMax) * 90;
            if (percentagePosition > 90) return null;

            return (
              <div
                key={event.index}
                style={{
                  ...eventWrapperStyle,
                  left: `${percentagePosition}%`,
                }}
              >
                <div style={eventLabelStyle}>S_{event.index}</div>
                <div style={eventStickStyle} />
                <div style={eventDotStyle} />
              </div>
            );
          })}
        </div>
      </section>

      <section style={cardStyle(theme)}>
        <h3 style={sectionTitleStyle}>Tabela zdarzeń</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>j</th>
                <th style={cellStyle}>U_j</th>
                <th style={cellStyle}>X_j (odstęp)</th>
                <th style={cellStyle}>S_j (moment)</th>
              </tr>
            </thead>
            <tbody>
              {data.events.slice(0, 60).map((event) => (
                <tr key={event.index}>
                  <td style={cellStyle}>{event.index}</td>
                  <td style={cellStyle}>{event.u.toFixed(6)}</td>
                  <td style={cellStyle}>{event.interval.toFixed(6)}</td>
                  <td style={cellStyle}>{event.time.toFixed(6)}</td>
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
        <Input label="Mnoznik a" value={params.a} onChange={updateParam('a')} />
        <Input label="Ziarno X0" value={params.x0} onChange={updateParam('x0')} />
        <Input label="Czas T" value={params.maxTime} onChange={updateParam('maxTime')} step="0.1" />
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

const containerStyle = {
  position: 'relative',
  height: '140px',
  margin: '20px 20px 40px 20px',
  paddingTop: '30px',
};

const axisLineStyle = {
  position: 'absolute',
  bottom: '40px',
  left: '0',
  width: '100%',
  height: '3px',
  background: '#334155',
};

const arrowHeadStyle = {
  position: 'absolute',
  right: '-2px',
  top: '-5px',
  width: '0',
  height: '0',
  borderTop: '6px solid transparent',
  borderBottom: '6px solid transparent',
  borderLeft: '10px solid #334155',
};

const gridLineStyle = {
  position: 'absolute',
  bottom: '30px',
  height: '25px',
  borderLeft: '2px solid #64748b',
};

const gridLabelStyle = {
  position: 'absolute',
  bottom: '-24px',
  transform: 'translateX(-50%)',
  fontSize: '13px',
  color: '#334155',
  fontWeight: 600,
};

const eventWrapperStyle = {
  position: 'absolute',
  bottom: '40px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transform: 'translateX(-50%)',
};

const eventLabelStyle = {
  fontSize: '12px',
  fontWeight: '700',
  color: '#0284c7',
  background: '#e0f2fe',
  padding: '2px 6px',
  borderRadius: '4px',
  border: '1px solid #bae6fd',
  whiteSpace: 'nowrap',
  marginBottom: '4px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
};

const eventStickStyle = {
  width: '1px',
  height: '35px',
  background: '#0284c7',
  borderStyle: 'dashed',
  borderWidth: '0 0 0 1px',
};

const eventDotStyle = {
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  background: '#0284c7',
  border: '2px solid #ffffff',
  marginTop: '-4px',
};

const cardStyle = (theme) => ({
  background: theme.card,
  padding: '24px',
  borderRadius: 12,
  border: `1px solid ${theme.border}`,
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
});

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
