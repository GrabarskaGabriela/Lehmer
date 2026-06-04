# PROJEKT do kursu Podstawy Symulacji Komputerowej

Imię i nazwisko: Gabriela Grabarska  
Nr albumu: 43840  
Kierunek studiów: Informatyka  
Prowadzący zajęcia: dr inż. Ryszard Rębowski  
Data: ................................

## Wprowadzenie

Celem projektu jest opracowanie trzech tematów z list zadań z kursu Podstawy Symulacji Komputerowej. Projekt obejmuje część merytoryczną, implementację algorytmów oraz prezentację wyników końcowych w aplikacji komputerowej.

W pracy przedstawiono podstawowe zagadnienia związane z symulacją komputerową, generowaniem liczb pseudolosowych oraz wykorzystaniem tych liczb do otrzymywania rozkładów prawdopodobieństwa. Projekt został przygotowany tak, aby połączyć opis teoretyczny z praktycznym działaniem algorytmów. Dla każdego wybranego zadania najpierw opisano podstawy merytoryczne, następnie przedstawiono sposób implementacji, a na końcu zaprezentowano otrzymane wyniki.

Pierwsza część projektu dotyczy analizy rozkładu łącznego dwuwymiarowego wektora losowego. W tej części obliczane są rozkłady brzegowe, wartości oczekiwane, kowariancja, współczynnik korelacji oraz sprawdzana jest niezależność stochastyczna i zależność liniowa zmiennych losowych.

Druga część projektu dotyczy generowania liczb pseudolosowych. W aplikacji zaprezentowano dwa sposoby generowania takich liczb: liniowy generator kongruencyjny Lehmera oraz metodę środkowych kwadratów von Neumanna. Generator Lehmera został następnie wykorzystany jako źródło liczb jednostajnych w zadaniach symulacyjnych.

Trzecia część projektu obejmuje generowanie rozkładów prawdopodobieństwa na podstawie liczb pseudolosowych. Dla rozkładu dyskretnego zaimplementowano generowanie rozkładu Poissona, natomiast dla rozkładu ciągłego zastosowano metodę odwracania dystrybuanty. W obu przypadkach użytkownik może wprowadzać parametry generatora i obserwować wpływ tych parametrów na otrzymywane wyniki.

Do realizacji projektu przygotowano aplikację webową. Część obliczeniowa została wydzielona do backendu w języku Python, natomiast część prezentacyjna została wykonana w React. Dzięki temu interfejs użytkownika służy do wprowadzania parametrów i prezentacji wyników, a właściwe obliczenia wykonywane są po stronie backendu.

Wybrane tematy:

1. Lista 0, zadanie 9 - analiza rozkładu łącznego wektora losowego.
2. Lista 1, zadanie 8 - generowanie rozkładu Poissona.
3. Lista 2, zadanie 2 - generowanie rozkładu ciągłego metodą odwracania dystrybuanty.

Aplikacja została przygotowana jako projekt webowy. Część obliczeniowa znajduje się w backendzie w języku Python, natomiast interfejs użytkownika został wykonany w React.

## Wspólna podstawa implementacyjna: generator LCG Lehmera

W zadaniach z Listy 1 i Listy 2 wykorzystano generator kongruencyjny Lehmera jako źródło liczb pseudolosowych o rozkładzie jednostajnym na przedziale `[0,1)`. Wygenerowane wartości `U_j` stanowią dane wejściowe dla algorytmu generowania rozkładu Poissona oraz dla metody odwracania dystrybuanty.

Generator Lehmera tworzy ciąg liczb pseudolosowych według zależności:

```text
X_j = a * X_{j-1} mod m
```

gdzie:

- `X_0` oznacza ziarno generatora,
- `a` oznacza mnożnik,
- `m` oznacza moduł,
- `X_j` oznacza kolejny stan generatora.

Aby uzyskać liczby z przedziału `[0, 1)`, każdy wygenerowany stan jest normalizowany:

```text
U_j = X_j / m
```

