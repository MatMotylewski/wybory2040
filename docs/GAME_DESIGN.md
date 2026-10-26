# WYBORY2040 — projekt pełnej gry (wersja projektowa 1.0)

> **STATUS: PLAN — nie są to funkcje już zaimplementowane.** Obecny `index.html` to 10-tygodniowe demo. GitHub Pages konfigurujemy na końcu, gdy wersja gry będzie gotowa.

## 0. Wizja i cele

Jednoosobowa, narracyjno-strategiczna gra przeglądarkowa w fikcyjnej Republice Nowin (2040): prowadzenie własnej partii od zera, kampania wyborcza, wynik w 9 regionach, 180 mandatów i negocjacje po wyborach. Klimat satyryczny, oprawa inspirowana starym drukiem i prasą PRL; wszystkie partie, osoby, wydarzenia i liczby fikcyjne. Brak odniesień do współczesnych prawdziwych kandydatów.

- **Docelowa przeciętna długość jednego pełnego przejścia:** 150–180 minut; to cel do zweryfikowania testami, a nie twarde minimum wymuszane timerami.
- **30 tygodni:** 30 tur po średnio 4–5 minut = 120–150 minut.
- **Prolog:** 10–15 minut; **wyzwania i debaty specjalne:** część tygodni, łącznie ~10–15 minut; **finał:** 15–25 minut.
- **Regrywalność:** program i pochodzenie lidera, konkurencyjne sztaby, rozgałęzienia, rotujące wydarzenia, losowany seed, różne zakończenia.
- **Brak backendu i bazy:** silnik JS, grafika CSS/SVG, bez logowania, płatności i analityki. Bez automatycznego śledzenia użytkowników.

## 1. Tryby i ekran startowy

- **Kampania główna:** 30 tygodni, domyślny poziom „Zwykły obywatel”.
- **Szybka kampania:** 10 tygodni do testów i dla powracających graczy.
- **Scenariusze:** w przyszłości np. „Krach gospodarczy”, „Rozbita koalicja”, „Partia jednego regionu”.
- Prolog: nazwa partii (max 32 znaki), symbol graficzny z gotowych SVG, slogan (max 70), pochodzenie lidera, dwa priorytety programowe spośród: praca, mieszkania, zdrowie, samorządy, energia, edukacja; jeden „czerwony warunek”, z którego trudno wycofać się przy koalicji.
- Pochodzenie z jawnymi premiami/karami: „Społecznik” (+8 wiarygodności, −15 000 budżetu); „Były urzędnik” (+25 000 budżetu, −8 wiarygodności); „Lokalny lider” (+15 organizacji w dwóch regionach, −5 do rozpoznawalności); „Dziennikarz” (+10 reputacji medialnej, −5 organizacji).
- Wybór 3 z 6 członków sztabu (rzecznik, skarbnik, organizatorka, analityk, negocjatorka, terenowiec); pasywna premia i unikalne rozmowy.

## 2. Główna pętla tygodnia (4–5 minut)

1. **Pierwsza strona gazety**: jeden główny nagłówek i 0–1 dodatkowy depeszowy sygnał ze świata. Pokazuje, co zmienił poprzedni tydzień.
2. **Wydarzenie z wyborem**: 3–4 odpowiedzi, po krótkim uzasadnieniu skutków. Często wybór prowadzi do dalszego wątku (flaga w stanie gry).
3. **Sztab i mapa**: 3 punkty działań tygodniowo. Wydaj je na maksymalnie dwa działania o różnych typach; co najmniej jedno może dotyczyć konkretnego regionu.
4. **Reakcja rywali i prasy**: jeden ruch innej partii, notka prasowa, zmiana trendu oraz koszt utrzymania sztabu.
5. **Sondaż i kronika**: wynik w skali kraju i w regionach, z małą niepewnością pomiaru. Informacja o nowych powiązaniach fabularnych.

W tygodniach specjalnych debata, śledztwo albo negocjacja zastępuje część rutynowych wyborów, **nie dodaje nużącej dodatkowej serii kliknięć**.

## 3. Zasoby i równowaga

Widoczne stale: **sondaż krajowy**, **budżet w zł**, **wiarygodność 0–100**, **organizacja sztabu 0–100**, **numer tygodnia**. Widoczne w zakładkach: zainteresowanie mediów, relacje z frakcjami, stres zespołu, przyrzeczone obietnice, poparcie regionalne.

