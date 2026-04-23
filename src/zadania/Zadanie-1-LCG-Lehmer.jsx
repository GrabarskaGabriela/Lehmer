import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { BlockMath, InlineMath } from 'react-katex';

// Importy logiki i wizualizacji (pamiętaj o ../ bo jesteśmy w podfolderze /zadania)
import { LehmerGenerator } from "../Generators";
import { getStats } from "../MathUtils";
import { Scene3D } from "../Scene3D";
import { Scene2D } from "../Scene2D";

export default function Zadanie1({ params, theme }) {
    // 1. GŁÓWNA LOGIKA OBLICZENIOWA (wyzwalana zmianą params)
    const data = useMemo(() => {
        const { k, a, x0, n } = params;

        // Obliczanie parametrów konstrukcyjnych LCG
        const L_exact = 2 + Math.log2(+k);
        const L_int = Math.round(L_exact);
        const m_val = Math.pow(2, L_int);

        // Inicjalizacja generatora i produkcja ciągu
        const generator = new LehmerGenerator(+x0, m_val, +a);
        const sequence = generator.generateSequence(+n);

        // Analiza statystyczna
        const stats = getStats(sequence);

        return {
            L_exact,
            L_int,
            m_val,
            sequence,
            stats
        };
    }, [params]);

    // 2. FUNKCJA POMOCNICZA DO KOLOROWANIA WYNIKÓW
    const getValidationColor = (value, target, tolerance) =>
        Math.abs(value - target) < tolerance ? "#16a34a" : "#dc2626";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* SEKCJA A: ANALIZA PARAMETRÓW */}
            <section style={cardStyle(theme)}>
                <h3 style={{ marginTop: 0, color: theme.header }}>Zadanie 1: Parametry Konstrukcyjne LCG</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div style={formulaStyle}>
                        <p><strong>Wyznaczanie L i m:</strong></p>
                        <BlockMath math={`L = 2 + \\log_2 ${params.k} \\approx ${data.L_exact.toFixed(5)}`} />
                        <BlockMath math={`L_{int} = \\lceil L \\rceil = ${data.L_int}`} />
                        <BlockMath math={`m = 2^{${data.L_int}} = ${data.m_val}`} />
                    </div>
                    <div style={formulaStyle}>
                        <p><strong>Równanie Rekurencyjne:</strong></p>
                        <BlockMath math={`x_j = (${params.a} \\cdot x_{j-1}) \\pmod{${data.m_val}}`} />
                        <p style={{ fontSize: "12px", color: theme.muted, textAlign: "center" }}>
                            Gdzie <InlineMath math={`U_j = x_j / m`} />
                        </p>
                    </div>
                </div>
            </section>

            {/* SEKCJA B: WERYFIKACJA GRAFICZNA */}
            <section style={cardStyle(theme)}>
                <h3 style={{ marginTop: 0 }}>Weryfikacja Niezależności (2D & 3D)</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div style={canvasBoxStyle}>
                        <Canvas camera={{ position: [1.5, 1.5, 1.5] }}>
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

            {/* SEKCJA C: TESTY STATYSTYCZNE */}
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

            {/* SEKCJA D: PEŁNA LISTA ELEMENTÓW */}
            <section style={cardStyle(theme)}>
                <h3>Pełny ciąg wygenerowanych elementów (n = {data.sequence.length})</h3>
                <div style={listContainerStyle}>
                    {data.sequence.map((val, idx) => (
                        <div key={idx} style={listItemStyle}>
                            <span style={{ color: theme.muted, fontSize: "10px" }}>[{idx}]:</span>
                            <span style={{ fontWeight: "500" }}>{val.toFixed(6)}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

// --- Style wewnętrzne ---
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
    background: "rgba(255,255,255,0.8)",
    padding: "2px 6px",
    borderRadius: "4px",
    color: "#64748b"
};

const listContainerStyle = {
    maxHeight: "250px",
    overflowY: "auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "8px",
    padding: "15px",
    background: "#1e293b", // Ciemne tło dla kontrastu
    color: "#f8fafc",
    borderRadius: "8px",
    fontFamily: "monospace"
};

const listItemStyle = {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #334155",
    padding: "2px 4px"
};