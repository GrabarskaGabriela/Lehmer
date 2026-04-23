import React, { useMemo } from 'react';
import { LehmerGenerator } from "../Generators";
import { estimatePi } from "../MathUtils";
import { InlineMath } from 'react-katex';

export default function Zadanie4({ params, theme }) {
    const piVal = useMemo(() => {
        const L_int = Math.round(2 + Math.log2(params.k));
        const m_val = Math.pow(2, L_int);
        const gen = new LehmerGenerator(params.x0, m_val, params.a);
        return estimatePi(gen, params.n);
    }, [params]);

    return (
        <section style={{ background: theme.card, padding: "20px", borderRadius: 12 }}>
            <h2 style={{ color: theme.header }}>Zadanie 4: Aproksymacja liczby <InlineMath math="\pi" /></h2>
            <div style={{ padding: "20px", background: "#f8fafc", borderRadius: 8, textAlign: "center" }}>
                <p>Wyznaczona wartość <InlineMath math="\pi" />:</p>
                <h1 style={{ color: theme.primary }}>{piVal.toFixed(6)}</h1>
                <p style={{ color: theme.muted }}>Błąd bezwzględny: {Math.abs(Math.PI - piVal).toFixed(6)}</p>
            </div>
        </section>
    );
}