W aplikacji wartość modułu wyznaczana jest na podstawie zadanego okresu `k`:

```text
L = round(log2(k) + 2)
m = 2^L
```

Dla modułu postaci `m = 2^L` warunki poprawnego doboru parametrów obejmują:

- `L > 4`,
- `k >= 100`,
- `a mod 8` należy do `{3, 5}`,
- `X_0` jest liczbą nieparzystą.

W aplikacji jako domyślne parametry przyjęto:

```text
k = 536870912
a = 1103515245
X_0 = 12345
n = 1200
```

Dla tych wartości otrzymujemy `L = 31`, `m = 2^31` oraz faktyczny okres `k = 2^29 = 536870912`. Mnożnik spełnia warunek `a mod 8 = 5`, a ziarno `X_0 = 12345` jest nieparzyste. Dzięki temu liczba generowanych punktów `n = 1200` jest bardzo mała w porównaniu z okresem generatora, więc na wykresach 2D i 3D nie powinny pojawiać się widoczne linie wynikające z szybkiego powtarzania ciągu.

### Obserwacje i wnioski dotyczące doboru parametrów LCG

Początkowo w aplikacji zastosowano parametry:

```text
k = 100
a = 101
X_0 = 3
n = 900
```

Dla tych wartości generator spełniał podstawowe warunki z zadania, jednak na wykresach 2D i 3D widoczne były wyraźne linie oraz regularne układy punktów. Oznaczało to, że wygenerowany ciąg nie dawał wystarczająco dobrego rozproszenia w przestrzeni.

Problem wynikał głównie z małego okresu generatora. Dla `k = 100` otrzymywano:

```text
L = 9
m = 2^9 = 512
okres = 2^7 = 128
```

Jednocześnie liczba generowanych punktów wynosiła:

```text
n = 900
```

Liczba generowanych wartości była więc znacznie większa niż okres generatora. W konsekwencji ciąg zaczynał się wielokrotnie powtarzać, a ta powtarzalność była widoczna na wykresach jako linie i regularne struktury.

Po zgłębieniu tematu generatorów liniowych kongruencyjnych zauważono, że jakość generatora silnie zależy od doboru parametrów `a`, `m` oraz `X_0`. Zbyt mały moduł lub niekorzystnie dobrany mnożnik może prowadzić do wyraźnej struktury kratowej punktów. Zjawisko to jest opisywane w literaturze dotyczącej generatorów LCG, między innymi w opracowaniu Karla Entachera "A collection of selected pseudorandom number generators with linear structures", gdzie jakość generatorów oceniana jest przy użyciu wykresów rozrzutu oraz testu spektralnego.

W tym opracowaniu przedstawiono klasyczny generator używany w ANSI C:

```text
LCG(2^31, 1103515245, 12345, 12345)
```

Na tej podstawie przyjęto większy moduł związany z wartością:

```text
m = 2^31
```

oraz znany mnożnik:

```text
a = 1103515245
```

W projekcie nie zastosowano dokładnie generatora ANSI C, ponieważ wzór z zadania dotyczy generatora multiplikatywnego Lehmera:

```text
X_j = aX_{j-1} mod m
```

a nie generatora mieszanego:

```text
X_j = aX_{j-1} + b mod m
```

Z przytoczonego przykładu wykorzystano więc ideę dużego modułu `2^31` oraz znanego mnożnika `1103515245`, natomiast składnik addytywny nie został użyty.

Aby w konstrukcji stosowanej w aplikacji uzyskać `m = 2^31`, dobrano:

```text
L = 31
k = 2^(L-2) = 2^29 = 536870912
```

Ostatecznie przyjęto parametry:

```text
k = 536870912
a = 1103515245
X_0 = 12345
n = 1200
```

Dla tych wartości:

```text
L = 31
m = 2^31 = 2147483648
okres = 2^29 = 536870912
```

Parametry spełniają warunki wymagane dla generatora:

```text
L > 4
k >= 100
a mod 8 = 5, więc a mod 8 należy do {3, 5}
X_0 = 12345 jest liczbą nieparzystą
```

