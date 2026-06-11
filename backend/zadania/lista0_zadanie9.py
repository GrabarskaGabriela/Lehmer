from __future__ import annotations

from math import sqrt


def rozklady_brzegowe(prawdopodobienstwa: list[list[float]]) -> tuple[list[float], list[float]]:
    rozklad_x = [sum(wiersz) for wiersz in prawdopodobienstwa]
    liczba_kolumn = len(prawdopodobienstwa[0])
    rozklad_y = [
        sum(wiersz[indeks_kolumny] for wiersz in prawdopodobienstwa)
        for indeks_kolumny in range(liczba_kolumn)
    ]

    return rozklad_x, rozklad_y


def wartosc_oczekiwana(wartosci: list[int], rozklad_brzegowy: list[float]) -> float:
    return sum(wartosc * prawdopodobienstwo for wartosc, prawdopodobienstwo in zip(wartosci, rozklad_brzegowy))


def drugi_moment(wartosci: list[int], rozklad_brzegowy: list[float]) -> float:
    return sum((wartosc ** 2) * prawdopodobienstwo for wartosc, prawdopodobienstwo in zip(wartosci, rozklad_brzegowy))


def wariancja(drugi_moment: float, wartosc_oczekiwana: float) -> float:
    return drugi_moment - wartosc_oczekiwana ** 2


def wartosc_oczekiwana_iloczyn(
        wartosci_x: list[int],
        wartosci_y: list[int],
        prawdopodobienstwa: list[list[float]],
) -> float:
    wartosc_oczekiwana_xy = 0.0

    for indeks_wiersza, wartosc_x in enumerate(wartosci_x):
        for indeks_kolumny, wartosc_y in enumerate(wartosci_y):
            prawdopodobienstwo_xy = prawdopodobienstwa[indeks_wiersza][indeks_kolumny]
            wartosc_oczekiwana_xy += wartosc_x * wartosc_y * prawdopodobienstwo_xy

    return wartosc_oczekiwana_xy


def podpunkt_a(
        wartosc_oczekiwana_x: float,
        wartosc_oczekiwana_y: float,
        wartosc_oczekiwana_xy: float,
) -> float:
    return wartosc_oczekiwana_xy - wartosc_oczekiwana_x * wartosc_oczekiwana_y


def podpunkt_b(kowariancja: float, wariancja_x: float, wariancja_y: float) -> float:
    return kowariancja / sqrt(wariancja_x * wariancja_y)


def podpunkt_c(
        prawdopodobienstwa: list[list[float]],
        rozklad_x: list[float],
        rozklad_y: list[float],
) -> bool:
    for indeks_wiersza, prawdopodobienstwa_wiersza in enumerate(prawdopodobienstwa):
        for indeks_kolumny, prawdopodobienstwo_laczne in enumerate(prawdopodobienstwa_wiersza):
            iloczyn_rozkladow_brzegowych = rozklad_x[indeks_wiersza] * rozklad_y[indeks_kolumny]
            if not czy_rowne(prawdopodobienstwo_laczne, iloczyn_rozkladow_brzegowych):
                return False

    return True


def porownanie_niezaleznosci(
        wartosci_x: list[int],
        wartosci_y: list[int],
        prawdopodobienstwa: list[list[float]],
        rozklad_x: list[float],
        rozklad_y: list[float],
) -> list[dict]:
    porownania = []

    for indeks_wiersza, wartosc_x in enumerate(wartosci_x):
        for indeks_kolumny, wartosc_y in enumerate(wartosci_y):
            prawdopodobienstwo_laczne = prawdopodobienstwa[indeks_wiersza][indeks_kolumny]
            prawdopodobienstwo_x = rozklad_x[indeks_wiersza]
            prawdopodobienstwo_y = rozklad_y[indeks_kolumny]
            iloczyn_brzegowych = prawdopodobienstwo_x * prawdopodobienstwo_y

            porownania.append(
                {
                    "x": wartosc_x,
                    "y": wartosc_y,
                    "jointProbability": prawdopodobienstwo_laczne,
                    "px": prawdopodobienstwo_x,
                    "py": prawdopodobienstwo_y,
                    "product": iloczyn_brzegowych,
                    "isEqual": czy_rowne(prawdopodobienstwo_laczne, iloczyn_brzegowych),
                }
            )

    return porownania


