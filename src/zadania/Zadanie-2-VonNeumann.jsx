import React, { useMemo } from 'react';
import { runVonNeumann } from "../Generators";

export default function Zadanie2({ params, theme }) {
    const sequence = useMemo(() => {
        // Generujemy ciąg VN na podstawie ziarna x0 z parametrów
        return runVonNeumann(params.x0, 20);
    }, [params.x0]);

    return (
        <section style={{ background: theme.card, padding: "20px", borderRadius: 12 }}>
            <h2 style={{ color: theme.header }}>Zadanie 2: Metoda von Neumanna (środka kwadratu)</h2>
            <p style={{ color: theme.text }}>Pierwsze 20 wygenerowanych liczb dla ziarna {params.x0}:</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "20px" }}>
                {sequence.map((v, i) => (
                    <div key={i} style={{ padding: "10px", background: "#f1f5f9", borderRadius: 8, fontFamily: "monospace" }}>
                        {v.toFixed(4)}
                    </div>
                ))}
            </div>
        </section>
    );
}