Nowa liczba generowanych punktów jest bardzo mała w porównaniu z okresem generatora:

```text
1200 << 536870912
```

Dzięki temu ciąg nie powtarza się szybko, a punkty na wykresach 2D i 3D są znacznie lepiej rozproszone. Widoczne wcześniej linie i regularne układy zostały ograniczone. Należy jednak pamiętać, że każdy generator LCG posiada pewną strukturę kratową, dlatego całkowite usunięcie zależności liniowych nie jest możliwe. Można jedynie dobrać parametry tak, aby przy analizowanej liczbie próbek struktura ta nie była widoczna na wykresach.

Fragment implementacji generatora:

```python
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
```

## Drugi sposób generowania liczb pseudolosowych: metoda von Neumanna

Oprócz generatora LCG Lehmera w aplikacji przedstawiono również algorytm kwadratowy von Neumanna, nazywany metodą środkowych kwadratów. Jest to jedna z historycznych metod generowania liczb pseudolosowych. Jej działanie polega na tym, że kolejną liczbę ciągu otrzymuje się przez podniesienie poprzedniej wartości do kwadratu, a następnie wybranie środkowych cyfr otrzymanego wyniku.

Algorytm przyjmuje wartość początkową `X_0` oraz liczbę cyfr `m`, która określa długość generowanych liczb. Dla każdego kroku:

1. Pobierana jest poprzednia wartość `X_{n-1}`.
2. Obliczany jest kwadrat:

```text
Y_n = X_{n-1}^2
```

3. Wynik jest uzupełniany zerami z lewej strony tak, aby miał `2m` cyfr.
4. Ze środka zapisu liczby wybieranych jest `m` cyfr.
5. Otrzymana liczba staje się nową wartością `X_n`.

Schemat można zapisać następująco:

```text
X_{n-1} -> X_{n-1}^2 -> środkowe m cyfr -> X_n
```

Przykładowo dla `X_0 = 12` oraz `m = 2`:

```text
12^2 = 144 -> 0144 -> środkowe cyfry: 14
14^2 = 196 -> 0196 -> środkowe cyfry: 19
19^2 = 361 -> 0361 -> środkowe cyfry: 36
```

Zaletą tej metody jest prostota i łatwość wizualnego pokazania kolejnych kroków obliczeń. W aplikacji każdy krok prezentowany jest osobno: wartość poprzednia, kwadrat, uzupełniony zapis, wyróżnione cyfry środkowe oraz nowa wartość ciągu. Dzięki temu algorytm jest czytelny i dobrze nadaje się do części demonstracyjnej projektu.

Należy jednak zauważyć, że generator von Neumanna ma istotne ograniczenia praktyczne. Dla niektórych wartości początkowych ciąg może szybko wejść w krótki cykl albo osiągnąć wartość `0`, po której dalsze generowanie daje stale `0`. Z tego powodu metoda von Neumanna ma przede wszystkim znaczenie dydaktyczne, natomiast w zadaniach symulacyjnych Listy 1 i 2 jako właściwe źródło liczb jednostajnych wykorzystano generator LCG Lehmera.

Fragment implementacji:

```python
def calculate_von_neumann(seed: int, digits: int, count: int) -> list[dict]:
    current_x = int(seed)
    results = []

    for index in range(count):
        square = current_x**2
        square_text = str(square).zfill(2 * digits)
        start = digits // 2
        middle = square_text[start : start + digits]
        value = int(middle)

        results.append({
            "prev": current_x,
            "square": square,
            "full": square_text,
            "middle": middle,
            "value": value,
        })

        current_x = value

        if current_x == 0:
            break

    return results
```

## Lista 0, zadanie 9

### Treść zadania

Dana jest macierz `P` reprezentująca rozkład łączny wektora losowego `(X, Y)`, gdzie:

```text
        Y = 3   Y = 2   Y = 1
X = 1    0,1     0,2     0,3
X = 2    0,1     0,1     0,2
```

czyli:

