from __future__ import annotations

from math import log

from common import LehmerGenerator, lehmer_parameters as parametry_lehmera


def formatuj_liczbe(liczba: float, miejsca: int = 4) -> str:
    return f"{liczba:.{miejsca}f}".replace(".", ",")


def generate_poisson_process(
    period: int,
    multiplier: int,
    seed: int,
    max_time: float,
    lambda_value: float = 2.0,
) -> dict:
    okres = period
    mnoznik = multiplier
    ziarno = seed
    maksymalny_czas = max(0.0001, float(max_time))
    parametr_lambda = max(0.0001, float(lambda_value))

    parametry = parametry_lehmera(okres)
    generator = LehmerGenerator(ziarno, parametry["modulus"], mnoznik)

    czas = 0.0
    licznik_zdarzen = 0
    momenty_zdarzen = []
    odstepy_czasu = []
    probki = []

    while True:
        wartosc_u = min(max(generator.next_float(), 1e-10), 0.999999999999)
        odstep = -(1.0 / parametr_lambda) * log(wartosc_u)
        czas += odstep

        if czas > maksymalny_czas:
            koncowy_czas = czas
            break

        licznik_zdarzen += 1
        momenty_zdarzen.append(czas)
        odstepy_czasu.append(odstep)
        probki.append(
            {
                "index": licznik_zdarzen,
                "u": wartosc_u,
                "interval": odstep,
                "time": czas,
            }
        )

    proces_poissona_konsola(
        okres,
        mnoznik,
        ziarno,
        maksymalny_czas,
        parametr_lambda,
        parametry,
        probki,
        licznik_zdarzen,
        koncowy_czas,
    )

    return {
        **parametry,
        "lambdaValue": parametr_lambda,
        "maxTime": maksymalny_czas,
        "eventCount": licznik_zdarzen,
        "events": probki,
        "moments": momenty_zdarzen,
        "intervals": odstepy_czasu,
        "finalTime": koncowy_czas,
        "theoreticalMean": parametr_lambda * maksymalny_czas,
        "theoreticalVariance": parametr_lambda * maksymalny_czas,
    }


def proces_poissona_konsola(
    okres: int,
    mnoznik: int,
    ziarno: int,
    maksymalny_czas: float,
    parametr_lambda: float,
    parametry: dict[str, int],
    probki: list[dict],
    licznik_zdarzen: int,
    koncowy_czas: float,
) -> None:
    print("\n=== PROCES POISSONA ===", flush=True)
    print("Parametry symulacji:", flush=True)
    print(f"k = {okres}", flush=True)
    print(f"a = {mnoznik}", flush=True)
    print(f"x0 = {ziarno}", flush=True)
    print("lambda = " + formatuj_liczbe(parametr_lambda, 4), flush=True)
    print("T = " + formatuj_liczbe(maksymalny_czas, 4), flush=True)

    print("\nParametry generatora LCG Lehmera:", flush=True)
    print(f"m = {parametry['modulus']}", flush=True)
    print(f"l = {parametry['lValue']}", flush=True)

    print("\nZdarzenia procesu:", flush=True)
    for probka in probki:
        print(
            "Zdarzenie #"
            + str(probka["index"])
            + ": U = "
            + formatuj_liczbe(probka["u"], 6)
            + ", odstep T_j = "
            + formatuj_liczbe(probka["interval"], 6)
            + ", moment S = "
            + formatuj_liczbe(probka["time"], 6),
            flush=True,
        )

    print(
        "\nSTOP: nowy czas t = "
        + formatuj_liczbe(koncowy_czas, 6)
        + " przekroczyl T = "
        + formatuj_liczbe(maksymalny_czas, 6),
        flush=True,
    )
    print(
        "Koniec symulacji. Liczba zdarzen w czasie T = "
        + formatuj_liczbe(maksymalny_czas, 4)
        + ": "
        + str(licznik_zdarzen)
        + "\n",
        flush=True,
    )