- Początkowy budżet „Zwykłego obywatela” 90 000 zł; tygodniowe koszty bazowe 2 500 zł.
- Działania: lokalny objazd 6 000 zł/2 PA, kampania plakatowa 4 000 zł/1 PA, debata obywatelska 3 000 zł/1 PA, ogólnokrajowe spoty 15 000 zł/2 PA, praca z wolontariuszami 1 000 zł/1 PA, zbiórka +8 000 zł/1 PA (z cooldownem 3 tygodni), badanie nastrojów 5 000 zł/1 PA. Poziomy cen i premii dostrajamy w symulacjach.
- Maks. 3 punkty akcji na tydzień; punkty nie przechodzą dalej. Nie można wydać więcej pieniędzy, niż ma sztab. Przy braku środków dostępne akcje bezkosztowe, aby nie blokować kampanii.
- Rosnąca rozpoznawalność i malejące przyrosty: ponawianie jednej taktyki w tym samym regionie przez 3 kolejne tygodnie daje połowę efektu.
- Wiarygodność modyfikuje skuteczność, ale nie powinna tworzyć spirali bez szans na odzyskanie poparcia.
- Przewidywane poparcie nie jest surową sumą punktów: dla każdego regionu istnieje **rozkład poparcia między 6 partiami** zawsze sumujący się do 100%.
- Przewidywane sondaże zawierają niewielki błąd próby/szum prezentacyjny; wynik końcowy opiera się na stanie realnego poparcia + ograniczone wahanie wyborcze, aby uniknąć absurdalnego odwrócenia wyniku.

## 4. Republika Nowin — 9 regionów i 180 mandatów

| Region | Mandaty | Swoisty temat kampanii |
|---|---:|---|
| Stołeczny | 40 | mieszkania, transport, usługi |
| Fabryczny | 30 | praca, przemysł, energia |
| Nadmorski | 25 | handel, turystyka, ekologia |
| Zielonych Równin | 20 | rolnictwo, samorządy |
| Akademicki | 15 | edukacja, innowacje, najem |
| Górski | 15 | infrastruktura i dostępność |
| Pogranicze | 15 | bezpieczeństwo i transport |
| Jeziorny | 10 | środowisko i miejsca pracy |
| Południowy | 10 | rodziny i zdrowie |
| **Razem** | **180** | **Większość: 91** |

Mapę tworzy lokalny interaktywny SVG; proste klikalne kształty, bez zewnętrznych map/API. Każdy region ma siłę struktur, poparcie sześciu partii, priorytet tematów, nastrój i ryzyko protestów. Akcje w danym regionie wzmacniają wynik tam, ale uszczuplają ograniczony budżet.

## 5. Rywale (wyłącznie fikcyjni)

1. **Porozumienie Obywatelskie** — sprawny, zasobny sztab; skupia się na szerokim poparciu.
2. **Front Pracy** — silniejszy w regionach przemysłowych; reaguje na kryzysy zatrudnienia.
3. **Liga Regionów** — silna organizacja lokalna; lubi kompromisy samorządowe.
4. **Nowa Epoka** — sprawnie prowadzi kampanię medialną, ale ma słabsze struktury.
5. **Ład i Porządek** — duża dyscyplina sztabu i twarde warunki koalicyjne.

Co tydzień jeden rywal wykonuje widoczny ruch. AI wybiera z zestawu 8 strategii według braków w sondażach, regionu priorytetowego, dostępnych środków i charakteru. AI nie ma dostępu do ukrytych przyszłych decyzji gracza.

## 6. Scenariusz główny — 30 tygodni