```text
P = [ 0,1   0,2   0,3 ]
    [ 0,1   0,1   0,2 ]
```

oraz:

```text
X(Ω) = {1, 2}
Y(Ω) = {3, 2, 1}
```

Należy obliczyć:

- `cov(X,Y)`,
- współczynnik korelacji `rho(X,Y)`,
- sprawdzić niezależność stochastyczną,
- sprawdzić zależność liniową.

W zapisie formalnym macierz prawdopodobieństw oznacza:

```text
p_ij = P(X = x_i, Y = y_j)
```

Dla podanych wartości:

```text
x_1 = 1, x_2 = 2
y_1 = 3, y_2 = 2, y_3 = 1
```

### Podstawy merytoryczne

Rozkład łączny wektora losowego opisuje prawdopodobieństwa jednoczesnego przyjmowania wartości przez dwie zmienne losowe. Dla zmiennych dyskretnych wartości prawdopodobieństw zapisane są w macierzy:

```text
p_ij = P(X = x_i, Y = y_j)
```

Rozkłady brzegowe wyznacza się przez sumowanie odpowiednich wierszy i kolumn:

```text
P(X = x_i) = sum_j p_ij
P(Y = y_j) = sum_i p_ij
```

Dla danych z zadania:

```text
P(X = 1) = 0,1 + 0,2 + 0,3 = 0,6
P(X = 2) = 0,1 + 0,1 + 0,2 = 0,4

P(Y = 3) = 0,1 + 0,1 = 0,2
P(Y = 2) = 0,2 + 0,1 = 0,3
P(Y = 1) = 0,3 + 0,2 = 0,5
```

Wartości oczekiwane:

```text
E(X) = sum_i x_i * P(X = x_i)
E(Y) = sum_j y_j * P(Y = y_j)
E(XY) = sum_i sum_j x_i * y_j * p_ij
```

Po podstawieniu:

```text
E(X) = 1 * 0,6 + 2 * 0,4 = 1,4
E(Y) = 3 * 0,2 + 2 * 0,3 + 1 * 0,5 = 1,7

E(XY) =
1 * 3 * 0,1 + 1 * 2 * 0,2 + 1 * 1 * 0,3
+ 2 * 3 * 0,1 + 2 * 2 * 0,1 + 2 * 1 * 0,2
= 2,4
```

Kowariancja:

```text
cov(X,Y) = E(XY) - E(X)E(Y)
```

Po podstawieniu:

```text
cov(X,Y) = 2,4 - 1,4 * 1,7
cov(X,Y) = 2,4 - 2,38
cov(X,Y) = 0,02
```

Wariancje potrzebne do współczynnika korelacji:

```text
E(X^2) = 1^2 * 0,6 + 2^2 * 0,4 = 2,2
Var(X) = E(X^2) - (E(X))^2 = 2,2 - 1,4^2 = 0,24

E(Y^2) = 3^2 * 0,2 + 2^2 * 0,3 + 1^2 * 0,5 = 3,5
Var(Y) = E(Y^2) - (E(Y))^2 = 3,5 - 1,7^2 = 0,61
```

Współczynnik korelacji:

```text
rho(X,Y) = cov(X,Y) / sqrt(Var(X) * Var(Y))
```

Po podstawieniu:

```text
rho(X,Y) = 0,02 / sqrt(0,24 * 0,61)
rho(X,Y) ≈ 0,0522
```

Zmienne losowe `X` i `Y` są stochastycznie niezależne, gdy dla każdej pary wartości zachodzi:

```text
P(X = x_i, Y = y_j) = P(X = x_i) * P(Y = y_j)
```

Wystarczy znaleźć jedną parę, dla której warunek nie zachodzi:

```text
P(X = 1, Y = 3) = 0,1
P(X = 1) * P(Y = 3) = 0,6 * 0,2 = 0,12
0,1 != 0,12
```

Zatem zmienne nie są stochastycznie niezależne.

### Implementacja

Fragment kodu obliczającego kowariancję i korelację:

