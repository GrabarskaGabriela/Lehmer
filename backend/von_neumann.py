from __future__ import annotations

def von_neumann(ziarno: int, m: int, n: int) -> list[dict]:
    wybrane_m = max(1, int(m))
    n = max(0, int(n))
    aktualne_x = int(ziarno)
    wyniki = []

    for indeks in range(n):
        kwadrat = aktualne_x**2
        zapis_kwadratu = str(kwadrat).zfill(2 * wybrane_m)
        poczatek = wybrane_m // 2
        srodek = zapis_kwadratu[poczatek : poczatek + wybrane_m]
        wartosc = int(srodek)

        wyniki.append(
            {
                "index": indeks + 1,
                "prev": aktualne_x,
                "square": kwadrat,
                "full": zapis_kwadratu,
                "prefix": zapis_kwadratu[:poczatek],
                "middle": srodek,
                "suffix": zapis_kwadratu[poczatek + wybrane_m :],
                "value": wartosc,
            }
        )

        aktualne_x = wartosc

        if aktualne_x == 0:
            break

    def von_neumann_konsola(
            ziarno: int,
            m: int,
            n: int,
            kroki: list[dict],
    ) -> None:
        print("\nGenerator von Neumanna - metoda srodkowych kwadratow", flush=True)
        print("Parametry generatora:", flush=True)
        print(f"X0 = {ziarno}", flush=True)
        print(f"m = {m}", flush=True)
        print(f"n = {n}", flush=True)

        print("\nObliczenia:", flush=True)
        for krok in kroki[:10]:
            print(
                "i = "
                + str(krok["index"])
                + ", X_i = "
                + str(krok["prev"])
                + ", X_i^2 = "
                + str(krok["square"])
                + ", zapis = "
                + str(krok["full"])
                + ", srodek = "
                + str(krok["middle"])
                + ", X_(i+1) = "
                + str(krok["value"]),
                flush=True,
            )

        if kroki and kroki[-1]["value"] == 0:
            print("\nGenerator osiagnal stan 0 i zostal zatrzymany.", flush=True)

    von_neumann_konsola(
        int(ziarno),
        wybrane_m,
        n,
        wyniki,
    )
    return wyniki