| Tydz. | Akt | Główny temat i rozstrzygnięcie |
|---:|---|---|
| 1 | I | **Pierwszy wiec.** Gdzie wystąpić, kogo zaprosić, jak sfinansować debiut. |
| 2 | I | **Redakcja puka do drzwi.** Wywiad, trudne pytania i pierwsze nagłówki. |
| 3 | I | **Wojna plakatowa.** Konflikt o lokalizacje, tani druk lub uczciwa ugoda. |
| 4 | I | **Kontrowersyjny kandydat.** Silne nazwisko z kłopotliwą przeszłością. |
| 5 | I | **Katastrofa w regionie.** Pomoc mieszkańcom albo kampania w innych miejscach. |
| 6 | I | **Hojny sponsor.** Duża darowizna, warunki i przyszła zależność. |
| 7 | I | **Pierwszy wielki sondaż.** Decyzja o korekcie kampanii lub konsekwencji programu. |
| 8 | II | **Telewizyjny wywiad.** Trudne pytania o koszty obietnic. |
| 9 | II | **Tournee po prowincji.** Rozplanowanie podróży i logistyczne kompromisy. |
| 10 | II | **Pierwsza debata liderów.** Mini-gra 3 pytań i riposta przeciwnika. |
| 11 | II | **Strajk w fabrykach.** Praca, inflacja i polityczne koszty obietnic. |
| 12 | II | **Gazeta drukuje pomyłkę.** Sprostowanie, pozew lub wykorzystanie uwagi. |
| 13 | II | **Przeciek ze sztabu.** Kto wynosi informacje? Śledztwo i relacje z zespołem. |
| 14 | II | **Zwrot w sondażach.** Przegląd strategii, regionalne priorytety, specjalne wydanie. |
| 15 | III | **Oskarżenie w mediach.** Konfrontacja dowodów i szybka odpowiedź. |
| 16 | III | **Powrót darczyńcy.** Konsekwencje decyzji z tygodnia 6 albo wariant zastępczy. |
| 17 | III | **Fala zamknięć zakładów.** Konflikt budżetu, interwencji i obietnic. |
| 18 | III | **Nagranie z wiecu.** Autentyczne, zmanipulowane czy wyrwane z kontekstu? |
| 19 | III | **Gazeta ujawnia aferę.** Wiarygodność vs. interes partii. |
| 20 | III | **Debata kryzysowa.** Wybór tonu i trzech pytań pod presją. |
| 21 | III | **Pierwsze propozycje sojuszu.** Nieformalne kontakty i cena współpracy. |
| 22 | III | **Bunt regionalnych struktur.** Mediować, wymienić liderów czy oddać wpływy. |
| 23 | IV | **Wielka korekta programu.** Zostać wiernym obietnicom czy szukać centrum. |
| 24 | IV | **Burza niszczy infrastrukturę.** Konkurujące potrzeby regionów. |
| 25 | IV | **Ostatnie pieniądze.** Ryzykowna reklama, wolontariusze albo rezerwa. |
| 26 | IV | **Atak rywala.** Sprostowanie, kontratak, milczenie lub debata. |
| 27 | IV | **Mobilizacja sympatyków.** Skoncentrowana akcja terenowa. |
| 28 | IV | **Wielka debata finałowa.** Kilka rund, dynamiczne pytania i reakcje rywali. |
| 29 | IV | **Ostatni numer gazety.** Wybór jednego strategicznego komunikatu. |
| 30 | IV | **Finałowy wiec i zamknięcie kampanii.** Ostateczne inwestycje i mobilizacja. |

Przy każdych z 30 wydarzeń: co najmniej 3 odpowiedzi, krótka konsekwencja natychmiastowa oraz — w około połowie — konsekwencja odroczona. Główne wydarzenie ma wariant zapasowy, aby ciąg fabuły miał sens bez odpowiedniej flagi.

## 7. Pula 130 wydarzeń (do napisania, zbalansowania i implementacji)

- **30 wydarzeń głównych** z tabeli powyżej.
- **24 wydarzenia regionalne**: przemysł, komunikacja, szkoły, szpitale, susze, turystyka, lokalne inwestycje, wyjazdy, konflikty samorządowe itp.
- **16 wydarzeń medialnych**: wywiady, pomyłki prasowe, rysunek satyryczny, tajne notatki, trudne pytania, fałszywe cytaty.
- **12 wydarzeń gospodarczych**: podwyżki cen, awaria energii, brak surowców, masowe zwolnienia, sukces eksportowy.
- **8 wydarzeń sztabu**: konflikty pracowników, wypalenie wolontariuszy, zmiana rzecznika, tajemnicza rezygnacja.
- **12 wydarzeń losowo-absurdalnych**: zaginiona drukarnia, plakat z błędem, odwołany przemarsz, pochwała od niechcianej organizacji itp.
- **20 wydarzeń łańcuchowych**: konsekwencje wcześniej ustawionych flag.
- **8 specjalnych scen**: debaty, śledztwa, koalicje, audyt pieniędzy, wieczór wyborczy.
- **Łącznie 130 unikalnych kart/scen w planowanej bibliotece** (nie wszystkie występują podczas jednej kampanii).

