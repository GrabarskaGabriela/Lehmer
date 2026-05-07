import { useState, useMemo } from 'react';
import { generateVonNeumann } from "../Generators";

export default function Zadanie2({ theme }) {
    const [seed, setSeed] = useState(12);
    const [mDigits, setMDigits] = useState(2);
    const [count, setCount] = useState(100);

    const steps = useMemo(() => {
        return generateVonNeumann(seed, mDigits, count);
    }, [seed, mDigits, count]);

    return (
        <section style={{ background: theme.card, padding: "20px", borderRadius: 12, color: theme.text }}>
            <h2 style={{ color: theme.header }}>Zadanie 2: Metoda von Neumanna</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px", marginBottom: "30px", padding: "15px", background: "rgba(0,0,0,0.05)", borderRadius: "8px" }}>
                <div>
                    <label style={{ display: "block", fontSize: "12px" }}>Ziarno (X₀):</label>
                    <input type="number" value={seed} onChange={(e) => setSeed(parseInt(e.target.value) || 0)} style={{ width: "100%", padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }} />
                </div>
                <div>
                    <label style={{ display: "block", fontSize: "12px" }}>Liczba cyfr (m):</label>
                    <select value={mDigits} onChange={(e) => setMDigits(parseInt(e.target.value))} style={{ width: "100%", padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }}>
                        <option value={2}>2 (m=2)</option>
                        <option value={4}>4 (m=4)</option>
                        <option value={6}>6 (m=6)</option>
                        <option value={8}>8 (m=8)</option>
                        <option value={10}>10 (m=10)</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: "block", fontSize: "12px" }}>Ile liczb (n):</label>
                    <input type="number" value={count} onChange={(e) => setCount(parseInt(e.target.value) || 1)} style={{ width: "100%", padding: "5px", borderRadius: "4px", border: "1px solid #ccc" }} />
                </div>
            </div>
            <h3 style={{ fontSize: "14px", marginBottom: "10px" }}>Wygenerowany ciąg X (bez X₀):</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "30px" }}>
                {steps.map((step, i) => (
                    <div key={i} style={{
                        padding: "6px 10px",
                        background: "#f1f5f9",
                        color: "#1e293b",
                        borderRadius: 6,
                        fontFamily: "monospace",
                        fontSize: "13px",
                        border: "1px solid #e2e8f0"
                    }}>
                        <small style={{ color: "#64748b" }}>X{i+1}:</small> <strong>{step.value}</strong>
                    </div>
                ))}
                {steps.length === 0 && <span>Brak danych</span>}
            </div>

            <hr style={{ border: "0", borderTop: "1px solid #e2e8f0", marginBottom: "30px" }} />

            <h3 style={{ fontSize: "14px", marginBottom: "15px" }}>Szczegółowa wizualizacja obliczeń:</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {steps.map((step, i) => (
                    <div key={i} style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px",
                        background: i % 2 === 0 ? "rgba(0,0,0,0.02)" : "transparent",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        fontFamily: "monospace",
                        fontSize: "14px"
                    }}>
                        <div style={{ minWidth: "50px", fontWeight: "bold", color: "#2563eb" }}>X{i+1}:</div>

                        <div style={{ flex: 1, display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                            <span>{step.prev}² = {step.square}</span>

                            <div style={{ fontSize: "16px" }}>
                                <span style={{ color: "#94a3b8" }}>{step.prefix}</span>
                                <span style={{
                                    color: "#2563eb",
                                    fontWeight: "bold",
                                    border: "1px solid #2563eb",
                                    padding: "0 4px",
                                    background: "rgba(37, 99, 235, 0.05)"
                                }}>
                                    {step.middle}
                                </span>
                                <span style={{ color: "#94a3b8" }}>{step.suffix}</span>
                            </div>

                            <div style={{ fontWeight: "bold", color: "#1e293b" }}>➔ {step.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {steps.length > 0 && steps[steps.length - 1].value === 0 && (
                <div style={{ marginTop: "20px", color: "#dc2626", fontSize: "12px", textAlign: "center", fontStyle: "italic" }}>
                    Generator osiągnął zero. Dalsze kroki zostały pominięte.
                </div>
            )}
        </section>
    );
}