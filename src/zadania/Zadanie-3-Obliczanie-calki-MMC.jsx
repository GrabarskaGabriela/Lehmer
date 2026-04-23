import React, { useMemo } from 'react';
import { LehmerGenerator } from "../Generators";
import { calculateIntegral } from "../MathUtils";
import { InlineMath } from 'react-katex';

export default function Zadanie3({ params, theme }) {
    const result = useMemo(() => {
        const L_int = Math.round(2 + Math.log2(params.k));
        const m_val = Math.pow(2, L_int);
        const gen = new LehmerGenerator(params.x0, m_val, params.a);
        return calculateIntegral(gen, params.n);
    }, [params]);

    return (
        <section style={{ background: theme.card, padding: "20px", borderRadius: 12 }}>
            <h2 style={{ color: theme.header }}>Zadanie 3: Obliczanie całki metodą Monte Carlo</h2>
            <div style={{ padding: "20px", background: "#f8fafc", borderRadius: 8, textAlign: "center" }}>
                <p>Wynik obliczonej całki dla <InlineMath math={`n = ${params.n}`} /> próbek:</p>
                <h1 style={{ color: theme.primary }}>{result.toFixed(6)}</h1>
            </div>
        </section>
    );
}