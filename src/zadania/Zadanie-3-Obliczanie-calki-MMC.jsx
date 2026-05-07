import { useState, useMemo } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import { LehmerGenerator } from "../Generators";

export default function Zadanie3({ theme }) {
    const [kPeriod, setKPeriod] = useState(1024);
    const [aMult, setAMult] = useState(48271);
    const [seed, setSeed] = useState(12345);
    const [nPoints, setNPoints] = useState(100);

    const TABULAR_VALUE = 0.746824;

    const data = useMemo(() => {
        const L_int = Math.round(Math.log2(kPeriod) + 2);
        const m_val = Math.pow(2, L_int);

        const generator = new LehmerGenerator(seed, m_val, aMult);
        let sum = 0;
        const sequence = [];

        for (let i = 0; i < nPoints; i++)
        {
            const val = generator.nextFloat();
            if (i < nPoints) sequence.push(val);
            sum += Math.exp(-Math.pow(val, 2));
        }

        const theta = sum / nPoints;
        const error = Math.abs(theta - TABULAR_VALUE);

        return { theta, error, m_val, L_int, sequence };
    }, [kPeriod, aMult, seed, nPoints]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <section style={{ background: theme.card, padding: "20px", borderRadius: 12, border: `1px solid ${theme.border}` }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "bold" }}>Okres (k):</label>
                        <input type="number" value={kPeriod} onChange={(e) => setKPeriod(parseInt(e.target.value) || 1)} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "bold" }}>Mnożnik (a):</label>
                        <input type="number" value={aMult} onChange={(e) => setAMult(parseInt(e.target.value) || 1)} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "bold" }}>Ziarno (X₀):</label>
                        <input type="number" value={seed} onChange={(e) => setSeed(parseInt(e.target.value) || 1)} style={inputStyle} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "bold" }}>Liczba próbek (n):</label>
                        <input type="number" value={nPoints} onChange={(e) => setNPoints(parseInt(e.target.value) || 1)} style={inputStyle} />
                    </div>
                </div>
            </section>

            <section style={cardStyle(theme)}>
                <h2 style={{ color: theme.header, marginTop: 0 }}>Zadanie 3: Całkowanie Monte Carlo (Live)</h2>

                <div style={{ textAlign: "center", background: "#f8fafc", padding: "10px", borderRadius: 8, marginBottom: 15 }}>
                    <BlockMath math="\theta = \int_{0}^{1} e^{-x^2} dx \approx \frac{1}{n} \sum_{i=1}^{n} e^{-x_i^2}" />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
                    <div style={{ ...resBox, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
                        <small>Obliczone θ</small>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#16a34a" }}>{data.theta.toFixed(6)}</div>
                    </div>
                    <div style={{ ...resBox, background: "#fef2f2", border: "1px solid #fecaca" }}>
                        <small>Błąd bezwzględny</small>
                        <div style={{ fontSize: "24px", fontWeight: "bold", color: "#dc2626" }}>{data.error.toFixed(6)}</div>
                    </div>
                </div>

                <div style={{ marginTop: 15, fontSize: "12px", color: "#64748b", textAlign: "center" }}>
                    Parametry LCG: <InlineMath math={`m=2^{${data.L_int}}=${data.m_val}`} /> | Wartość tablicowa: <strong>{TABULAR_VALUE}</strong>
                </div>
            </section>

            <section style={cardStyle(theme)}>
                <h3 style={{ fontSize: "14px", marginTop: 0 }}>Podgląd pierwszych próbek (xᵢ):</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {data.sequence.map((val, i) => (
                        <div key={i} style={{ padding: "4px 8px", background: "#1e293b", color: "#f8fafc", borderRadius: 4, fontFamily: "monospace", fontSize: "11px" }}>
                            {val.toFixed(5)}
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

const inputStyle = { width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc", marginTop: "4px" };
const cardStyle = (theme) => ({ background: theme.card, padding: "20px", borderRadius: 12, border: `1px solid ${theme.border}` });
const resBox = { padding: "15px", borderRadius: "8px", textAlign: "center" };