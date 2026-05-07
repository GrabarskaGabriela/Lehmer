export function LehmerGenerator(seed, m, a) {
    this.m = BigInt(m);
    this.a = BigInt(a);
    this.currentX = BigInt(seed) || 1n;

    this.next = function() {
        this.currentX = (this.a * this.currentX) % this.m;
        return this.currentX;
    };

    this.nextFloat = function() {
        return Number(this.next()) / Number(this.m);
    };

    this.generateSequence = function(n) {
        const sequence = [];
        for (let i = 0; i < n; i++) {
            sequence.push(this.nextFloat());
        }
        return sequence;
    };
}

export function generateVonNeumann(x0, m, n) {
    const results = [];
    let currentX = x0;

    for (let i = 0; i < n; i++) {
        let square = Math.pow(currentX, 2);
        let squareStr = square.toString().padStart(2 * m, '0');

        let start = m / 2;
        let middlePart = squareStr.substring(start, start + m);

        results.push({
            prev: currentX,
            square: square,
            full: squareStr,
            prefix: squareStr.substring(0, start),
            middle: middlePart,
            suffix: squareStr.substring(start + m),
            value: parseInt(middlePart, 10)
        });

        currentX = parseInt(middlePart, 10);

        if (currentX === 0 && i < n - 1) break;
    }

    return results;
}

export function estimatePi(generator, n) {
    let hits = 0;

    for (let i = 0; i < n; i++) {
        const u1 = generator.nextFloat();
        const u2 = generator.nextFloat();

        const x = 2 * u1 - 1;
        const y = 2 * u2 - 1;

        if (x * x + y * y <= 1) {
            hits++;
        }
    }
    return 4 * (hits / n);
}