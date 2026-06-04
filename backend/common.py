from __future__ import annotations

from dataclasses import dataclass
from math import log2


@dataclass
class LehmerGenerator:
    seed: int
    modulus: int
    multiplier: int

    def __post_init__(self) -> None:
        self.current_x = int(self.seed or 1)
        self.modulus = int(self.modulus)
        self.multiplier = int(self.multiplier)

    def next_int(self) -> int:
        self.current_x = (self.multiplier * self.current_x) % self.modulus
        return self.current_x

    def next_float(self) -> float:
        return self.next_int() / self.modulus

    def sequence(self, count: int) -> list[float]:
        return [self.next_float() for _ in range(max(0, int(count)))]


def lehmer_parameters(period: int) -> dict[str, int]:
    safe_period = max(1, int(period))
    l_value = round(log2(safe_period) + 2)
    modulus = 2**l_value
    actual_period = 2 ** (l_value - 2)

    return {
        "lValue": l_value,
        "modulus": modulus,
        "actualPeriod": actual_period,
    }


def stats(values: list[float]) -> dict[str, float]:
    if not values:
        return {"mean": 0.0, "variance": 0.0}

    mean = sum(values) / len(values)
    variance = sum((value - mean) ** 2 for value in values) / len(values)

    return {"mean": mean, "variance": variance}