```python
expected_xy = 0.0
for row_index, x in enumerate(x_values):
    for column_index, y in enumerate(y_values):
        expected_xy += x * y * probabilities[row_index][column_index]

covariance = expected_xy - expected_x * expected_y
rho = covariance / sqrt(variance_x * variance_y)
```

### Wyniki końcowe

Po wykonaniu obliczeń otrzymano:

```text
E(X) = 1,4
E(Y) = 1,7
E(XY) = 2,4
cov(X,Y) = 0,02
rho(X,Y) ≈ 0,0522
```

Dla sprawdzenia niezależności:

```text
P(X=1, Y=3) = 0,1
P(X=1)P(Y=3) = 0,6 * 0,2 = 0,12
```

Ponieważ `0,1 != 0,12`, zmienne `X` i `Y` nie są stochastycznie niezależne.

Zmienne nie są również liniowo zależne, ponieważ dla `X = 1` zmienna `Y` może przyjąć kilka różnych wartości z dodatnim prawdopodobieństwem.

## Lista 1, zadanie 8

### Treść zadania

Zaprogramować algorytm generowania rozkładu Poissona. Przyjąć:

```text
lambda = 2,0
```

W projekcie zadanie wykonano przez wygenerowanie ciągu liczb jednostajnych `U_i` za pomocą generatora LCG Lehmera, a następnie przekształcenie ich do wartości zmiennej losowej o rozkładzie Poissona.

### Podstawy merytoryczne

Rozkład Poissona jest rozkładem dyskretnym opisującym liczbę zdarzeń zachodzących w ustalonym przedziale czasu lub przestrzeni. Zmienna losowa `X` ma rozkład Poissona z parametrem `lambda`, jeżeli:

```text
P(X = k) = exp(-lambda) * lambda^k / k!,  k = 0, 1, 2, ...
```

Dla wartości z zadania:

```text
lambda = 2
P(X = k) = exp(-2) * 2^k / k!,  k = 0, 1, 2, ...
```

Dla rozkładu Poissona wartość oczekiwana i wariancja są równe:

```text
E(X) = lambda
Var(X) = lambda
```

czyli dla `lambda = 2`:

```text
E(X) = 2
Var(X) = 2
```

Do wygenerowania rozkładu wykorzystano metodę odwrotnej dystrybuanty dla rozkładu dyskretnego. Najpierw generowana jest liczba jednostajna `U` z przedziału `[0,1)`, a następnie szukana jest najmniejsza liczba całkowita `k`, dla której:

W tym zadaniu wartości `U` są generowane przez algorytm LCG Lehmera. Oznacza to, że generator Lehmera dostarcza ciąg liczb jednostajnych, a algorytm Poissona przekształca je na wartości dyskretne o zadanym rozkładzie.

```text
F(k) >= U
```

gdzie:

```text
F(k) = P(X <= k)
```

Dystrybuanta rozkładu Poissona ma postać sumy:

```text
F(k) = P(X <= k)
F(k) = sum_{i=0}^{k} exp(-lambda) * lambda^i / i!
```

Dla `lambda = 2`:

```text
F(k) = sum_{i=0}^{k} exp(-2) * 2^i / i!
```

### Algorytm

1. Wygeneruj wartość `U` algorytmem LCG Lehmera.
2. Ustaw `p_0 = exp(-lambda)` oraz `F = p_0`.
3. Jeśli `U <= F`, zwróć `0`.
4. W przeciwnym razie obliczaj kolejne prawdopodobieństwa rekurencyjnie:

```text
p_k = p_{k-1} * lambda / k
```

Dla `lambda = 2`:

```text
p_0 = exp(-2)
p_k = p_{k-1} * 2 / k
```

5. Sumuj wartości do dystrybuanty `F`.
6. Zwróć pierwsze `k`, dla którego `U <= F`.

### Implementacja

Fragment implementacji:

```python
def _poisson_from_uniform(uniform_value: float, lambda_value: float) -> tuple[int, float]:
    probability = exp(-lambda_value)
    cumulative = probability
    value = 0

    while uniform_value > cumulative:
        value += 1
        probability *= lambda_value / value
        cumulative += probability

    return value, cumulative
```