def podpunkt_d(wspolczynnik_korelacji: float) -> bool:
    return czy_rowne(abs(wspolczynnik_korelacji), 1.0)


def czy_rowne(pierwsza_liczba: float, druga_liczba: float, tolerancja: float = 1e-12) -> bool:
    return abs(pierwsza_liczba - druga_liczba) <= tolerancja


def format(liczba: float, miejsca: int = 4) -> str:
    return f"{liczba:.{miejsca}f}".replace(".", ",")


def zad9_konsola(
        wartosci_x: list[int],
        wartosci_y: list[int],
        prawdopodobienstwa: list[list[float]],
        rozklad_x: list[float],
        rozklad_y: list[float],
        wartosc_oczekiwana_x: float,
        wartosc_oczekiwana_y: float,
        wartosc_oczekiwana_xy: float,
        drugi_moment_x: float,
        drugi_moment_y: float,
        wariancja_x: float,
        wariancja_y: float,
        kowariancja: float,
        wspolczynnik_korelacji: float,
        czy_stochastycznie_niezalezne: bool,
        czy_liniowo_zalezne: bool,
) -> None:
    print("\nLista 0, zadanie 9", flush=True)
    print("Dane z zadania:", flush=True)
    print(f"X(Omega) = {wartosci_x}", flush=True)
    print(f"Y(Omega) = {wartosci_y}", flush=True)
    print("Macierz P:", flush=True)
    for wiersz in prawdopodobienstwa:
        print("  " + "  ".join(format(p, 1) for p in wiersz), flush=True)

    print("\nKrok 1. Rozklady brzegowe", flush=True)
    print("P(X=1) = 0,1 + 0,2 + 0,3 = " + format(rozklad_x[0], 1), flush=True)
    print("P(X=2) = 0,1 + 0,1 + 0,2 = " + format(rozklad_x[1], 1), flush=True)
    print("P(Y=3) = 0,1 + 0,1 = " + format(rozklad_y[0], 1), flush=True)
    print("P(Y=2) = 0,2 + 0,1 = " + format(rozklad_y[1], 1), flush=True)
    print("P(Y=1) = 0,3 + 0,2 = " + format(rozklad_y[2], 1), flush=True)

    print("\nKrok 2. Wartosci oczekiwane", flush=True)
    print("E(X) = 1 * 0,6 + 2 * 0,4 = " + format(wartosc_oczekiwana_x, 1), flush=True)
    print("E(Y) = 3 * 0,2 + 2 * 0,3 + 1 * 0,5 = " + format(wartosc_oczekiwana_y, 1), flush=True)
    print("E(XY) = 1*3*0,1 + 1*2*0,2 + 1*1*0,3 + 2*3*0,1 + 2*2*0,1 + 2*1*0,2 = "+ format(wartosc_oczekiwana_xy, 1), flush=True)


    print("\nKrok 3. Drugie momenty i wariancje", flush=True)
    print("E(X^2) = 1^2 * 0,6 + 2^2 * 0,4 = " + format(drugi_moment_x, 1), flush=True)
    print("E(Y^2) = 3^2 * 0,2 + 2^2 * 0,3 + 1^2 * 0,5 = " + format(drugi_moment_y, 1), flush=True)
    print("Var(X) = E(X^2) - E(X)^2 = 2,2 - 1,4^2 = " + format(wariancja_x, 2), flush=True)
    print("Var(Y) = E(Y^2) - E(Y)^2 = 3,5 - 1,7^2 = " + format(wariancja_y, 2), flush=True)

    print("\nPodpunkt a. Kowariancja", flush=True)
    print("cov(X,Y) = 2,4 - 1,4 * 1,7 = " + format(kowariancja, 2), flush=True)

    print("\nPodpunkt b. Wspolczynnik korelacji", flush=True)
    print("rho(X,Y) = 0,02 / sqrt(0,24 * 0,61) = " + format(wspolczynnik_korelacji, 4), flush=True)

    print("\nPodpunkt c. Niezaleznosc stochastyczna", flush=True)
    print("Warunek niezaleznosci: p_ij = P(X=x_i) * P(Y=y_j) dla kazdej pary i,j", flush=True)
    for porownanie in porownanie_niezaleznosci(
        wartosci_x,
        wartosci_y,
        prawdopodobienstwa,
        rozklad_x,
        rozklad_y,
    ):
        znak = "=" if porownanie["isEqual"] else "!="
        print(
            "P(X="
            + str(porownanie["x"])
            + ", Y="
            + str(porownanie["y"])
            + ") = "
            + format(porownanie["jointProbability"], 2)
            + ", P(X="
            + str(porownanie["x"])
            + ")P(Y="
            + str(porownanie["y"])
            + ") = "
            + format(porownanie["px"], 2)
            + " * "
            + format(porownanie["py"], 2)
            + " = "
            + format(porownanie["product"], 2)
            + ", "
            + format(porownanie["jointProbability"], 2)
            + " "
            + znak
            + " "
            + format(porownanie["product"], 2),
            flush=True,
        )
    print(f"Czy stochastycznie niezalezne: {czy_stochastycznie_niezalezne}", flush=True)

    print("\nPodpunkt d. Zaleznosc liniowa", flush=True)
    print("|rho(X,Y)| = " + format(abs(wspolczynnik_korelacji), 4), flush=True)
    print("Czy liniowo zalezne: " + str(czy_liniowo_zalezne), flush=True)


