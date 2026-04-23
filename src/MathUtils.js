// Zadanie 3: Całka metodą Monte Carlo
export function calculateIntegral(generator, N = 10000) {
    let sum = 0;
    for (let i = 0; i < N; i++) {
        const x = generator.nextFloat();
        sum += Math.exp(-Math.pow(x, 2));
    }
    return sum / N;
}

// Zadanie 4: Aproksymacja PI
export function estimatePi(generator, N = 10000) {
    let hits = 0;
    for (let i = 0; i < N; i++) {
        const x = generator.nextFloat();
        const y = generator.nextFloat();
        if (x * x + y * y <= 1) hits++;
    }
    return 4 * (hits / N);
}

// Statystyki pomocnicze
export function getStats(vals) {
    const n = vals.length;
    const mean = vals.reduce((s, v) => s + v, 0) / n;
    const variance = vals.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
    return { mean, variance };
}

// Test Chi-kwadrat dla histogramu
export function chiSquare(vals, bins = 10) {
    const counts = new Array(bins).fill(0);
    vals.forEach(v => {
        const bin = Math.min(Math.floor(v * bins), bins - 1);
        counts[bin]++;
    });
    return { counts };
}