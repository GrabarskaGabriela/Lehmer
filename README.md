# Lab 1 PSK – 16.04.2026

## 1. Implementacja algorytmu LCG Lehmera
Celem zadania jest wygenerowanie ciągu liczb $(r_1, r_2, \dots, r_n) \in [0, 1]^n$.

### (i) Ustalenie parametrów
Należy dobrać parametry $a$ oraz $m$ dla wzoru:
$$X_j = a X_{j-1}\pmod m, \quad j \ge 1, \quad X_0 \text{ – dane}$$
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
Celem algorytmu jest generowanie liczb (pseudolosowych) całkowitych o jednakowej liczbie cyfr $m$, gdzie $m$ jest parzyste.

### Algorytm:
1. **Inicjalizacja**: Zainicjuj algorytm liczbą całkowitą $X_0$.
2. **Pobranie wartości**: Weź wcześniej wygenerowaną liczbę $X_{n-1}$.
3. **Podniesienie do kwadratu**: Oblicz $Y_n \stackrel{df}{=} X_{n-1}^2$.
4. **Dopełnienie zerami**: Jeśli to potrzebne, dopisz odpowiednią liczbę zer na początku $Y_n$ tak, aby otrzymać liczbę $2m$-cyfrową.
5. **Wyznaczenie nowej wartości**: Za $X_n$ przyjmij $m$ środkowych cyfr z modyfikacji $Y_n$.
---

## 3. Metoda Monte Carlo (MMC) – Obliczanie całki
Wyznaczenie wartości przybliżonej całki:
$$\theta = \int_0^1 e^{-x^2} dx$$
*(Do generowania liczb losowych wykorzystać algorytm Lehmera)*

**Wskazówka:**
Korzystając z wyników Zadania 1, wygeneruj ciąg liczb (pseudo)losowych $(X_k)_{k=1}^{100}$ i oblicz przybliżenie za pomocą sumy:
$$\sum_{i=1}^{100} \frac{e^{-X_i^2}}{100}$$

* **(i)** Wyliczyć wartość $\theta$.
* **(ii)** Porównać wynik z wartościami tablicowymi ($0.746824$).

---

## 4. Aproksymacja liczby $\pi$
Implementacja algorytmu geometrycznego (metoda "trafień" w koło wpisane w kwadrat) do wyznaczenia przybliżonej wartości liczby $\pi$ z użyciem **MMC** (generator Lehmera).

### Model teoretyczny:
1. Przyjmujemy zbiór **$A = [-1, 1] \times [-1, 1]$**.
2. Niech $X, Y$ będą niezależnymi zmiennymi losowymi o rozkładzie jednostajnym na $[-1, 1]$. Każda z nich generuje wektor losowy:
   $$\Omega \ni \omega \longrightarrow (X(\omega), Y(\omega)) \in A$$
3. Wpisujemy w kwadrat okrąg, który ogranicza koło **$\mathcal{O}$** o środku $(0,0)$ i promieniu $1$.
4. Interesuje nas zdarzenie $C = \{ \omega \in \Omega : (X, Y)(\omega) \in \mathcal{O} \}$. Z modelu geometrycznego:
   $$P(C) = \frac{\text{pole koła}}{\text{pole kwadratu}} = \frac{\pi 1^2}{4} = \frac{\pi}{4}$$

### Implementacja (Klucz do $\pi$):
Aby zastosować Mocne Prawo Wielkich Liczb Bernoulliego (MPWLB), definiujemy zmienną losową $Z(\omega)$:
$$Z(\omega) = \begin{cases} 1 & X^2(\omega) + Y^2(\omega) \leq 1 \\ 0 & \text{dla pozostałych } \omega \end{cases}$$
Wtedy wartość oczekiwana wynosi:
$$EZ = P(\{\omega \in \Omega : Z(\omega) = 1\}) = P(\{\omega \in \Omega : X^2(\omega) + Y^2(\omega) \leq 1\}) = \frac{\pi}{4}$$

### Transformacja zmiennych:
Generowanie wektora $(X, Y)$ z jednej zmiennej $U \in \mathcal{U}([0, 1])$:
1. Jeśli $U \in \mathcal{U}([0, 1])$, to $2U \in \mathcal{U}([0, 2])$.
2. Przesunięcie: **$2U - 1 \in [-1, 1]$**.
3. Mając $U_1$ oraz biorąc kopię $U_1$ w postaci $U_2$, otrzymujemy:
   $$X = 2U_1 - 1, \quad Y = 2U_2 - 1$$