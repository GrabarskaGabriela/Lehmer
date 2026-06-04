from __future__ import annotations

from common import LehmerGenerator, lehmer_parameters, stats


def calculate_lehmer(period: int, multiplier: int, seed: int, count: int) -> dict:
    params = lehmer_parameters(period)
    generator = LehmerGenerator(seed, params["modulus"], multiplier)
    sequence = generator.sequence(count)

    return {
        **params,
        "sequence": sequence,
        "stats": stats(sequence),
        "validations": {
            "lGreaterThanFour": params["lValue"] > 4,
            "periodAtLeastHundred": params["actualPeriod"] >= 100,
            "multiplierModulo": multiplier % 8 in (3, 5),
            "seedOdd": seed % 2 != 0,
        },
    }
