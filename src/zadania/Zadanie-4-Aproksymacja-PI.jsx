import useMemo, useState, useEffect } from 'react';
import { LehmerGenerator } from "../Generators";
import { estimatePi } from "../MathUtils";
import { InlineMath, BlockMath } from 'react-katex';

function ControlPanel({ params, setParams, theme }) {
    const [draft, setDraft] = useState(params);

    useEffect(() => {
        setDraft(params);
    }, [params]);

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
        color: theme.text || "#64748b"
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
        background: "#2563eb",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "14px",
        cursor: "pointer",
        whiteSpace: "nowrap",
        boxShadow: "0 2px 6px rgba(37,99,235,0.3)",
        transition: "opacity 0.2s"
    };

    return (
        <section style={{
            background: theme.card,
            padding: "20px",
            borderRadius: 12,
            border: `1px solid ${theme.border}`,
            marginBottom: 20,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
        }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr)) auto",
                gap: 15,
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
                    <label style={labelStyle}>Próbki (n)</label>
                    <input type="number" name="n" value={draft.n} onChange={handleChange} style={inputStyle} />
                </div>
                <button style={buttonStyle} onClick={handleApply}>
                    ▶ Oblicz PI
                </button>
            </div>
        </section>
    );
}

export default function Zadanie4({ params, setParams, theme }) {

    const piResults = useMemo(() => {
        const L_int = Math.round(2 + Math.log2(params.k));
        const m_val = Math.pow(2, L_int);
        const gen = new LehmerGenerator(params.x0, m_val, params.a);

        const start = performance.now();
        const value = estimatePi(gen, params.n);
        const end = performance.now();

        return {
            value,
            m_val,
            L_int,
            time: (end - start).toFixed(2)
        };
    }, [params]);

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>

            <ControlPanel params={params} setParams={setParams} theme={theme} />

            <section style={{
                background: theme.card,
                padding: "25px",
                borderRadius: 12,
                border: `1px solid ${theme.border}`,
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
            }}>
                <h2 style={{ color: theme.header, marginTop: 0, borderBottom: `1px solid ${theme.border}`, paddingBottom: 10 }}>
                    Zadanie 4: Aproksymacja liczby <InlineMath math="\pi" />
                </h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 15 }}>

                    <div style={{ background: "#f8fafc", padding: "15px", borderRadius: 8, fontSize: "14px" }}>
                        <p style={{ fontWeight: "bold", margin: "0 0 10px 0" }}>Model geometryczny:</p>
                        <ul style={{ paddingLeft: 20, color: "#475569" }}>
                            <li>Obszar <InlineMath math="A = [-1, 1] \times [-1, 1]" /></li>
                            <li>Koło <InlineMath math="x^2 + y^2 \leq 1" /></li>
                            <li>Transformacja: <InlineMath math="X = 2U-1" /></li>
                        </ul>
                        <div style={{ marginTop: 10, textAlign: "center" }}>
                            <BlockMath math="\pi \approx 4 \cdot \frac{N_{trafień}}{N_{ogółem}}" />
                        </div>
                    </div>

                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        background: "#f0f9ff",
                        borderRadius: 8,
                        border: "1px solid #bae6fd"
                    }}>
                        <span style={{ fontSize: "12px", color: "#0369a1", fontWeight: "bold" }}>OSZACOWANE PI</span>
                        <div style={{ fontSize: "3.5rem", fontWeight: "bold", color: "#0284c7", margin: "5px 0" }}>
                            {piResults.value.toFixed(6)}
                        </div>
                        <div style={{ fontSize: "13px", color: "#0369a1" }}>
                            Błąd: <strong>{Math.abs(Math.PI - piResults.value).toFixed(7)}</strong>
                        </div>
                    </div>
                </div>

                <div style={{
                    marginTop: 20,
                    padding: "10px",
                    borderTop: `1px solid ${theme.border}`,
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    color: theme.muted
                }}>
                    <span>Generator LCG: <InlineMath math={`m = 2^{${piResults.L_int}} = ${piResults.m_val}`} /></span>
                    <span>Czas obliczeń: {piResults.time} ms</span>
                    <span>N = {params.n}</span>
                </div>
            </section>
        </div>
    );
}