def calculate_joint_distribution_task() -> dict:
    wartosci_x = [1, 2]
    wartosci_y = [3, 2, 1]
    prawdopodobienstwa = [
        [0.1, 0.2, 0.3],
        [0.1, 0.1, 0.2],
    ]

    rozklad_x, rozklad_y = rozklady_brzegowe(prawdopodobienstwa)

    wartosc_oczekiwana_x = wartosc_oczekiwana(wartosci_x, rozklad_x)
    wartosc_oczekiwana_y = wartosc_oczekiwana(wartosci_y, rozklad_y)
    wartosc_oczekiwana_xy = wartosc_oczekiwana_iloczyn(wartosci_x, wartosci_y, prawdopodobienstwa)

    drugi_moment_x = drugi_moment(wartosci_x, rozklad_x)
    drugi_moment_y = drugi_moment(wartosci_y, rozklad_y)

    wariancja_x = wariancja(drugi_moment_x, wartosc_oczekiwana_x)
    wariancja_y = wariancja(drugi_moment_y, wartosc_oczekiwana_y)
    kowariancja = podpunkt_a(wartosc_oczekiwana_x, wartosc_oczekiwana_y, wartosc_oczekiwana_xy)
    wspolczynnik_korelacji = podpunkt_b(kowariancja, wariancja_x, wariancja_y)
    czy_stochastycznie_niezalezne = podpunkt_c(
        prawdopodobienstwa,
        rozklad_x,
        rozklad_y,
    )
    porownania_niezaleznosci = porownanie_niezaleznosci(
        wartosci_x,
        wartosci_y,
        prawdopodobienstwa,
        rozklad_x,
        rozklad_y,
    )
    czy_liniowo_zalezne = podpunkt_d(wspolczynnik_korelacji)

    zad9_konsola(
        wartosci_x,
        wartosci_y,
        prawdopodobienstwa,
        rozklad_x,
        rozklad_y,
        wartosc_oczekiwana_x,
        wartosc_oczekiwana_y,
        wartosc_oczekiwana_xy,
        drugi_moment_x,
        drugi_moment_y,
        wariancja_x,
        wariancja_y,
        kowariancja,
        wspolczynnik_korelacji,
        czy_stochastycznie_niezalezne,
        czy_liniowo_zalezne,
    )

    return {
        "xValues": wartosci_x,
        "yValues": wartosci_y,
        "probabilities": prawdopodobienstwa,
        "px": rozklad_x,
        "py": rozklad_y,
        "expectedX": wartosc_oczekiwana_x,
        "expectedY": wartosc_oczekiwana_y,
        "expectedXY": wartosc_oczekiwana_xy,
        "expectedX2": drugi_moment_x,
        "expectedY2": drugi_moment_y,
        "covariance": kowariancja,
        "varianceX": wariancja_x,
        "varianceY": wariancja_y,
        "rho": wspolczynnik_korelacji,
        "independenceComparisons": porownania_niezaleznosci,
        "isIndependent": czy_stochastycznie_niezalezne,
        "isLinearlyDependent": czy_liniowo_zalezne,
    }
