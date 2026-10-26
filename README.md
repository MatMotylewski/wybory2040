# WYBORY2040 — Dziennik Wyborczy

Grywalny, statyczny symulator kampanii wyborczej w fikcyjnej Republice Nowin, utrzymany w klimacie dawnej gazety.

## Zaimplementowano — etap II
- **30 tygodni** kampanii, podzielonych na sześć rozdziałów.
- **144 wydarzenia fabularne w puli**, z której gra dobiera historie podczas kampanii; dodatkowo pozostaje starsza pula 30 wydarzeń jako wariant awaryjny.
- **Trzy decyzje tygodniowo**: reakcja na wydarzenie, wybór regionu, akcja sztabu.
- **9 regionów** o odmiennej strukturze elektoratu i wadze ludności.
- **5 fikcyjnych partii rywalizujących** z komitetem gracza.
- Budżet kampanii, zbiórki, składki, wiarygodność, struktury regionalne i sondaże.
- **180 mandatów** rozdzielanych regionalnie metodą d'Hondta (próg 5% w modelu regionu).
- Wstępny ekran **arytmetyki koalicyjnej** i sprawdzanie większości 91 mandatów.
- Responsywny wygląd gazety w stylistyce PRL.
- Bez logowania i backendu; stan rozgrywki tylko w pamięci strony. Eksport i import zapisu jako lokalny plik JSON.

## Status i ograniczenia
To rozszerzona, grywalna wersja rozwojowa, a nie jeszcze pełne zaplanowane 2–3 godziny. Pula zawiera już **144 wydarzenia**, lecz ich balans i rozkład w 30 tygodniach wymagają dalszego dopracowania. Rozmowy koalicyjne mają na razie arytmetykę mandatów — bez warunków programowych. rozbudowanych relacji z członkami sztabu, konsekwencji odroczonych, wydarzeń losowych ani końcowych epilogów. Długość gry nie została zmierzona z udziałem graczy.

## Uruchomienie
Otwórz `index.html` w przeglądarce. W tym samym katalogu muszą znajdować się `game.js` i `data.js`.

## Publikacja na GitHub Pages — później
1. Otwórz https://github.com/MatMotylewski/wybory2040/settings/pages
2. Source: **Deploy from a branch**.
3. Branch: **main**, folder: **/ (root)**, przycisk **Save**.
4. Po publikacji: https://matmotylewski.github.io/wybory2040/

## Prywatność
Nie ma kont, własnych cookies, bazy danych ani localStorage. Brak telemetrii i zapisu postępów na serwerze. Strona ładuje fonty z Google Fonts, co powoduje dodatkowe zapytanie do zewnętrznego serwisu. GitHub Pages może prowadzić standardowe logi hostingu.

Wszystkie partie i regiony są fikcyjne. Symulacja nie przedstawia prawdziwych sondaży.
