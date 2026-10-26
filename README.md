# WYBORY2040 — Dziennik Wyborczy

Polskojęzyczna strategiczna gra wyborcza w klimacie retro gazety. Kampania trwa 30 tygodni i rozgrywa się w fikcyjnym świecie politycznym opartym o 16 rzeczywistych województw Polski. Partie, postacie, kampania, sondaże i wydarzenia są fikcyjne.

## Uruchamianie
Otwórz projekt w Visual Studio Code i uruchom `index.html` przez Live Server, ewentualnie otwórz go bezpośrednio w przeglądarce. W katalogu powinny znajdować się `index.html`, `game.js`, `data.js` oraz folder `assets/candidates/` z portretami.

Aktualizacja lokalnej kopii: `git pull --rebase origin main` (tylko przy czystym lub zatwierdzonym drzewie roboczym). Testy Node.js: `npm test`.

## Jak grać
1. Wybierz nazwę partii, program, poziom trudności, nazwisko i płeć kandydata, jego przeszłość oraz portret.
2. Na początku tygodnia odpowiedz na depeszę. W niektórych tygodniach rozegraj trzyrundową debatę lub kryzys medialny.
3. Otrzymujesz **3 punkty działań**. Możesz przeznaczyć je na teren, media, finanse, program lub rozmowy z innymi partiami; możesz też zakończyć tydzień przed ich wykorzystaniem.
4. W zakładce **Sztab** zatrudniaj, zwalniaj i szkol specjalistów (maksymalnie trzech). W zakładce **Finanse** zarządzaj biurami, sponsorami, pożyczkami oraz zaległościami.
5. Realizuj co pięć tygodni regionalną misję rozdziału. Wspieraj kluczowe województwa, pilnuj budżetu, energii sztabu i presji medialnej.
6. Po zamknięciu tygodnia przeczytaj **Dziennik Wyborczy**: bilans poparcia, mandatów, pieniędzy i aktualne depesze konkurencji.
7. Po tygodniu 30 rozegraj trzy depesze nocy wyborczej. Jeśli zdobędziesz mandaty, możesz negocjować koalicję.

## Zawartość
- 30 tygodni, sześć rozdziałów i misje regionalne.
- Pula 144 depesz (12 tematów i zestawów bazowych odpowiedzi), sześć powiązanych wątków fabularnych z odroczonymi skutkami oraz krótsze konsekwencje zwykłych depesz. Zwykła depesza nie powtarza się w jednej kampanii.
- 16 polskich województw z granicami administracyjnymi, regionalnym poparciem, biurami i możliwością interakcji z mapą.
- Pięć fikcyjnych ugrupowań rywali, działających co tydzień i atakujących m.in. wyrównane regiony.
- Cztery specjalizacje ekspertów, rozwój do poziomu 3, relacje z kierownictwem i umiejętności.
- Cztery pochodzenia kandydata z odmiennymi bonusami, personalizacja wizerunku.
- Ekonomia kampanii, sponsorzy, zadłużenie, energia, presja medialna i przygotowanie do koalicji.
- 180 mandatów w fikcyjnym parlamencie, regionalny przydział metodą d'Hondta oraz negocjacje o 91 mandatów.
- Sześć zakładek ograniczających nadmiar informacji i podział dostępnych działań na kategorie.

## Zapis gry i prywatność
Gra nie wymaga rejestracji ani serwera. Automatyczny zapis jest przechowywany **lokalnie w pamięci przeglądarki (localStorage)**, więc może zniknąć po usunięciu danych witryny. Dostępny jest również eksport/import pliku JSON. Gra nie wysyła zapisów do twórcy. Zapis ze starej wersji posiadającej 9 regionów nie jest zgodny z nowym podziałem.

## Mapa — źródło
Wektory granic województw pozyskano z publicznego zbioru [GeoJSON Polska — Województwa/Powiaty/Gminy](https://github.com/waszkiewiczja/GeoJSON-Polska-Wojewodztwa-Powiaty-Gminy), na podstawie danych Geoportalu z sierpnia 2025, oznaczonych przez autora jako „free to use”. Punkty uproszczono na potrzeby wyświetlania SVG. Kształty i nazwy województw są rzeczywiste, ale model wyborczy i ludnościowy stanowi fikcyjną symulację.

## Testy i ograniczenia
Przeprowadzono 72 pełne symulacje logiki kampanii w trzech poziomach trudności; każda ukończyła 30 tygodni i przydzieliła 180 mandatów. Zaktualizowano testy regresyjne w `tests/simulation.test.cjs`. **Nie przeprowadzono jeszcze manualnego testu całego interfejsu na wszystkich typach przeglądarek i urządzeń.** Zbalansowanie strategii wymaga rozgrywek z ludźmi. Pula depesz nadal używa powtarzanych grup bazowych odpowiedzi, choć nowe cele, działania i historie ograniczają monotonię.

## Publikacja
GitHub Pages można uruchomić później przez **Settings → Pages → Deploy from a branch → main / root**. Sama obecność kodu w repo nie oznacza publikacji strony.
