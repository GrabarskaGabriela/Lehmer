from __future__ import annotations


def calculate_von_neumann(seed: int, digits: int, count: int) -> list[dict]:
    safe_digits = max(1, int(digits))
    safe_count = max(0, int(count))
    current_x = int(seed)
    results = []

    for index in range(safe_count):
        square = current_x**2
        square_text = str(square).zfill(2 * safe_digits)
        start = safe_digits // 2
        middle = square_text[start : start + safe_digits]
        value = int(middle)

        results.append(
            {
                "index": index + 1,
                "prev": current_x,
                "square": square,
                "full": square_text,
                "prefix": square_text[:start],
                "middle": middle,
                "suffix": square_text[start + safe_digits :],
                "value": value,
            }
        )

        current_x = value

        if current_x == 0:
            break

    return results
