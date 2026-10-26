# WYBORY2040 — Dziennik Wyborczy

Grywalny, statyczny symulator kampanii wyborczej w fikcyjnej Republice Nowin, utrzymany w klimacie dawnej gazety.

## Zaimplementowano — etap III
- **30 tygodni** kampanii, podzielonych na sześć rozdziałów.
- **144 wydarzenia fabularne w puli**, z której gra dobiera historie podczas kampanii; dodatkowo pozostaje starsza pula 30 wydarzeń jako wariant awaryjny.
- **Cztery decyzje tygodniowo**: reakcja na depeszę, wybór regionu, akcja sztabu i plan strategiczny (łącznie minimum 120 decyzji na kampanię).
- **9 regionów** o odmiennej strukturze elektoratu i wadze ludności.
- **5 fikcyjnych partii rywalizujących** z komitetem gracza.
- Budżet kampanii, zbiórki, składki, wiarygodność, struktury regionalne i sondaże.
- **180 mandatów** rozdzielanych regionalnie metodą d'Hondta (próg 5% w skali kraju).
- **Trzy rundy negocjacji koalicyjnych** z możliwością przyjęcia i odrzucenia ofert; wynik zależy od programu, wiarygodności i działań dyplomatycznych.
- **Czterech specjalistów** do zatrudnienia (teren, media, finanse, sondaże); maksymalnie trzech w jednej kampanii.
- Responsywny wygląd gazety w stylistyce PRL.
- Bez logowania i backendu; stan rozgrywki tylko w pamięci strony. Eksport i import zapisu jako lokalny plik JSON.

## Status i ograniczenia
To rozszerzona, grywalna wersja rozwojowa, a nie jeszcze pełne zaplanowane 2–3 godziny. Pula zawiera już **144 wydarzenia**, lecz ich balans i rozkład w 30 tygodniach wymagają dalszego dopracowania. Negocjacje koalicyjne mają już trzy rundy, ustępstwa i ryzyko odrzucenia oferty, ale wymagają rozbudowania o szczegółowe umowy programowe, relacje między członkami sztabu, odroczone konsekwencje decyzji i epilogi. Długość gry nie została zmierzona z udziałem graczy.

## Uruchomienie
Otwórz `index.html` w przeglądarce. W tym samym katalogu muszą znajdować się `game.js` i `data.js`.

## Publikacja na GitHub Pages — później
1. Otwórz https://github.com/MatMotylewski/wybory2040/settings/pages
2. Source: **Deploy from a branch**.
3. Branch: **main**, folder: **/ (root)**, przycisk **Save**.
4. Po publikacji: https://matmotylewski.github.io/wybory2040/

## Prywatność
Nie ma kont, własnych cookies, bazy danych ani localStorage. Brak telemetrii i zapisu postępów na serwerze. Gra nie pobiera zewnętrznych fontów ani innych zasobów sieciowych. GitHub Pages może prowadzić standardowe logi hostingu.

Wszystkie partie i regiony są fikcyjne. Symulacja nie przedstawia prawdziwych sondaży.

## Aktualizacja: zatwierdzona szata graficzna

Interfejs został dostosowany do zaakceptowanych makiet w stylistyce drukowanej gazety PRL: afisze, kremowy papier, czarne ramki, czerwone stemple, prasowe sondaże, panel dziewięciu regionów i pasek postępu kampanii. Zmiany dotyczą pliku `index.html` oraz widoków generowanych przez `game.js`.

## Kontrola przebiegu

Wykonano 100 automatycznych symulacji pełnych 30 tygodni z wyborem dostępnych finansowo decyzji. Każda kampania zakończyła się przeliczeniem 180 mandatów. W 100 podejściach wylosowano łącznie 135 różnych tematów spośród biblioteki 144 depesz; ponadto przewidziano 6 fabularnych punktów zwrotnych. Automatyczne testy logiki nie zastępują testów użyteczności na telefonie i nie potwierdzają jeszcze długości rozgrywki 2–3 godziny.

## Kolejne zadania

- Scenariuszowo powiązane wydarzenia i konsekwencje długoterminowe zamiast niezależnych depesz.
- Interaktywna mapa kraju zamiast obecnego atlasu kafelkowego.
- Minigra debaty oraz oddzielne ekrany mediów, finansów i sztabu.
- Testy manualne, balans trudności i pomiar czasu kampanii.

## Testy automatyczne

Po instalacji Node.js uruchom `npm test` w katalogu repozytorium. Testy znajdują się w `tests/simulation.test.cjs` i nie wymagają dodatkowych bibliotek. Obejmują 40 kompletowanych kampanii w ramach powtarzalnego testu; osobno przeprowadzono serię 100 symulacji podczas rozwoju. Nadal potrzebne są testy manualne wyglądu i użyteczności na prawdziwych telefonach.

## Debaty i kryzysy medialne (etap kolejny)

W tygodniach **5, 11, 19 i 26** gra przełącza się na trzyrundowy format rozmowy: dwie debaty wyborcze, wywiad dla gazety i kryzys medialny. Odpowiedzi wpływają na wiarygodność, zainteresowanie mediów, poparcie oraz lojalność rzecznika. Wydarzenia są częścią rozgrywki, więc nie można ich pominąć; zapisy stanu obsługują także trwającą debatę. Scenariusze są fikcyjne.

Test automatyczny przechodzi również przez wszystkie 12 rund specjalnych w każdym z 40 scenariuszy kampanii.

## Finanse i gospodarka sztabu

- Księga rachunkowa pokazuje stan gotówki, zaległości i zadłużenie.
- Można otwierać maksymalnie dwa biura na region, każde z tygodniowym kosztem utrzymania.
- Dostępne są jawne pożyczki z kosztem spłaty, czterej fikcyjni darczyńcy i spłata zaległości.
- Niektóre źródła finansowania powodują późniejsze wydarzenia reputacyjne.
- Rozliczenie tygodniowe obejmuje składki, biura oraz koszty specjalistów; w razie braku środków rosną zaległości zamiast blokować grę.

Po aktualizacji przetestowano 50 pełnych 30-tygodniowych kampanii, także z pożyczkami i wydatkami na biura. Wyniki dotyczą testów symulacyjnych, nie pełnego testu graficznego w przeglądarce.
