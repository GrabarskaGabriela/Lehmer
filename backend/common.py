from __future__ import annotations

from dataclasses import dataclass
from math import log2


@dataclass
class LehmerGenerator:
    ziarno: int
    m: int
    a: int

    def __post_init__(self) -> None:
        self.aktualny_x = int(self.ziarno or 1)
        self.m = int(self.m)
        self.a = int(self.a)

    def nastepny_x(self) -> int:
        self.aktualny_x = (self.a * self.aktualny_x) % self.m
        return self.aktualny_x

    def element_ciagu(self) -> float:
        return self.nastepny_x() / self.m

    def ciag(self, n: int) -> list[float]:
        return [self.element_ciagu() for _ in range(max(0, int(n)))]

    def next_int(self) -> int:
        return self.nastepny_x()

    def next_float(self) -> float:
        return self.element_ciagu()

    def sequence(self, count: int) -> list[float]:
        return self.ciag(count)


def parametry_lehmera(k: int) -> dict[str, int]:
    wybrane_k = max(1, int(k))
    wartosc_l = round(log2(wybrane_k) + 2)
    modul = 2**wartosc_l
    rzeczywiste_k = 2 ** (wartosc_l - 2)

    return {
        "lValue": wartosc_l,
        "modulus": modul,
        "actualPeriod": rzeczywiste_k,
    }


def lehmer_parameters(period: int) -> dict[str, int]:
    return parametry_lehmera(period)


def statystyki(wartosci: list[float]) -> dict[str, float]:
    if not wartosci:
        return {"mean": 0.0, "variance": 0.0}

    srednia = sum(wartosci) / len(wartosci)
    wariancja = sum((wartosc - srednia) ** 2 for wartosc in wartosci) / len(wartosci)

    return {"mean": srednia, "variance": wariancja}


def stats(values: list[float]) -> dict[str, float]:
    return statystyki(values)
