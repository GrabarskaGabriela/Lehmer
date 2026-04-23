import { useState } from "react";
import ControlPanel from "./zadania/ControlPanel"; // Upewnij się, że ścieżka jest poprawna
import Zadanie1 from "./zadania/Zadanie-1-LCG-Lehmer";
import Zadanie2 from "./zadania/Zadanie-2-VonNeumann";
import Zadanie3 from "./zadania/Zadanie-3-Obliczanie-calki-MMC";
import Zadanie4 from "./zadania/Zadanie-4-Aproksymacja-PI";

// Definiujemy motyw poza komponentem, aby był stały
const theme = {
  primary: "#2563eb",
  header: "#1e3a8a",
  bg: "#f8fafc",
  card: "#ffffff",
  border: "#e2e8f0",
  text: "#1e293b",
  muted: "#64748b"
};

export default function App() {
  const [activeTab, setActiveTab] = useState("zad1");
  const [params, setParams] = useState({ k: 100, a: 101, x0: 3, n: 900 });

  const navItemStyle = (id) => ({
    padding: "10px 20px",
    cursor: "pointer",
    border: "none",
    borderRadius: 6,
    fontWeight: "bold",
    background: activeTab === id ? theme.primary : "transparent",
    color: activeTab === id ? "white" : theme.text,
    transition: "0.2s"
  });

  return (
      <div style={{ minHeight: "100vh", background: theme.bg }}>
        <header style={{ background: theme.header, color: "white", padding: "20px", textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Laboratorium PSK – 2026</h1>
        </header>

        {/* KLUCZOWE: Przekazujemy params, setParams ORAZ theme */}
        <ControlPanel params={params} setParams={setParams} theme={theme} />

        <nav style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          padding: "20px",
          background: "white",
          borderBottom: `1px solid ${theme.border}`
        }}>
          <button style={navItemStyle("zad1")} onClick={() => setActiveTab("zad1")}>Zadanie 1 (LCG)</button>
          <button style={navItemStyle("zad2")} onClick={() => setActiveTab("zad2")}>Zadanie 2 (V.N.)</button>
          <button style={navItemStyle("zad3")} onClick={() => setActiveTab("zad3")}>Zadanie 3 (Całka)</button>
          <button style={navItemStyle("zad4")} onClick={() => setActiveTab("zad4")}>Zadanie 4 (Pi)</button>
        </nav>

        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "20px" }}>
          {/* Renderowanie zadań z przekazaniem surowych parametrów */}
          <section style={{ animation: "fadeIn 0.3s ease-in" }}>
            {activeTab === "zad1" && <Zadanie1 params={params} theme={theme} />}
            {activeTab === "zad2" && <Zadanie2 params={params} theme={theme} />}
            {activeTab === "zad3" && <Zadanie3 params={params} theme={theme} />}
            {activeTab === "zad4" && <Zadanie4 params={params} theme={theme} />}
          </section>
        </main>

        <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      </div>
  );
}