Przykładowe łańcuchy:
- **Darczyńca**: oferta (6) → żądanie wpływu (16) → przeciek przed wyborami (26) albo nagroda za odrzucenie oferty.
- **Nieuczciwy kandydat**: nominacja (4) → przeciek (15) → wycofanie kandydata/przeprosiny lub twarda obrona.
- **Pomoc po katastrofie**: obietnica (5) → raport realizacji (12–18) → satysfakcja/gniew regionu.
- **Przeciek sztabowy**: pierwsze sygnały (13) → śledztwo (18) → rozłam lub odbudowanie lojalności (22).
- **Zbliżenie z inną partią**: kontakt (21) → warunki poparcia (27) → negocjacje po wyborach.

## 8. Zestaw mini-gier i specjalnych scen

- **Debata TV — tyg. 10, 20 i 28:** 3 rundy. Każda ma pytanie, odpowiedź, reakcję rywala oraz możliwość jednej riposty. Postacie reagują na obietnice i posiadane dowody.
- **Mapa kampanii:** raz na turę wybór regionu, lokalnego działania i kosztów dojazdu. Zasięg działań regionalnych ogranicza organizacja.
- **Sztab kryzysowy — tyg. 13/15/19/22:** decyzje przy niepełnej informacji; możesz zlecić weryfikację faktów za koszt/PA. Szybka reakcja bywa ryzykowna.
- **Karta redakcyjna:** przy kilku przełomowych tygodniach wybór nagłówka i argumentu; wpływa na narrację, a nie arbitralnie na wielkie skoki poparcia.
- **Wieczór wyborczy:** publikacja wyników region po regionie, stopniowo odsłaniane mandaty, bez sztucznego oczekiwania.
- **Negocjacje:** trzy rundy układania programu i podziału stanowisk, test sprzecznych obietnic.

## 9. Finał, mandaty, koalicje

- Po tygodniu 30 każda partia ma procent głosów w 9 regionach. Partia z mniej niż 5% poparcia krajowego nie uczestniczy w podziale mandatów (fikcyjna ordynacja gry).
- Mandaty rozdzielane są w każdym okręgu metodą **d’Hondta** między partie powyżej progu, a suma zawsze wynosi 180.
- Większość parlamentarna: 91 mandatów.
- Możliwe negocjacje 1–3 koalicjantów. Partnerzy mają 2–3 czerwone linie programowe, chęć objęcia funkcji i poziom zaufania. Zaproponowanie zbyt wielu sprzecznych postulatów niszczy wiarygodność.
- Jeśli samodzielnie masz ≥91 — finał większościowy. Jeśli koalicja zbierze ≥91 i zgodę stron — rząd koalicyjny. Inaczej opozycja albo, w zależności od pozostałych partii, mniejszościowy scenariusz finałowy.
- Podsumowanie: mapa zwycięzców, głosy, mandaty, 5 najważniejszych decyzji, polityczna „okładka” do pobrania jako obraz i nowa kampania.

## 10. Projekt wizualny: gazeta / PRL

- Kontynuujemy estetykę już wgranego `index.html`: papier pożółkły, winiety, czarne szpalty, czerwona pieczęć, rastry i czarno-białe ilustracje.
- Tydzień = nowe wydanie gazety z numerem, datą, nagłówkiem, podpisami i rubryką „Z kraju”.
- Mapa jako czarno-biały druk z czerwonym zaznaczeniem regionu. Wyniki jako barsy i stemplowane kartki.
- Proste ilustracje CSS/SVG, bez ciężkiej grafiki, fonty oparte na lokalnych krojach systemowych (docelowo bez zewnętrznych żądań).
- Dodatkowy przełącznik: animacje i efekty dźwiękowe włącz/wyłącz. Dostępność klawiaturą, focus, kontrast, małe ekrany i reduced motion.
- Satyra na realia prasowe, bez rzeczywistych plakatów propagandowych.

## 11. Zapis stanu bez gromadzenia danych

Ponieważ pełne przejście zajmie 2–3 godziny, **konieczny jest ręczny zapis i wznowienie**, ale bez serwera, kont i automatycznego zapisu w przeglądarce:
- **„Pobierz zapis”** — przycisk pobiera plik `.json` z seedem, numerem tygodnia, stanem partii, poparciem, flagami fabularnymi, rywalami i historią.
- **„Wczytaj zapis”** — wybór pliku przez użytkownika, walidacja schematu i numeru wersji, odtworzenie stanu bez wysyłania pliku gdziekolwiek.
- Brak `localStorage`, cookies oraz automatycznej wysyłki danych. Wszystkie operacje lokalne na urządzeniu.
- Plik od gracza traktujemy jak niezaufane wejście: limity rozmiaru, wersjonowanie, sprawdzanie typów/liczb, bez `eval` i bez renderowania nieoczyszczonego HTML.
- Stan gry poza ręcznym eksportem żyje tylko w pamięci aktywnej karty.

