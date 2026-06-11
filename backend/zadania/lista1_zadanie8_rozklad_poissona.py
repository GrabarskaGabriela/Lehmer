from __future__ import annotations

from math import exp, sqrt
from threading import Lock

from common import LehmerGenerator, lehmer_parameters as parametry_lehmera, stats as policz_statystyki
print_lock = Lock()


def formatuj_liczbe(liczba: float, miejsca: int = 4) -> str:
    return f"{liczba:.{miejsca}f}".replace(".", ",")


def rozklad_poissona(
        wartosc_jednostajna: float,
        parametr_lambda: float,
) -> tuple[int, float]:
    prawdopodobienstwo = exp(-parametr_lambda)
    dystrybuanta = prawdopodobienstwo
    wartosc = 0
    maksymalna_wartosc = max(50, int(parametr_lambda + 10 * sqrt(parametr_lambda + 1) + 10))

    while wartosc_jednostajna > dystrybuanta and wartosc < maksymalna_wartosc:
        wartosc += 1
        prawdopodobienstwo *= parametr_lambda / wartosc
        dystrybuanta += prawdopodobienstwo

    return wartosc, dystrybuanta


def generate_poisson_distribution(
        period: int,
        multiplier: int,
        seed: int,
        count: int,
        lambda_value: float,
) -> dict:
    okres = period
    mnoznik = multiplier
    ziarno = seed
    liczba_probek = max(1, int(count))
    parametr_lambda = max(0.0001, float(lambda_value))

    parametry = parametry_lehmera(okres)

    with print_lock:
        generator_lehmera = LehmerGenerator(ziarno, parametry["modulus"], mnoznik)
        probki = []
        wartosci = []

        for indeks in range(liczba_probek):
            wartosc_jednostajna = generator_lehmera.next_float()
            wartosc, dystrybuanta = rozklad_poissona(wartosc_jednostajna, parametr_lambda)
            wartosci.append(wartosc)
            probki.append(
                {
                    "index": indeks + 1,
                    "u": wartosc_jednostajna,
                    "value": wartosc,
                    "cumulative": dystrybuanta,
                }
            )

        histogram = {}
        for wartosc in wartosci:
            histogram[wartosc] = histogram.get(wartosc, 0) + 1

        statystyki = policz_statystyki([float(wartosc) for wartosc in wartosci])

        poisson_konsola(
            okres,
            mnoznik,
            ziarno,
            liczba_probek,
            parametr_lambda,
            parametry,
            probki,
            histogram,
            statystyki,
        )

    return {
        **parametry,
        "lambdaValue": parametr_lambda,
        "samples": probki,
        "histogram": [
            {"value": wartosc, "count": histogram[wartosc]} for wartosc in sorted(histogram)
        ],
        "stats": statystyki,
        "theoreticalMean": parametr_lambda,
        "theoreticalVariance": parametr_lambda,
    }


def poisson_konsola(
        okres: int,
        mnoznik: int,
        ziarno: int,
        liczba_probek: int,
        parametr_lambda: float,
        parametry: dict[str, int],
        probki: list[dict],
        histogram: dict[int, int],
        statystyki: dict[str, float],
) -> None:
    print("\nLista 1 zadanie 8 - Rozklad Poissona", flush=True)
    print("Parametry symulacji:", flush=True)
    print(f"k = {okres}", flush=True)
    print(f"a = {mnoznik}", flush=True)
    print(f"x0 = {ziarno}", flush=True)
    print(f"n = {liczba_probek}", flush=True)
    print("lambda = " + formatuj_liczbe(parametr_lambda, 4), flush=True)

    print("\nParametry generatora LCG Lehmera:", flush=True)
    print(f"m = {parametry['modulus']}", flush=True)
    print(f"l = {parametry['lValue']}", flush=True)

    print("\nProbki:", flush=True)
    for probka in probki:
        print(
            "i = "
            + str(probka["index"])
            + ", U_i = "
            + formatuj_liczbe(probka["u"], 6)
            + ", X_i = "
            + str(probka["value"])
            + ", F(X_i) = "
            + formatuj_liczbe(probka["cumulative"], 6),
            flush=True,
        )

    print("\nHistogram wartosci:", flush=True)
    for wartosc in sorted(histogram):
        print(f"X = {wartosc}: liczba wystapien = {histogram[wartosc]}", flush=True)

    print("\nPodsumowanie:", flush=True)
    print("Srednia z proby = " + formatuj_liczbe(statystyki["mean"], 4), flush=True)
    print("Wariancja z proby = " + formatuj_liczbe(statystyki["variance"], 4), flush=True)
    print("Srednia teoretyczna E(X) = lambda = " + formatuj_liczbe(parametr_lambda, 4), flush=True)
    print("Wariancja teoretyczna Var(X) = lambda = " + formatuj_liczbe(parametr_lambda, 4), flush=True)