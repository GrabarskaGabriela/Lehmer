from __future__ import annotations

from math import log

from common import LehmerGenerator, lehmer_parameters, stats


def _formatuj_liczbe(liczba: float, miejsca: int = 4) -> str:
    return f"{liczba:.{miejsca}f}".replace(".", ",")


def _wypisz_obliczenia_odwracania_dystrybuanty_w_konsoli(
    period: int,
    multiplier: int,
    seed: int,
    count: int,
    lambda_value: float,
    params: dict[str, int],
    samples: list[dict],
    statistics: dict[str, float],
) -> None:
    print("\nLista 2, zadanie 2 - metoda odwracania dystrybuanty", flush=True)
    print("Dane z zadania / parametry symulacji:", flush=True)
    print(f"k = {period}", flush=True)
    print(f"a = {multiplier}", flush=True)
    print(f"x0 = {seed}", flush=True)
    print(f"n = {count}", flush=True)
    print("lambda = " + _formatuj_liczbe(lambda_value, 4), flush=True)

    print("\nParametry generatora LCG Lehmera:", flush=True)
    print(f"m = {params['modulus']}", flush=True)
    print(f"l = {params['lValue']}", flush=True)
    print("Wzor generatora: X_(i+1) = (a * X_i) mod m", flush=True)
    print("U_i = X_i / m", flush=True)

    print("\nRozklad wykladniczy i odwrocona dystrybuanta:", flush=True)
    print("F(x) = 1 - exp(-lambda * x)", flush=True)
    print("U = F(x)", flush=True)
    print("x = F^(-1)(U) = -ln(1 - U) / lambda", flush=True)

    print("\nPierwsze probki:", flush=True)
    for sample in samples[:10]:
        print(
            "i = "
            + str(sample["index"])
            + ", U_i = "
            + _formatuj_liczbe(sample["u"], 6)
            + ", X_i = -ln(1 - U_i) / lambda = "
            + _formatuj_liczbe(sample["value"], 6),
            flush=True,
        )

    print("\nPodsumowanie:", flush=True)
    print("Srednia z proby = " + _formatuj_liczbe(statistics["mean"], 4), flush=True)
    print("Wariancja z proby = " + _formatuj_liczbe(statistics["variance"], 4), flush=True)
    print("Srednia teoretyczna E(X) = 1 / lambda = " + _formatuj_liczbe(1 / lambda_value, 4), flush=True)
    print(
        "Wariancja teoretyczna Var(X) = 1 / lambda^2 = "
        + _formatuj_liczbe(1 / (lambda_value**2), 4),
        flush=True,
    )
    print("Koniec obliczen metoda odwracania dystrybuanty.\n", flush=True)


def generate_exponential_inverse_distribution(
    period: int,
    multiplier: int,
    seed: int,
    count: int,
    lambda_value: float,
) -> dict:
    params = lehmer_parameters(period)
    generator = LehmerGenerator(seed, params["modulus"], multiplier)
    safe_count = max(1, int(count))
    safe_lambda = max(0.0001, float(lambda_value))
    samples = []
    values = []

    for index in range(safe_count):
        uniform_value = min(max(generator.next_float(), 0.0), 0.999999999999)
        value = -log(1 - uniform_value) / safe_lambda
        values.append(value)
        samples.append(
            {
                "index": index + 1,
                "u": uniform_value,
                "value": value,
            }
        )

    statistics = stats(values)

    _wypisz_obliczenia_odwracania_dystrybuanty_w_konsoli(
        period,
        multiplier,
        seed,
        safe_count,
        safe_lambda,
        params,
        samples,
        statistics,
    )

    return {
        **params,
        "lambdaValue": safe_lambda,
        "samples": samples,
        "stats": statistics,
        "theoreticalMean": 1 / safe_lambda,
        "theoreticalVariance": 1 / (safe_lambda**2),
    }
