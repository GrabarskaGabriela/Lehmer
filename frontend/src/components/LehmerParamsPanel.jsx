import { useState } from 'react';

export default function LehmerParamsPanel({ params, setParams, theme }) {
  const [draft, setDraft] = useState(params);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleApply = () => {
    setParams(draft);
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
            Parametry generatora Lehmera
          </div>
          <div
            style={{
              fontSize: 12,
              color: theme.muted,
              marginTop: 3,
            }}
          >
            Generator LCG (Liniowy Generator Kongruentny)
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
            <label style={labelStyle}>k</label>
            <input
              type="number"
              name="k"
              value={draft.k}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>a</label>
            <input
              type="number"
              name="a"
              value={draft.a}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>X₀</label>
            <input
              type="number"
              name="x0"
              value={draft.x0}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>n</label>
            <input
              type="number"
              name="n"
              value={draft.n}
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
