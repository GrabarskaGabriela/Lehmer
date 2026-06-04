from __future__ import annotations

from math import exp, sqrt

from common import LehmerGenerator, lehmer_parameters, stats


def _formatuj_liczbe(liczba: float, miejsca: int = 4) -> str:
    return f"{liczba:.{miejsca}f}".replace(".", ",")


def _poisson_from_uniform(uniform_value: float, lambda_value: float) -> tuple[int, float]:
    probability = exp(-lambda_value)
    cumulative = probability
    value = 0
    max_value = max(50, int(lambda_value + 10 * sqrt(lambda_value + 1) + 10))

    while uniform_value > cumulative and value < max_value:
        value += 1
        probability *= lambda_value / value
        cumulative += probability

    return value, cumulative


def _wypisz_obliczenia_poissona_w_konsoli(
    period: int,
    multiplier: int,
    seed: int,
    count: int,
    lambda_value: float,
    params: dict[str, int],
    samples: list[dict],
    histogram: dict[int, int],
    statistics: dict[str, float],
) -> None:
    print("\nLista 1, zadanie 8 - rozklad Poissona", flush=True)
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

    print("\nMetoda generowania rozkladu Poissona:", flush=True)
    print("Dla kazdego U_i sumujemy prawdopodobienstwa P(X=0), P(X=1), ...", flush=True)
    print("Wybieramy najmniejsze k, dla ktorego F(k) >= U_i.", flush=True)
    print("P(X=k) = exp(-lambda) * lambda^k / k!", flush=True)

    print("\nPierwsze probki:", flush=True)
    for sample in samples[:10]:
        print(
            "i = "
            + str(sample["index"])
            + ", U_i = "
            + _formatuj_liczbe(sample["u"], 6)
            + ", X_i = "
            + str(sample["value"])
            + ", F(X_i) = "
            + _formatuj_liczbe(sample["cumulative"], 6),
            flush=True,
        )

    print("\nHistogram wartosci:", flush=True)
    for value in sorted(histogram):
        print(f"X = {value}: liczba wystapien = {histogram[value]}", flush=True)

    print("\nPodsumowanie:", flush=True)
    print("Srednia z proby = " + _formatuj_liczbe(statistics["mean"], 4), flush=True)
    print("Wariancja z proby = " + _formatuj_liczbe(statistics["variance"], 4), flush=True)
    print("Srednia teoretyczna E(X) = lambda = " + _formatuj_liczbe(lambda_value, 4), flush=True)
    print("Wariancja teoretyczna Var(X) = lambda = " + _formatuj_liczbe(lambda_value, 4), flush=True)
    print("Koniec obliczen Poissona.\n", flush=True)


def generate_poisson_distribution(
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
        uniform_value = generator.next_float()
        value, cumulative = _poisson_from_uniform(uniform_value, safe_lambda)
        values.append(value)
        samples.append(
            {
                "index": index + 1,
                "u": uniform_value,
                "value": value,
                "cumulative": cumulative,
            }
        )

    histogram = {}
    for value in values:
        histogram[value] = histogram.get(value, 0) + 1

    statistics = stats([float(value) for value in values])

    _wypisz_obliczenia_poissona_w_konsoli(
        period,
        multiplier,
        seed,
        safe_count,
        safe_lambda,
        params,
        samples,
        histogram,
        statistics,
    )

    return {
        **params,
        "lambdaValue": safe_lambda,
        "samples": samples,
        "histogram": [
            {"value": value, "count": histogram[value]} for value in sorted(histogram)
        ],
        "stats": statistics,
        "theoreticalMean": safe_lambda,
        "theoreticalVariance": safe_lambda,
    }