### Wyniki końcowe

Aplikacja prezentuje:

- wygenerowane wartości rozkładu Poissona,
- histogram częstości,
- średnią z próby,
- wariancję z próby,
- porównanie z wartościami teoretycznymi `E(X) = lambda` oraz `Var(X) = lambda`.

Dla domyślnych parametrów `lambda = 2,0` oczekuje się, że przy większej liczbie próbek średnia i wariancja z próby będą zbliżać się do wartości `2`.

## Lista 2, zadanie 2

### Treść zadania

Zaimplementować metodologię metody odwracania dystrybuanty, wykorzystując wyniki Przykładu 1 z materiałów wykładowych.

W projekcie jako przykład rozkładu ciągłego zastosowano rozkład wykładniczy z parametrem `lambda`. Liczby jednostajne `U_i` generowane są za pomocą generatora LCG Lehmera, a następnie podstawiane do funkcji odwrotnej dystrybuanty.

### Podstawy merytoryczne

Metoda odwracania dystrybuanty służy do generowania wartości zmiennej losowej o zadanym rozkładzie ciągłym. Jeżeli `U` ma rozkład jednostajny na przedziale `[0,1)`, a `F` jest dystrybuantą wybranego rozkładu, to zmienna:

W tym zadaniu wartości `U` również pochodzą z generatora LCG Lehmera. Generator Lehmera odpowiada więc za część pseudolosową, a metoda odwracania dystrybuanty za przekształcenie liczb jednostajnych w wartości wybranego rozkładu ciągłego.

```text
X = F^{-1}(U)
```

ma rozkład o dystrybuancie `F`.

Ogólny schemat metody:

```text
U ~ U(0,1)
X = F^{-1}(U)
```

gdzie `F^{-1}` oznacza funkcję odwrotną do dystrybuanty.

W aktualnej implementacji zastosowano rozkład wykładniczy z parametrem `lambda`. Jego dystrybuanta ma postać:

```text
F(x) = 1 - exp(-lambda * x),  x >= 0
```

Dla `x < 0`:

```text
F(x) = 0
```

Aby wyznaczyć funkcję odwrotną:

```text
u = 1 - exp(-lambda * x)
exp(-lambda * x) = 1 - u
-lambda * x = ln(1 - u)
x = -ln(1 - u) / lambda
```

Stąd:

```text
X = -ln(1-U) / lambda
```

### Algorytm

1. Wygeneruj wartość `U` algorytmem LCG Lehmera.
2. Podstaw `U` do wzoru odwrotnej dystrybuanty.
3. Otrzymaj wartość `X` o rozkładzie wykładniczym.
4. Powtórz procedurę dla zadanej liczby próbek.

### Implementacja

Fragment implementacji:

```python
uniform_value = min(max(generator.next_float(), 0.0), 0.999999999999)
value = -log(1 - uniform_value) / safe_lambda
```

### Wyniki końcowe

Aplikacja prezentuje:

- kolejne wartości `U_i` z generatora LCG,
- wygenerowane wartości `X_i = F^{-1}(U_i)`,
- średnią z próby,
- wariancję z próby,
- wartości teoretyczne:

```text
E(X) = 1 / lambda
Var(X) = 1 / lambda^2
```

Uwaga: jeżeli Przykład 1 z materiałów wykładowych definiuje inną dystrybuantę niż rozkład wykładniczy, należy podmienić wzór funkcji odwrotnej w części implementacyjnej.

## Podsumowanie

W projekcie opracowano trzy zadania z list laboratoryjnych. Każde zadanie zawiera podstawy teoretyczne, implementację algorytmu oraz prezentację wyników. Wspólnym elementem zadań symulacyjnych jest generator LCG Lehmera, który dostarcza liczby pseudolosowe z przedziału `[0,1)`.

Projekt spełnia wymaganie połączenia części merytorycznej z implementacją i wynikami końcowymi.