## 12. Dane i architektura statyczna

Rozdzielamy kod zamiast jednego ogromnego pliku:
```
index.html
styles/
  newspaper.css
scripts/
  app.js
  state.js
  simulation.js
  events.js
  rivals.js
  elections.js
  save-load.js
data/
  events-main.js
  events-side.js
  event-chains.js
assets/
  icons.svg
README.md
docs/
  GAME_DESIGN.md
```
Dla GitHub Pages używać ścieżek względnych `./`, bez absolutnych `/assets/`, bez budowania po stronie serwera. Nie wymagamy Node ani narzędzi instalowanych przez gracza.

Format wydarzenia (schemat poglądowy):
```js
{
  id: 'donor_offer',
  title: 'Hojny sponsor',
  week: 6,
  conditions: [],
  choices: [
    { label: 'Przyjmij', effects: { money: 30000, trust: -5 }, flags: ['donor_accepted'] },
    { label: 'Odmów', effects: { trust: 4 }, flags: ['donor_rejected'] }
  ],
  followups: ['donor_demands']
}
```
Randomizacja deterministyczna seedem, osobny silnik efektów, event pool bez powtórek aż do wyczerpania, walidacja flag i warunków. Wszystkie opisy w danych, UI niezależne od logiki.

## 13. Testy i kryteria akceptacji

**Silnik:**
- Suma głosów w każdym regionie ≈100% (do tolerancji zaokrąglenia), łączna liczba mandatów =180, brak wartości NaN i poparcia ujemnego.
- Tury 1–30 i wszystkie specjalne sceny można ukończyć. Brak blokady przez niedobór środków.
- Sekwencje eventów nie aktywują scen sprzecznych z wcześniejszymi flagami.
- Testy przy tym samym seedzie i wyborach dają identyczny wynik.
- Sztab ma strategię zwycięską, ale nie jedną automatycznie dominującą.
- 1000 automatycznych kampanii dla różnych archetypów i strategii do wykrywania nadmiernej trudności.

**Interfejs:**
- Działa na ekranach 320 px i szerokich monitorach; przyciski łatwe do naciśnięcia.
- Dostępność: klawiatura, fokus, reduced motion, czytelne etykiety, bez osadzonych trackerów.
- Zapis/odczyt działa w nowej karcie bez wysyłki danych.
- Test gry mobilnej i komputerowej, przynajmniej 3 przejścia testowe w różnych stylach.

**Czas:**
- W testach z ludźmi mierzymy medianę czasu i liczbę podejmowanych decyzji.
- Cel 150–180 min w kampanii głównej bez wymuszonego czekania; gracz podejmujący decyzje natychmiast może skończyć szybciej.
- Jeśli gra trwa za krótko, dodajemy interesujące wybory i konsekwencje, **nie puste tury**.

## 14. Kolejność implementacji (bez obietnicy terminów)

1. **Fundament**: rozbicie monolitu HTML na moduły, system stanu, seed, 30 tur, interfejs gazetowy i nawigacja.
2. **Strategia**: 9 regionów, budżet i PA, rywale, algorytm przepływu poparcia, prawdziwe regionalne sondaże.
3. **Fabuła**: komplet 30 wydarzeń głównych, 20 łańcuchowych, puli 60 eventów pobocznych i 8 specjalnych scen.
4. **Finał**: d’Hondt, mapa mandatów, koalicje, alternatywne zakończenia.
5. **Jakość**: eksport/import JSON, dostępność, animacje w stylu gazety, walidacja, symulacje i testy.
6. **Publikacja**: dopiero na końcu GitHub Pages i test publicznego adresu.

### Decyzje projektowe przyjęte na start
- Pełna kampania 30 tygodni i ok. 150–180 min; tryb szybki 10 tygodni.
- Ręczny zapis do pliku JSON, bez trwałego zapisu w aplikacji.
- Całość pozostaje statyczna; nie potrzebuje serwera aplikacyjnego.
- Wszystkie partie, liderzy, regiony i wydarzenia fikcyjne.
