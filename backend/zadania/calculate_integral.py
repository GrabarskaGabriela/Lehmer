from __future__ import annotations

from math import exp

from common import LehmerGenerator, lehmer_parameters


def calculate_integral(period: int, multiplier: int, seed: int, count: int) -> dict:
    tabular_value = 0.746824
    params = lehmer_parameters(period)
    generator = LehmerGenerator(seed, params["modulus"], multiplier)
    sample_count = max(1, int(count))
    sequence = []
    total = 0.0

    for _ in range(sample_count):
        value = generator.next_float()
        sequence.append(value)
        total += exp(-(value**2))

    theta = total / sample_count

    return {
        **params,
        "theta": theta,
        "error": abs(theta - tabular_value),
        "tabularValue": tabular_value,
        "sequence": sequence,
    }
