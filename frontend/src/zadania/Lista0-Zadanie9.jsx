import { useEffect, useState } from 'react';
import { getJson } from '../api.js';

const danePoczatkowe = {
  xValues: [],
  yValues: [],
  probabilities: [],
  px: [],
  py: [],
  expectedX: 0,
  expectedY: 0,
  expectedXY: 0,
  expectedX2: 0,
  expectedY2: 0,
  covariance: 0,
  varianceX: 0,
  varianceY: 0,
  rho: 0,
  independenceComparisons: [],
  isIndependent: false,
  isLinearlyDependent: false,
};

export default function Zadanie9({ theme }) {
  const [dane, ustawDane] = useState(danePoczatkowe);
  const [blad, ustawBlad] = useState('');

  useEffect(() => {
    const kontroler = new AbortController();

    async function pobierzWynikiZadania() {
      ustawBlad('');

      try {
        const wynik = await getJson('/api/lista0/zadanie9', kontroler.signal);
        ustawDane(wynik);
      } catch (bladZapytania) {
        if (bladZapytania.name !== 'AbortError') {
          ustawBlad('Nie można pobrać wyników z backendu Python.');
        }
      }
    }

    pobierzWynikiZadania();

    return () => kontroler.abort();
  }, []);

  const formatujLiczbe = (wartosc, cyfry = 4) =>
    Number(wartosc.toFixed(cyfry)).toString().replace('.', ',');

  const opisNiezaleznosci = dane.isIndependent
    ? 'X i Y są stochastycznie niezależne'
    : 'X i Y nie są stochastycznie niezależne';

  const opisZaleznosciLiniowej = dane.isLinearlyDependent
    ? 'X i Y są liniowo zależne'
    : 'X i Y nie są liniowo zależne';

  return (
    <div style={pageStyle}>
      {blad && <div style={badAnswerStyle}>{blad}</div>}

      <section style={cardStyle(theme)}>
        <h2 style={{ ...titleStyle, color: theme.header }}>Zadanie 9</h2>
      </section>

      <section style={cardStyle(theme)}>
        <h3 style={sectionTitleStyle}>Rozkłady brzegowe</h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>X \ Y</th>
                {dane.yValues.map((wartoscY) => (
                  <th key={wartoscY} style={cellStyle}>
                    {wartoscY}
                  </th>
                ))}
                <th style={cellStyle}>P(X)</th>
              </tr>
            </thead>
            <tbody>
              {dane.xValues.map((wartoscX, indeksWiersza) => (
                <tr key={wartoscX}>
                  <th style={cellStyle}>{wartoscX}</th>
                  {dane.yValues.map((wartoscY, indeksKolumny) => (
                    <td key={wartoscY} style={cellStyle}>
                      {formatujLiczbe(dane.probabilities[indeksWiersza][indeksKolumny], 1)}
                    </td>
                  ))}
                  <td style={highlightCellStyle}>{formatujLiczbe(dane.px[indeksWiersza], 1)}</td>
                </tr>
              ))}
              <tr>
                <th style={cellStyle}>P(Y)</th>
                {dane.py.map((prawdopodobienstwo, indeksKolumny) => (
                  <td key={indeksKolumny} style={highlightCellStyle}>
                    {formatujLiczbe(prawdopodobienstwo, 1)}
                  </td>
                ))}
                <td style={highlightCellStyle}>1</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={gridTwoStyle}>
          <div style={calcBoxStyle}>
            <div>P(X=1) = 0,1 + 0,2 + 0,3 = 0,6</div>
            <div>P(X=2) = 0,1 + 0,1 + 0,2 = 0,4</div>
          </div>
          <div style={calcBoxStyle}>
            <div>P(Y=3) = 0,1 + 0,1 = 0,2</div>
            <div>P(Y=2) = 0,2 + 0,1 = 0,3</div>
            <div>P(Y=1) = 0,3 + 0,2 = 0,5</div>
          </div>
        </div>
      </section>

      <section style={cardStyle(theme)}>
        <h3 style={sectionTitleStyle}>Wartości oczekiwane</h3>

        <div style={gridThreeStyle}>
          <div style={calcBoxStyle}>
            E(X) = 1 * 0,6 + 2 * 0,4 = {formatujLiczbe(dane.expectedX, 1)}
          </div>
          <div style={calcBoxStyle}>
            E(Y) = 3 * 0,2 + 2 * 0,3 + 1 * 0,5 = {formatujLiczbe(dane.expectedY, 1)}
          </div>
          <div style={calcBoxStyle}>E(XY) = {formatujLiczbe(dane.expectedXY, 1)}</div>
        </div>

        <div style={calcBoxStyle}>
          <div>E(XY) = 1*3*0,1 + 1*2*0,2 + 1*1*0,3 + 2*3*0,1 + 2*2*0,1 + 2*1*0,2</div>
          <div>E(XY) = 0,3 + 0,4 + 0,3 + 0,6 + 0,4 + 0,4 = 2,4</div>
        </div>
      </section>

      <section style={cardStyle(theme)}>
        <h3 style={sectionTitleStyle}>Podpunkt a. Kowariancja</h3>

        <div style={calcBoxStyle}>
          <div>cov(X,Y) = E(XY) - E(X)E(Y)</div>
          <div>cov(X,Y) = 2,4 - 1,4 * 1,7</div>
          <div>cov(X,Y) = 2,4 - 2,38 = 0,02</div>
        </div>

        <div style={answerStyle}>cov(X,Y) = {formatujLiczbe(dane.covariance, 2)}</div>
      </section>

      <section style={cardStyle(theme)}>
        <h3 style={sectionTitleStyle}>Podpunkt b. Współczynnik korelacji</h3>

        <div style={gridTwoStyle}>
          <div style={calcBoxStyle}>
            <div>E(X^2) = 1^2 * 0,6 + 2^2 * 0,4 = {formatujLiczbe(dane.expectedX2, 1)}</div>
            <div>Var(X) = 2,2 - 1,4^2 = {formatujLiczbe(dane.varianceX, 2)}</div>
          </div>
          <div style={calcBoxStyle}>
            <div>
              E(Y^2) = 3^2 * 0,2 + 2^2 * 0,3 + 1^2 * 0,5 = {formatujLiczbe(dane.expectedY2, 1)}
            </div>
            <div>Var(Y) = 3,5 - 1,7^2 = {formatujLiczbe(dane.varianceY, 2)}</div>
          </div>
        </div>

        <div style={calcBoxStyle}>
          <div>rho(X,Y) = cov(X,Y) / sqrt(Var(X) * Var(Y))</div>
          <div>rho(X,Y) = 0,02 / sqrt(0,24 * 0,61)</div>
          <div>rho(X,Y) ≈ {formatujLiczbe(dane.rho, 4)}</div>
        </div>

        <div style={answerStyle}>rho(X,Y) ≈ {formatujLiczbe(dane.rho, 4)}</div>
      </section>

      <section style={cardStyle(theme)}>
        <h3 style={sectionTitleStyle}>Podpunkt c. Niezależność stochastyczna</h3>

        <div style={calcBoxStyle}>
          <div>Warunek: p_ij = p_i * p_j</div>
        </div>

        <div style={{ overflowX: 'auto', marginBottom: 16 }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Para</th>
                <th style={cellStyle}>p_ij</th>
                <th style={cellStyle}>p_i</th>
                <th style={cellStyle}>p_j</th>
                <th style={cellStyle}>p_i * p_j</th>
                <th style={cellStyle}>Porownanie</th>
              </tr>
            </thead>
            <tbody>
              {dane.independenceComparisons.map((porownanie) => (
                <tr key={`${porownanie.x}-${porownanie.y}`}>
                  <td style={cellStyle}>
                    X={porownanie.x}, Y={porownanie.y}
                  </td>
                  <td style={cellStyle}>{formatujLiczbe(porownanie.jointProbability, 2)}</td>
                  <td style={cellStyle}>{formatujLiczbe(porownanie.px, 2)}</td>
                  <td style={cellStyle}>{formatujLiczbe(porownanie.py, 2)}</td>
                  <td style={cellStyle}>
                    {formatujLiczbe(porownanie.px, 2)} * {formatujLiczbe(porownanie.py, 2)} ={' '}
                    {formatujLiczbe(porownanie.product, 2)}
                  </td>
                  <td style={porownanie.isEqual ? goodCellStyle : badCellStyle}>
                    {formatujLiczbe(porownanie.jointProbability, 2)}{' '}
                    {porownanie.isEqual ? '=' : '!='} {formatujLiczbe(porownanie.product, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={dane.isIndependent ? answerStyle : badAnswerStyle}>{opisNiezaleznosci}</div>
      </section>

      <section style={cardStyle(theme)}>
        <h3 style={sectionTitleStyle}>Podpunkt d. Zależność liniowa</h3>

        <div style={calcBoxStyle}>
          <div>Y = aX + b</div>
          <div>Dla X = 1 mamy: Y należy do {'{3, 2, 1}'}</div>
          <div>P(1,3) &gt; 0, P(1,2) &gt; 0, P(1,1) &gt; 0</div>
        </div>

        <div style={dane.isLinearlyDependent ? answerStyle : badAnswerStyle}>
          {opisZaleznosciLiniowej}
        </div>
      </section>
    </div>
  );
}

const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
};

const cardStyle = (theme) => ({
  background: theme.card,
  padding: 20,
  borderRadius: 12,
  border: `1px solid ${theme.border}`,
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.08)',
});

const titleStyle = {
  marginTop: 0,
  marginBottom: 14,
};

const sectionTitleStyle = {
  marginTop: 0,
  marginBottom: 14,
};

const calcBoxStyle = {
  background: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  padding: 14,
  lineHeight: 1.9,
  overflowX: 'auto',
};

const gridTwoStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  gap: 16,
  marginTop: 16,
  marginBottom: 16,
};

const gridThreeStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 16,
  marginBottom: 16,
};

const answerStyle = {
  background: '#ecfdf5',
  border: '1px solid #bbf7d0',
  color: '#166534',
  borderRadius: 8,
  padding: 14,
  fontWeight: 700,
  textAlign: 'center',
};

const badAnswerStyle = {
  ...answerStyle,
  background: '#fef2f2',
  border: '1px solid #fecaca',
  color: '#991b1b',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#ffffff',
};

const cellStyle = {
  border: '1px solid #cbd5e1',
  padding: '10px 14px',
  textAlign: 'center',
};

const highlightCellStyle = {
  ...cellStyle,
  fontWeight: 700,
  background: '#f0f9ff',
};

const goodCellStyle = {
  ...cellStyle,
  fontWeight: 700,
  color: '#166534',
  background: '#ecfdf5',
};

const badCellStyle = {
  ...cellStyle,
  fontWeight: 700,
  color: '#991b1b',
  background: '#fef2f2',
};
