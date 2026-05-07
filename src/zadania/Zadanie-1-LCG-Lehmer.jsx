import { useMemo, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { BlockMath, InlineMath } from 'react-katex';

import { LehmerGenerator } from "../Generators";
import { getStats } from "../MathUtils";
import { Scene3D } from "../Scene3D";
import { Scene2D } from "../Scene2D";

function ControlPanel({ params, setParams, theme }) {
    const [draft, setDraft] = useState(params);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDraft((prev) => ({ ...prev, [name]: Number(value) }));
    };

    const handleApply = () => {
        setParams(draft);
    };

    const labelStyle = {
        display: "block",
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 5,
        color: theme.text
    };

    const inputStyle = {
        width: "100%",
        padding: "10px",
        borderRadius: 6,
        border: `1px solid ${theme.border}`,
        background: "#fff",
        fontSize: "14px",
        boxSizing: "border-box"
    };

    const buttonStyle = {
        alignSelf: "flex-end",
        padding: "10px 28px",
        borderRadius: 6,
        border: "none",
        background: theme.primary,
        color: "#fff",
        fontWeight: "bold",
        fontSize: "14px",
        cursor: "pointer",
        whiteSpace: "nowrap",
        boxShadow: "0 2px 6px rgba(37,99,235,0.3)",
        transition: "background 0.2s"
    };

    return (
        <section style={{
            background: theme.card,
            padding: "20px",
            borderBottom: `1px solid ${theme.border}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
        }}>
            <div style={{
                maxWidth: 1100,
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr)) auto",
                gap: 20,
                alignItems: "flex-end"
            }}>
                <div>
                    <label style={labelStyle}>Okres (k)</label>
                    <input type="number" name="k" value={draft.k} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Mnożnik (a)</label>
                    <input type="number" name="a" value={draft.a} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Ziarno (X₀)</label>
                    <input type="number" name="x0" value={draft.x0} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Liczba próbek (n)</label>
                    <input type="number" name="n" value={draft.n} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                    <button
                        style={buttonStyle}
                        onClick={handleApply}
                    >
                        ▶ Odśwież
                    </button>
                </div>
            </div>
        </section>
    );
}

export default function Zadanie1({ params, setParams, theme }) {
    const data = useMemo(() => {
        const { k, a, x0, n } = params;
        const L_exact = Math.log2(+k) + 2;
        const L_int = Math.round(L_exact);
        const m_val = Math.pow(2, L_int);
        const k_val = Math.pow(2, L_int - 2);

        const generator = new LehmerGenerator(+x0, m_val, +a);
        const sequence = generator.generateSequence(+n);
        const stats = getStats(sequence);

        return { L_int, m_val, k_val, sequence, stats };
    }, [params]);

    useEffect(() => {
        console.clear();
        console.log("%c--- NOWY CIĄG LCG ---", "color: #2563eb; font-weight: bold; font-size: 14px;");
        console.log("Parametry konstrukcyjne:", {
            L: data.L_int,
            m: data.m_val,
            k: data.k_val,
            a: params.a,
            x0: params.x0
        });
        console.log("Wygenerowane wartości r_j:", data.sequence);
        console.log("Statystyki:", data.stats);
        console.log("-----------------------");
    }, [data, params]);

    const getValidationColor = (value, target, tolerance) =>
        Math.abs(value - target) < tolerance ? "#16a34a" : "#dc2626";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <ControlPanel params={params} setParams={setParams} theme={theme} />

            <section style={cardStyle(theme)}>
                <h3 style={{ marginTop: 0, color: theme.header }}>Zadanie 1: Parametry Konstrukcyjne LCG</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                    <div style={formulaStyle}>
                        <p><strong>Wzory konstrukcyjne:</strong></p>
                        <BlockMath math="m = 2^L" />
                        <BlockMath math="k = 2^{L-2}" />
                        <BlockMath math="x_j = (a \cdot x_{j-1}) \pmod{m}" />
                        <BlockMath math="r_j = x_j / m" />
                    </div>

                    <div style={formulaStyle}>
                        <p><strong>Wyniki parametrów:</strong></p>
                        <div style={{ marginBottom: "15px", fontSize: "16px", lineHeight: "1.8" }}>
                            <InlineMath math={`L = ${data.L_int}`} /> <br/>
                            <InlineMath math={`m = ${data.m_val}`} /> <br/>
                            <InlineMath math={`k = ${data.k_val}`} />
                        </div>

                        <p style={{ fontSize: "13px", fontWeight: "bold", borderTop: "1px solid #ddd", paddingTop: "5px", marginBottom: "8px" }}>
                            Weryfikacja warunków:
                        </p>
                        <ul style={{ fontSize: "12px", listStyle: "none", padding: 0, margin: 0 }}>
                            <li style={{ color: data.L_int > 4 ? "#16a34a" : "#dc2626", marginBottom: "2px" }}>
                                {data.L_int > 4 ? "✓" : "✗"} L &gt; 4
                            </li>
                            <li style={{ color: data.k_val >= 100 ? "#16a34a" : "#dc2626", marginBottom: "2px" }}>
                                {data.k_val >= 100 ? "✓" : "✗"} k ≥ 100
                            </li>
                            <li style={{ color: params.a % 8 === 3 || params.a % 8 === 5 ? "#16a34a" : "#dc2626", marginBottom: "2px" }}>
                                {params.a % 8 === 3 || params.a % 8 === 5 ? "✓" : "✗"} a mod 8 ∈ {"{3, 5}"}
                            </li>
                            <li style={{ color: params.x0 % 2 !== 0 ? "#16a34a" : "#dc2626" }}>
                                {params.x0 % 2 !== 0 ? "✓" : "✗"} X₀ jest nieparzyste
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section style={cardStyle(theme)}>
                <h3 style={{ marginTop: 0 }}>Weryfikacja Niezależności (2D & 3D)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
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
                <h3>Weryfikacja Statystyczna</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div style={{ ...formulaStyle, textAlign: "center" }}>
                        <p><strong>Średnia arytmetyczna (<InlineMath math="\bar{X}" />)</strong></p>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: getValidationColor(data.stats.mean, 0.5, 0.05) }}>
                            {data.stats.mean.toFixed(5)}
                        </div>
                        <small>Cel: 0.5000</small>
                    </div>
                    <div style={{ ...formulaStyle, textAlign: "center" }}>
                        <p><strong>Wariancja (<InlineMath math="S^2" />)</strong></p>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: getValidationColor(data.stats.variance, 0.0833, 0.01) }}>
                            {data.stats.variance.toFixed(5)}
                        </div>
                        <small>Cel: 0.0833 (1/12)</small>
                    </div>
                </div>
            </section>

            <section style={cardStyle(theme)}>
                <h3 style={{ marginTop: 0 }}>
                    Pełny ciąg wygenerowanych elementów
                    <span style={{ marginLeft: 10, fontSize: "13px", fontWeight: "normal", color: theme.muted }}>
                        (n = {data.sequence.length})
                    </span>
                </h3>
                <div style={listContainerStyle}>
                    {data.sequence.map((val, idx) => (
                        <div key={idx} style={listItemStyle}>
                            <span style={{ color: "#94a3b8", fontSize: "10px" }}>[{idx}]</span>
                            <span style={{ fontWeight: "500", color: "#f8fafc" }}>{val.toFixed(6)}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

const cardStyle = (theme) => ({
    background: theme.card,
    padding: "20px",
    borderRadius: 12,
    border: `1px solid ${theme.border}`,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
});

const formulaStyle = {
    background: "#f8fafc",
    padding: "15px",
    borderRadius: 8,
    border: "1px solid #e2e8f0"
};

const canvasBoxStyle = {
    height: 400,
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #eee",
    position: "relative"
};

const labelOverlay = {
    position: "absolute",
    bottom: 10,
    right: 10,
    fontSize: "10px",
    background: "rgb(0 0 0 / 0,8)",
    padding: "2px 6px",
    borderRadius: "4px",
    color: "#64748b"
};

const listContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
    gap: "6px",
    padding: "15px",
    background: "#6e838d",
    borderRadius: "8px",
    fontFamily: "monospace"
};

const listItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "6px",
    borderBottom: "1px solid #334155",
    padding: "3px 6px"
};