# WYBORY2040 — Dziennik Wyborczy

Polskojęzyczna strategiczna gra wyborcza w klimacie retro gazety. Kampania trwa 30 tygodni i rozgrywa się w fikcyjnym świecie politycznym opartym o 16 rzeczywistych województw Polski. Partie, postacie, kampania, sondaże i wydarzenia są fikcyjne.

## Uruchamianie
Otwórz projekt w Visual Studio Code i uruchom `index.html` przez Live Server, ewentualnie otwórz go bezpośrednio w przeglądarce. W katalogu powinny znajdować się `index.html`, `game.js`, `data.js` oraz folder `assets/candidates/` z portretami.

Aktualizacja lokalnej kopii: `git pull --rebase origin main` (tylko przy czystym lub zatwierdzonym drzewie roboczym). Testy Node.js: `npm test`.

## Jak grać
1. Wybierz nazwę partii, program, poziom trudności, nazwisko i płeć kandydata, jego przeszłość oraz portret.
2. Na początku tygodnia odpowiedz na depeszę. W niektórych tygodniach rozegraj trzyrundową debatę lub kryzys medialny.
3. Otrzymujesz **3 punkty działań**. Możesz przeznaczyć je na teren, media, finanse, program lub rozmowy z innymi partiami; możesz też zakończyć tydzień przed ich wykorzystaniem.
4. W zakładce **Sztab** zarządzaj czterema stanowiskami kierownictwa; na wolne stanowisko wybieraj spośród trzech kandydatów o różnych umiejętnościach, lojalności, kosztach rekrutacji i pensji. W zakładce **Finanse** zarządzaj biurami, sponsorami, pożyczkami oraz zaległościami.
5. Realizuj co pięć tygodni regionalną misję rozdziału. Wspieraj kluczowe województwa, pilnuj budżetu, energii sztabu i presji medialnej.
6. Po zamknięciu tygodnia przeczytaj **Dziennik Wyborczy**: bilans poparcia, mandatów, pieniędzy i aktualne depesze konkurencji.
7. Po tygodniu 30 rozegraj trzy depesze nocy wyborczej. Jeśli zdobędziesz mandaty, możesz negocjować koalicję.

## Zawartość
- 30 tygodni, sześć rozdziałów i misje regionalne.
- Pula 144 depesz (12 tematów i zestawów bazowych odpowiedzi), sześć powiązanych wątków fabularnych z odroczonymi skutkami oraz krótsze konsekwencje zwykłych depesz. Zwykła depesza nie powtarza się w jednej kampanii.
- 16 polskich województw z granicami administracyjnymi, regionalnym poparciem, biurami i możliwością interakcji z mapą.
- Pięć fikcyjnych ugrupowań rywali, działających co tydzień i atakujących m.in. wyrównane regiony.
- Cztery stanowiska kierownictwa obsadzone na początku, po trzech kandydatów na każde stanowisko, poziomy kompetencji 1–3, indywidualna lojalność i pensja tygodniowa.
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

## Pamięć decyzji i archiwum polityka

Nowa zakładka **Teczka polityka** zawiera podjęte decyzje, sprawy w toku, obietnice i bilanse zakończonych pięciotygodniowych rozdziałów. Wydarzenia z następstwami otrzymują odwołania do wcześniejszego wyboru. Obietnice wykrywane są na podstawie deklaracji w wydarzeniach i można je realizować kolejnymi działaniami; niespełnione w terminie powodują spadek wiarygodności. Styl lidera (reformator, negocjator, polityczny wojownik, działacz terenowy) wynika z historii działań, a nie wyglądu postaci. Całość pozostaje w automatycznym zapisie.

## Telefony i responsywność

Interfejs ma responsywne reguły CSS, w tym szerokości do 680 px: przewijane dotykowo zakładki, wygodniejsze przyciski, dwukolumnowe statystyki oraz układ portretów w dwóch kolumnach. Mapa skaluje się razem z ekranem. **Testy logiki nie zastępują ręcznego przeglądu w mobilnej przeglądarce** (zwłaszcza Safari na iPhonie i Android Chrome). Jeśli strona jest uruchamiana lokalnie z `file://`, zachowanie pamięci przeglądarki może być różne; wygodniej używać Live Server lub hostingu.

## Kierownictwo i rekrutacja (aktualne)

Na początku gry cztery stanowiska są obsadzone przez założycieli partii. Nie ma już oddzielnego, dublującego się sztabu ekspertów. Można zwolnić członka kierownictwa, pozostawiając stanowisko puste (brak kosztu i bonusu). Przy wakacie gra pokazuje **trzy konkretne kandydatury na dane stanowisko**, z porównaniem umiejętności, lojalności, jednorazowego kosztu zatrudnienia i tygodniowej pensji. Oferty można podejrzeć także przed zwolnieniem. Zatrudniona osoba rozpoczyna na poziomie 1, z własnymi statystykami — nie dziedziczy lojalności ani szkoleń poprzednika. Szkolenie kosztuje 2100 zł za poziom, maksymalny poziom to 3. Pensje są wliczane w bilans finansowy tygodnia.

Kolejne pomysły (krótsza kampania, koalicje, rządzenie, transfery polityków, wybory prezydenckie) opisano w [PLAN_KARIERY_POLITYCZNEJ.md](PLAN_KARIERY_POLITYCZNEJ.md). Są to propozycje na następne etapy; bieżąca wersja nadal trwa 30 tygodni.

## Karty postaci (wdrożone)

Zakładka **Politycy** pokazuje karty czterech stanowisk kierownictwa, umożliwia otwarcie pełnego profilu i przejście do rekrutacji w przypadku wakatu. Profil zawiera imię i nazwisko, funkcję, lojalność, doświadczenie, umiejętność, tygodniową pensję oraz poglądowe parametry poparcia osobistego, debatowania i ryzyka kontrowersji. Te trzy ostatnie są na razie wartościami modelowymi wyliczanymi ze statystyk postaci, a nie niezależną mechaniką wyborów prezydenckich czy afer.
