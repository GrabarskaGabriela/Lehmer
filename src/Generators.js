// Zadanie 1: Klasyczny Lehmer (LCG)
export function LehmerGenerator(seed, L = 10, a = 11) {
    this.m = Math.pow(2, L);
    this.a = a;
    this.currentX = seed;

    this.next = function() {
        this.currentX = (this.a * this.currentX) % this.m;
        return this.currentX;
    };

    this.nextFloat = function() {
        return this.next() / this.m;
    };

    this.generateSequence = function(n) {
        const sequence = [];
        for (let i = 0; i < n; i++) {
            sequence.push(this.nextFloat());
        }
        return sequence;
    };
}

// Zadanie 2: Algorytm kwadratowy von Neumanna
export function runVonNeumann(seed, n = 20) {
    const sequence = [];
    let current = seed;
    for (let i = 0; i < n; i++) {
        let square = (current * current).toString().padStart(8, '0');
        let middle = Number.parseInt(square.substring(2, 6));
        sequence.push(middle / 10000);
        current = middle;
    }
    return sequence;
}