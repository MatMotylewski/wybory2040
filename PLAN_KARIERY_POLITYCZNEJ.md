# WYBORY2040 — plan przebudowy kampanii na symulator kariery politycznej

Status: **koncepcja dalszej rozbudowy, jeszcze niezaimplementowana**. Bieżący kod gry nadal ma kampanię **30-tygodniową**. Ten dokument określa następny etap bez sugerowania, że funkcje poniżej już działają.

## Problem

Trzydzieści powtarzanych tygodni odsuwają najciekawsze wydarzenia (rząd, koalicja, starcia personalne) na koniec. Proponowany kierunek: szybciej doprowadzić do parlamentu, a potem rozgrywać kolejne kampanie i kryzysy o różnym charakterze.

## Nowa struktura

1. **Powstanie partii i wybory parlamentarne (12 tygodni)**. Trzy punkty działań tygodniowo; w każdym tygodniu wyróżniony jeden istotny konflikt. W tygodniach 4 i 9 szczególne debaty. W tygodniu 12 noc wyborcza i wynik.
2. **Koalicje i powołanie rządu (2–3 tury)**. Negocjacje z ugrupowaniami: program, obsada resortów, głosowanie nad wotum zaufania. Gdy brak większości, możliwy rząd mniejszościowy lub opozycja — gra nie kończy się porażką.
3. **Rządzenie albo opozycja (6 tur)**. Ustawy, budżet, naciski społeczne, spory koalicyjne, głosowania w parlamencie, komisje śledcze, afery polityków i przetasowania personalne. Opozycja przygotowuje alternatywny program i kontroluje działania władzy.
4. **Wybory prezydenckie (3–4 tury)**. Gracz wskazuje kandydata spośród polityków własnej partii lub wspólnego kandydata z koalicjantem. Liczą się rozpoznawalność, poparcie, reputacja, lojalność, sprawność w debacie i historia kontrowersji. Możliwa pierwsza i druga tura wyborów oraz negocjacje o poparcie pomiędzy turami.
5. **Dalsza kariera**. Wybór następnego celu: utrzymanie władzy, ponowne wybory, kampania prezydencka lub rozbudowa partii. Opcja szybkiej kampanii i pełnej kariery.

## Politycy i ich kariery

Każdy polityk ma: unikatową tożsamość, rolę, specjalizację, poparcie/rozpoznawalność, lojalność, doświadczenie, koszt zatrudnienia albo uzgodnienia transferu, poglądy programowe, relacje, potencjalne kontrowersje. Oddzielamy personalne poparcie kandydata od ogólnego poparcia partii. Można:
- rekrutować wolnych polityków i działaczy innych partii na podstawie ich zgody, warunków i reputacji;
- proponować stanowiska, uzgadniać program i zapobiegać konfliktom;
- odsunąć polityka w związku z kontrowersją, przeprowadzić niezależne wyjaśnienia, publicznie obronić go lub spróbować zataić sprawę — z ryzykiem jej ujawnienia i konsekwencjami;
- wyznaczać osoby na ministrów, rzecznika, szefa klubu lub kandydata na prezydenta.

Nie zastępujemy polityków automatycznie: usunięcie osoby pozostawia wakat, a nowy pracownik ma własne wartości początkowe.

## Główne zasady balansu i tempa

- W każdej turze jeden główny dylemat i maksymalnie trzy akcje, bez konieczności klikania przez cztery powtarzalne ekrany.
- Pojedynczy polityk może zaskoczyć kryzysem, propozycją transferu lub własnym planem — ale zdarzenia mają przyczyny i zapowiedzi.
- Sojusze, afera i ustawa powinny wracać po kilku turach; archiwum pokazuje powód konsekwencji.
- Unikamy bezwarunkowej opłacalności jednej strategii (np. ciągłego zbierania funduszy lub kampanii medialnej).
- Po wyborach ważniejszy jest parlament i stabilność rządu niż sam sondaż.
- Przejście na krótszą kampanię wymaga przeskalowania dotychczasowych wydarzeń w tygodniach 1–30, celów, finansów, kosztów i testów — **nie wystarczy zamienić 30 na 12 w interfejsie**.

## Kolejność prac

1. Zintegrowane kierownictwo partii i rynek kandydatów — **wdrożone w obecnej wersji**.
2. Refaktoryzacja kampanii z 30 do 12 tygodni, migracja fabuły, zbalansowanie gospodarki i testy.
3. Negocjacje programowe i rząd / opozycja.
4. Rynek polityków, parlament, transfery, ministrowie i kontrowersje.
5. Wybory prezydenckie i rozwinięcie kariery.
6. Testy mobilne, tempo sesji i balans.
