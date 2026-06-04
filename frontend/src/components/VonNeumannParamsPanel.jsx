import { useState } from 'react';

export default function VonNeumannParamsPanel({
  seed,
  setSeed,
  mDigits,
  setMDigits,
  count,
  setCount,
  theme,
}) {
  const [draft, setDraft] = useState({
    seed,
    mDigits,
    count,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setDraft((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleApply = () => {
    setSeed(draft.seed);
    setMDigits(draft.mDigits);
    setCount(draft.count);
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    minWidth: 130,
  };

  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: theme.muted,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  };

  const inputStyle = {
    width: '100%',
    height: 38,
    padding: '0 10px',
    borderRadius: 8,
    border: `1px solid ${theme.border}`,
    background: '#fff',
    color: theme.text,
    fontSize: 14,
    fontWeight: 600,
    boxSizing: 'border-box',
    outline: 'none',
  };

  const buttonStyle = {
    height: 38,
    padding: '0 24px',
    borderRadius: 8,
    border: 'none',
    background: theme.primary,
    color: '#fff',
    fontWeight: 700,
    fontSize: 14,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    boxShadow: '0 4px 10px rgba(37,99,235,0.25)',
  };

  return (
    <section
      style={{
        background: theme.card,
        padding: '16px 20px',
        borderRadius: 14,
        border: `1px solid ${theme.border}`,
        marginBottom: 20,
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 20,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: theme.header,
            }}
          >
            Parametry generatora von Neumanna
          </div>

          <div
            style={{
              fontSize: 12,
              color: theme.muted,
              marginTop: 3,
            }}
          >
            Metoda środkowych kwadratów
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: 12,
            flexWrap: 'wrap',
          }}
        >
          <div style={fieldStyle}>
            <label style={labelStyle}>X₀</label>
            <input
              type="number"
              name="seed"
              value={draft.seed}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Liczba cyfr</label>
            <select name="mDigits" value={draft.mDigits} onChange={handleChange} style={inputStyle}>
              <option value={2}>2</option>
              <option value={4}>4</option>
              <option value={6}>6</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
            </select>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>n</label>
            <input
              type="number"
              name="count"
              value={draft.count}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <button style={buttonStyle} onClick={handleApply}>
            ▶ Generuj
          </button>
        </div>
      </div>
    </section>
  );
}
