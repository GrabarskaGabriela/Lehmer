from __future__ import annotations

from common import LehmerGenerator, parametry_lehmera, statystyki

def lehmer(k: int, a: int, ziarno: int, n: int) -> dict:
    parametry = parametry_lehmera(k)
    generator = LehmerGenerator(ziarno, parametry["modulus"], a)

    ciag = generator.ciag(n)
    podsumowanie = statystyki(ciag)

    lehmer_konsola(
        k,
        a,
        ziarno,
        max(0, int(n)),
        parametry,
        ciag,
        podsumowanie,
    )

    return {
        **parametry,
        "sequence": ciag,
        "stats": podsumowanie,
        "validations": {
            "lGreaterThanFour": parametry["lValue"] > 4,
            "periodAtLeastHundred": parametry["actualPeriod"] >= 100,
            "multiplierModulo": a % 8 in (3, 5),
            "seedOdd": ziarno % 2 != 0,
        },
    }
def format(liczba: float, miejsca: int = 6) -> str:
    return f"{liczba:.{miejsca}f}".replace(".", ",")


def lehmer_konsola(
    k: int,
    a: int,
    ziarno: int,
    n: int,
    parametry: dict[str, int],
    ciag: list[float],
    statystyki: dict[str, float],
) -> None:
    print("\nGenerator LCG Lehmera", flush=True)
    print("Parametry generatora:", flush=True)
    print(f"k = {k}", flush=True)
    print(f"a = {a}", flush=True)
    print(f"X0 = {ziarno}", flush=True)
    print(f"n = {n}", flush=True)

    print("\nParametry wyznaczone:", flush=True)
    print(f"L = {parametry['lValue']}", flush=True)
    print(f"m = {parametry['modulus']}", flush=True)
    print(f"rzeczywisty okres po zaokrągleniu do całości k = {parametry['actualPeriod']}", flush=True)

    print("\nPierwsze wartosci ciagu:", flush=True)
    for indeks, wartosc in enumerate(ciag[:n], start=1):
        print(f"i = {indeks}, r_i = {format(wartosc, 6)}", flush=True)

    print("\nPodsumowanie statystyczne:", flush=True)
    print("Srednia = " + format(statystyki["mean"], 6), flush=True)
    print("Wariancja = " + format(statystyki["variance"], 6), flush=True)
