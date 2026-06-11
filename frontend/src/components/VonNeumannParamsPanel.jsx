import { useState } from 'react';

export default function VonNeumannParamsPanel({
  X0,
  ustawX0,
  m,
  ustawM,
  n,
  ustawN,
  theme,
}) {
  const [szkic, ustawSzkic] = useState({
    X0,
    m,
    n,
  });

  const obsluzZmiane = (e) => {
    const { name, value } = e.target;

    ustawSzkic((poprzedni) => ({
      ...poprzedni,
      [name]: Number(value),
    }));
  };

  const zastosujParametry = () => {
    ustawX0(szkic.X0);
    ustawM(szkic.m);
    ustawN(szkic.n);
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
              name="X0"
              value={szkic.X0}
              onChange={obsluzZmiane}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>m</label>
            <select
              name="m"
              value={szkic.m}
              onChange={obsluzZmiane}
              style={inputStyle}
            >
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
              name="n"
              value={szkic.n}
              onChange={obsluzZmiane}
              style={inputStyle}
            />
          </div>

          <button style={buttonStyle} onClick={zastosujParametry}>
            Generuj ciąg
          </button>
        </div>
      </div>
    </section>
  );
}
