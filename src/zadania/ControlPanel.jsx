export default function ControlPanel({ params, setParams, theme }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setParams((prev) => ({ ...prev, [name]: Number(value) }));
    };

    const labelStyle = { display: "block", fontSize: 12, fontWeight: "bold", marginBottom: 5, color: theme.text };
    const inputStyle = {
        width: "100%",
        padding: "10px",
        borderRadius: 6,
        border: `1px solid ${theme.border}`,
        background: "#fff",
        fontSize: "14px"
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
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 25
            }}>
                <div>
                    <label style={labelStyle}>Okres (k)</label>
                    <input type="number" name="k" value={params.k} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Mnożnik (a)</label>
                    <input type="number" name="a" value={params.a} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Ziarno (X₀)</label>
                    <input type="number" name="x0" value={params.x0} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                    <label style={labelStyle}>Liczba próbek (n)</label>
                    <input type="number" name="n" value={params.n} onChange={handleChange} style={inputStyle} />
                </div>
            </div>
        </section>
    );
}