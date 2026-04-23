# Lab 1 PSK – 16.04.2026

## 1. Implementacja algorytmu LCG Lehmera
Celem zadania jest wygenerowanie ciągu liczb $(r_1, r_2, \dots, r_n) \in [0, 1]^n$.

### (i) Ustalenie parametrów
Należy dobrać parametry $a$ oraz $m$ dla wzoru:
$$X_n = a X_{n-1}\pmod m, \quad n \ge 1, \quad X_0 \text{ – dane}$$
tak, aby ciąg $(X_n)$ był aperiodyczny.

**FAKT:** Jeśli $m = 2^L$ (gdzie $L > 4$), to okres $k = 2^{L-2}$ wtedy i tylko wtedy, gdy:
* **a)** $X_0$ jest liczbą nieparzystą,
* **b)** $res_8(a) \in \{3, 5\}$ (reszta z dzielenia $a$ przez $8$ wynosi $3$ lub $5$).

*Założenie projektowe:* Przyjąć $k \ge 100$.

### (ii) Testy statystyczne
Sprawdzenie poprawności wyników za pomocą statystyk:
* Średnia: $\bar{X}_n \approx 0.5$
* Wariancja: $S^2 \approx \frac{1}{12}$

### (iii) Test na niezależność
Weryfikacja metodą graficzną w przestrzeni 2D lub 3D (wykresy rozrzutu).

---

## 2. Implementacja algorytmu kwadratowego von Neumanna
Implementacja alternatywnej metody generowania liczb pseudolosowych (metoda środka kwadratu).

---

## 3. Metoda Monte Carlo (MMC) – Obliczanie całki
Wyznaczenie wartości przybliżonej całki:
$$\theta = \int_0^1 e^{-x^2} dx$$
*(Do generowania liczb losowych wykorzystać algorytm Lehmera)*

* **(i)** Wyliczyć wartość $\theta$.
* **(ii)** Porównać wynik z wartościami tablicowymi ($0.746824$).

---

## 4. Aproksymacja liczby $\pi$
Implementacja algorytmu geometrycznego (metoda "trafień" w koło wpisane w kwadrat) do wyznaczenia przybliżonej wartości liczby $\pi$ z użyciem **MMC** (generator Lehmera).