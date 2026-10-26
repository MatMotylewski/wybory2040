(function(){
'use strict';
// Jedno źródło geografii i rywali znajduje się w game.js.
const options={
economy:[
['Ujawnij szczegółowy program inwestycji',{budget:-2200,trust:3,national:.65,energy:-4}],
['Zażądaj zmian podatkowych',{trust:-1,awareness:3,national:.85,heat:3}],
['Zwołaj okrągły stół przedsiębiorców',{budget:-950,trust:2,org:2,national:.35}]
],
jobs:[
['Otwórz konsultacje z pracownikami',{budget:-1000,trust:3,national:.65,energy:-4}],
['Zaproponuj ulgę dla przedsiębiorców',{budget:-1800,national:1.1,trust:-1}],
['Postaw na przekwalifikowanie zawodowe',{budget:-1200,trust:2,national:.75}]
],
housing:[
['Przedstaw plan mieszkań na wynajem',{budget:-2200,trust:2,national:1.05}],
['Wesprzyj budownictwo prywatne',{budget:-1000,national:.8,awareness:2}],
['Rozpocznij konsultacje z lokatorami',{budget:-600,trust:3,org:2,national:.45}]
],
health:[
['Zaproponuj nowe standardy opieki',{budget:-1700,trust:3,national:.9}],
['Przedstaw plan cyfryzacji',{budget:-1400,awareness:2,national:.75}],
['Pojedź na otwarte spotkanie pacjentów',{budget:-450,trust:3,energy:-6,national:.4}]
],
education:[
['Zaproponuj finansowanie edukacji',{budget:-1600,trust:2,national:.9}],
['Powołaj zespół nauczycieli',{budget:-700,trust:3,org:2,national:.45}],
['Uruchom kampanię młodych',{budget:-2100,awareness:4,national:.95}]
],
infrastructure:[
['Rozpisz plan modernizacji',{budget:-2000,trust:3,national:.9}],
['Obiecaj szybkie inwestycje',{trust:-3,awareness:4,national:1.15,heat:5}],
['Oddaj decyzje samorządom',{budget:-600,trust:2,national:.5,org:3}]
],
environment:[
['Przedstaw etapy transformacji',{budget:-1500,trust:3,national:.9}],
['Zorganizuj wielki marsz',{budget:-2300,awareness:5,national:1,energy:-7}],
['Postaw na lokalny kompromis',{budget:-800,trust:2,national:.55,heat:-2}]
],
media:[
['Opublikuj wszystkie dokumenty',{trust:5,awareness:1,heat:-3}],
['Odpowiedz ostrą konferencją',{budget:-1100,trust:-3,awareness:6,national:.55,heat:7}],
['Zaproś niezależnych obserwatorów',{budget:-700,trust:4,heat:-5,national:.35}]
],
regions:[
['Daj regionom większą samodzielność',{budget:-1300,trust:2,national:.75,org:2}],
['Uruchom konsultacje w terenie',{budget:-900,org:4,national:.5,energy:-5}],
['Zapowiedz nowy fundusz lokalny',{budget:-2300,national:1.1,trust:0}]
],
trade:[
['Negocjuj kompromis z branżą',{budget:-1000,trust:3,national:.65}],
['Broń wolnej konkurencji',{trust:-1,awareness:3,national:1}],
['Zleć jawny audyt rynku',{budget:-500,trust:4,national:.35}]
],
science:[
['Powołaj program innowacji',{budget:-2100,trust:2,national:1}],
['Daj uczelniom więcej swobody',{budget:-950,trust:3,national:.6}],
['Przygotuj medialną prezentację',{budget:-1800,awareness:5,national:.75}]
],
security:[
['Zaoferuj międzypartyjne porozumienie',{budget:-400,trust:4,national:.5,heat:-2}],
['Zażądaj szybkiej reformy',{budget:-1600,awareness:4,national:.9,heat:4}],
['Powołaj obywatelską komisję',{budget:-850,trust:3,org:2,national:.4}]
]
};
const raw={
economy:[
'Fabryka zatrzymała maszyny|W największym zakładzie kraju stoją linie produkcyjne, a pracownicy czekają na decyzję zarządu.',
'Nocna kolejka przed bankiem|Mieszkańcy próbują wyjaśnić, dlaczego rosną opłaty za podstawowe usługi.',
'Nowy podatek od działalności|Wydawcy gazet publikują projekt ustawy, o którym nikt wcześniej nie słyszał.',
'Bank centralny alarmuje|Eksperci przewidują trudniejszy rok dla małych przedsiębiorstw.',
'Wystawa krajowego przemysłu|Naukowcy pokazują prototyp, który może odmienić produkcję.',
'Tanie towary z importu|Miejscowi producenci domagają się odpowiedzi na rosnącą konkurencję.',
'Niedobór części zamiennych|Fabryki czekają na dostawy, a związkowcy ostrzegają przed przestojami.',
'Tajemnicze dotacje|Audytorzy opisują niejasne kryteria rozdzielania funduszy rozwojowych.',
'Targi obiecują rekordowe kontrakty|Organizatorzy zapraszają kandydatów do debaty o przyszłości eksportu.',
'Bankructwo sieci sklepów|Z dnia na dzień znikają miejsca pracy i rosną obawy o lokalną gospodarkę.',
'Nowa strefa ekonomiczna|Rząd proponuje inwestycję, ale samorządy spierają się o jej koszty.',
'Rachunki przedsiębiorców|Właściciele warsztatów przedstawiają zestawienie obciążeń z ostatnich pięciu lat.'
],
jobs:[
'Załoga wychodzi przed bramę|W zakładzie metalowym trwa spór o warunki pracy i godziny nadliczbowe.',
'Znikające zawody|Raport ostrzega, że automatyzacja zmieni rynek pracy szybciej niż oczekiwano.',
'Pierwsza praca bez perspektyw|Absolwenci publikują list otwarty o niskich zarobkach.',
'Związkowcy żądają spotkania|Kolejne przedsiębiorstwa domagają się wspólnego forum dialogu.',
'Pracownicy sezonowi protestują|W nadmorskim regionie narastają problemy ze stabilnością zatrudnienia.',
'Spór o krótszy tydzień pracy|Ekonomiści i związki zawodowe przedstawiają sprzeczne obliczenia.',
'Strajk urzędników lokalnych|Samorządy obawiają się przerw w obsłudze mieszkańców.',
'Polacy Nowin pracują za granicą|Nowy raport opisuje odpływ pracowników z mniejszych miast.',
'Agencje zatrudnienia pod lupą|Kontrolerzy ujawniają nieuczciwe praktyki części pośredników.',
'Niedobór wykwalifikowanych fachowców|Przedsiębiorcy postulują nowe szkolenia zawodowe.',
'Kolejka po staż|Uczniowie szkół zawodowych opowiadają o trudnościach z praktykami.',
'Związek zawodowy proponuje pakt|Przedstawiciele załóg chcą porozumienia ponad podziałami.'
],
housing:[
'Osiedle bez ogrzewania|Mieszkańcy nowego bloku od tygodnia czekają na usunięcie usterki.',
'Ceny mieszkań biją rekord|Młode rodziny przedstawiają kwoty rat i czynszów.',
'Deweloper nie kończy budowy|Nabywcy lokali próbują odzyskać pieniądze z niedokończonej inwestycji.',
'Puste kamienice w centrum|Architekci pytają, dlaczego zaniedbane budynki stoją niewykorzystane.',
'Petycja lokatorów|Setki mieszkańców żądają przejrzystych zasad naliczania czynszu.',
'Wielka debata o mieszkaniach|Samorządowcy spierają się o rolę państwa i rynku.',
'Woda zalewa nowe osiedle|Fatalna kanalizacja doprowadza do lokalnego protestu.',
'Studenci nie mogą znaleźć pokoju|Rektorzy alarmują, że koszty zamieszkania rosną szybciej niż stypendia.',
'Wspólnoty remontują na kredyt|Starsi mieszkańcy obawiają się wzrostu opłat.',
'Nowa dzielnica bez szkół|Rodzice domagają się planowania usług publicznych razem z mieszkaniami.',
'Długie kolejki po lokal|Urząd miasta opublikował raport o potrzebach mieszkaniowych.',
'Spór o pustostany|Eksperci przedstawiają trzy różne pomysły wykorzystania niezamieszkałych budynków.'
],
health:[
'Przychodnia bez lekarza|Od kilku tygodni mieszkańcy powiatu mają problem z zapisaniem się na wizytę.',
'Kolejki do specjalistów rosną|Lekarze i pacjenci domagają się zmian w systemie rejestracji.',
'Szpital prosi o wsparcie|Dyrekcja regionalnej placówki pokazuje pilne potrzeby remontowe.',
'Dramat na izbie przyjęć|Reportaż ujawnia niewydolną organizację nocnych dyżurów.',
'Farmaceuci apelują|Branża proponuje łatwiejszy dostęp do podstawowej profilaktyki.',
'Nowy program badań|Eksperci pokazują korzyści z wykrywania chorób na wcześniejszym etapie.',
'Karetka utknęła w korku|Służby ratownicze chcą lepszej organizacji ruchu w stolicy.',
'Lekarze odchodzą z małych miast|W wielu powiatach brakuje personelu medycznego.',
'Lek dla dzieci niedostępny|Rodzice pytają o bezpieczeństwo dostaw.',
'Centrum zdrowia psychicznego|Terapeuci opowiadają o braku miejsc i potrzebie profilaktyki.',
'Nieczynny oddział porodowy|Mieszkańcy organizują protest przed szpitalem.',
'Elektroniczne recepty zawodzą|System rejestracji przestał działać na kilka godzin.'
],
education:[
'Nauczyciele piszą list otwarty|Rada pedagogiczna wylicza problemy z wyposażeniem klas.',
'Zamknięta biblioteka szkolna|Rodzice zbierają podpisy przeciwko ograniczaniu usług.',
'Studenci chcą reformy stypendiów|Samorządy studenckie debatują o wyrównywaniu szans.',
'Szkoła na dwie zmiany|Rodziny skarżą się na późne godziny zajęć.',
'Egzaminy pod ostrzałem|Eksperci spierają się o sprawiedliwość nowego systemu ocen.',
'Naukowcy bez grantów|Młodzi badacze proponują reformę finansowania.',
'Małe szkoły zagrożone zamknięciem|Mieszkańcy wsi organizują komitet obrony lokalnej placówki.',
'Komputery sprzed dekady|Uczniowie publikują zdjęcia przestarzałych pracowni.',
'Debata o pracach domowych|Rodzice i nauczyciele przedstawiają odmienne stanowiska.',
'Praktyki tylko na papierze|Kontrola opisuje fikcyjne zajęcia zawodowe.',
'Uniwersytet otwiera nowe kierunki|Pracodawcy pytają o przyszłe kompetencje absolwentów.',
'Centrum edukacji dorosłych|Organizacje społeczne chcą pomocy w zmianie zawodu.'
],
infrastructure:[
'Most zamknięty bez ostrzeżenia|Mieszkańcy codziennie objeżdżają kilkadziesiąt kilometrów.',
'Pociąg odjechał z opóźnieniem|Pasażerowie domagają się inwestycji i uczciwej informacji.',
'Autostrada przez pola|Rolnicy protestują przeciw nowemu wariantowi przebiegu trasy.',
'Dworzec czeka na remont|Od lat obiecywana przebudowa nie rusza z miejsca.',
'Woda z kranu niezdatna|W kilku gminach ogłoszono alarm infrastrukturalny.',
'Wielki plan portowy|Przedsiębiorcy chcą inwestycji, ekolodzy wskazują na ryzyko.',
'Zamknięta linia kolejowa|Mieszkańcy małych miejscowości walczą o przywrócenie połączenia.',
'Tunel pod rzeką|Inżynierowie prezentują projekt, ale koszty są wysokie.',
'Przerwa w dostawie prądu|Mieszkańcy pytają, czy sieć wytrzyma kolejne lata.',
'Korki od świtu|Transport publiczny stał się głównym tematem lokalnej kampanii.',
'Lotnisko bez pasażerów|Kontrolerzy pytają o sens kosztownej rozbudowy.',
'Nowy system biletowy zawiódł|Wielu pasażerów nie mogło kupić biletów przed pracą.'
],
environment:[
'Dym nad zakładami|Mieszkańcy skarżą się na jakość powietrza w przemysłowej dzielnicy.',
'Rzeka zmieniła kolor|Inspektorzy badają źródło zanieczyszczenia.',
'Susza zagraża plonom|Rolnicy domagają się długofalowego programu retencji.',
'Nowe farmy wiatrowe|Mieszkańcy spierają się o lokalizację inwestycji.',
'Płoną torfowiska|Strażacy ostrzegają przed skutkami zaniedbań środowiskowych.',
'Park narodowy czy tartak?|Lokalna społeczność jest podzielona w sprawie nowego planu.',
'Ceny ogrzewania rosną|Eksperci dyskutują o tempie zmian energetycznych.',
'Odpady zalegają na ulicach|Samorząd szuka wykonawcy po zerwaniu umowy.',
'Fabryka baterii w regionie|Projekt tworzy miejsca pracy, ale budzi pytania o wodę.',
'Ścieżki rowerowe bez połączeń|Aktywiści przedstawiają mapę problemów komunikacyjnych.',
'Kolejny gorący miesiąc|Meteorolodzy ostrzegają przed falą upałów.',
'Rolnicy i ekolodzy przy jednym stole|Dwie grupy przedstawiają wspólny apel o dialog.'
],
media:[
'Tajemniczy przeciek do redakcji|Gazeta otrzymuje dokument, którego autentyczność jest sporna.',
'Nagranie bez kontekstu|Krótki fragment wystąpienia wywołuje polityczną burzę.',
'Sondaż z nieznanego źródła|W sieci krąży zestawienie bez informacji o metodologii.',
'Redaktor żąda wywiadu|Dziennikarz znany z trudnych pytań zaprasza Cię do studia.',
'Plotka o darczyńcy|Niepotwierdzona informacja rozchodzi się po lokalnych gazetach.',
'Sztab konkurenta oskarża|Rywale zarzucają Twojej partii niespójność programu.',
'Dyskusja o reklamie politycznej|Obywatele pytają o oznaczanie finansowanych materiałów.',
'Fotografia bez podpisu|W internecie opublikowano zdjęcie z innego wydarzenia.',
'Wyciek wewnętrznej ankiety|Pracownik publikuje surowe, niezweryfikowane dane.',
'Sprostowanie na ostatniej stronie|Gazeta koryguje błędną informację, ale niesmak pozostaje.',
'Wiec pokazany w telewizji|Relacje różnią się w opisie liczby uczestników.',
'Dziennikarze domagają się jawności|Organizacje medialne chcą dostępu do finansów kampanii.'
],
regions:[
'Miasteczko bez autobusu|Mieszkańcy chcą połączenia z powiatowym szpitalem.',
'Burza o podział dotacji|Dwie gminy spierają się o finansowanie wspólnej szkoły.',
'Rolnicy blokują drogę|Protestujący chcą negocjacji w sprawie cen skupu.',
'Zamknięto urząd pocztowy|Starszym osobom trudniej załatwiać codzienne sprawy.',
'Festyn regionalny podzielił radę|Organizatorzy proszą kandydatów o wspólną deklarację.',
'Spór o granice powiatów|Mieszkańcy obawiają się zmiany dostępu do usług.',
'Samorządowy bunt|Burmistrzowie żądają większych wpływów z podatków.',
'Powódź odcina wsie|Lokalne służby potrzebują koordynacji i wsparcia.',
'Kopalnia chce rozbudowy|Region widzi miejsca pracy, sąsiedzi obawiają się szkód.',
'Miasto traci młodych|Nowe dane demograficzne wywołują debatę o przyszłości.',
'Wielkie targowisko zamknięte|Sprzedawcy domagają się rozmowy z władzami.',
'Bliżej stolicy czy regionu?|Eksperci proponują nowy podział kompetencji.'
],
trade:[
'Spór o ceny żywności|Sieci handlowe i rolnicy wzajemnie oskarżają się o wysokie marże.',
'Kupcy wychodzą na rynek|Mali sprzedawcy protestują przeciw zmianom czynszów.',
'Import taniego zboża|Rolnicy pytają o ochronę lokalnego rynku.',
'Handlowcy chcą niedziel wolnych|Związki zawodowe i przedsiębiorcy debatują o czasie pracy.',
'Nowe przepisy dla sklepów|Projekt ma uprościć kontrole, ale budzi sprzeciw.',
'Mieszkańcy walczą o targowisko|Plan zabudowy zakłada likwidację popularnego rynku.',
'Przygraniczny handel maleje|Samorządy raportują spadek wpływów lokalnych firm.',
'Promocje pod kontrolą|Organizacje konsumenckie zarzucają wprowadzające w błąd ceny.',
'Młode firmy czekają na płatności|Przedsiębiorcy skarżą się na opóźnienia.',
'Znikają sklepy spożywcze|Mieszkańcy osiedla apelują o pomoc dla lokalnych punktów.',
'Nieuczciwy przetarg?|Dokumenty ujawniają podejrzenia o faworyzowanie wykonawcy.',
'Wielkie centrum logistyczne|Plan inwestycji dzieli mieszkańców okolicy.'
],
science:[
'Robot na targach wynalazców|Naukowcy pokazują nową technologię dla fabryk.',
'Uniwersytet bez laboratoriów|Studenci domagają się inwestycji w sprzęt.',
'Rząd chce regulować algorytmy|Eksperci debatowali o przejrzystości technologii.',
'Lokalny satelita gotowy do startu|Projekt badawczy szuka dodatkowych funduszy.',
'Dane obywateli pod ochroną|Organizacje społeczne proponują nowe standardy prywatności.',
'Startup zapowiada przełom|Firma chce publicznego wsparcia innowacji.',
'Cyberatak na urząd|Służby ustalają źródło awarii systemu.',
'Nowa metoda diagnostyczna|Badacze apelują o finansowanie dalszych testów.',
'Wynalazcy z małej miejscowości|Młodzi konstruktorzy zaskakują branżę przemysłową.',
'Debata o automatyzacji|Eksperci pytają, jak przygotować pracowników na zmiany.',
'Muzeum przyszłości|Samorząd rozważa budowę centrum nauki.',
'Program powrotów naukowców|Uczelnie chcą zachęcić badaczy do pracy w kraju.'
],
security:[
'Alarm pogodowy w południowych regionach|Służby ratunkowe proszą o lepszą koordynację.',
'Kryzys wodociągowy|Władze kilku gmin organizują awaryjne dostawy wody.',
'Spór o finansowanie straży|Ochotnicze jednostki domagają się jasnych zasad wsparcia.',
'Awaria systemu ostrzegania|Mieszkańcy nie dostali komunikatu o zagrożeniu.',
'Ćwiczenia służb ratowniczych|Nowy raport pokazuje braki w wyposażeniu.',
'Przestępczość w statystykach|Dwa ośrodki publikują sprzeczne interpretacje danych.',
'Szyfrowanie danych obywateli|Eksperci proponują wzmocnienie zabezpieczeń urzędów.',
'Zaginęły dokumenty publiczne|Kontrola ustala, czy doszło do błędu czy zaniedbania.',
'Nocna awaria sieci kolejowej|Służby proszą o inwestycje w niezawodność.',
'Spór o nowe przepisy drogowe|Kierowcy i piesi prezentują odmienne stanowiska.',
'Rządowy raport utajniony|Organizacje obywatelskie apelują o jawność.',
'Bezpieczna szkoła|Rodzice chcą lepszego planu reagowania na sytuacje kryzysowe.'
]
};
const milestones={
4:{title:'Pierwsza debata liderów',body:'W wielkiej sali radiowej spotykają się wszystkie partie. Dziennikarze pytają o program i zdolność do kompromisu.',topic:'media',options:[['Odpowiadaj rzeczowo',{trust:6,national:1,energy:-9}],['Postaw na ostre wystąpienie',{awareness:10,national:1.5,trust:-4,heat:7}],['Zaproponuj wspólną deklarację',{trust:4,org:3,national:.75}]]},
9:{title:'Rozłam u konkurencji',body:'W Frontcie Obywatelskim kilku działaczy ogłasza odejście. Na stole leży oferta współpracy.',topic:'regions',options:[['Przyjmij nowych działaczy',{org:7,national:1.5,trust:-3,heat:3}],['Pozostań niezależny',{trust:5,national:.45}],['Zaproponuj publiczną debatę',{awareness:5,trust:2,national:.8}]]},
14:{title:'Kryzys budżetowy kraju',body:'Zmieniono prognozę wpływów podatkowych. Partie muszą zdecydować, co ograniczyć, a co chronić.',topic:'economy',options:[['Przedstaw plan oszczędności',{trust:5,national:.65,energy:-5}],['Broń inwestycji publicznych',{national:1.45,budget:-2400,heat:4}],['Zwołaj zespół ekspertów',{trust:3,org:4,budget:-900}]]},
19:{title:'Anonimowa teczka na biurku',body:'Sztab otrzymuje teczkę z niezweryfikowanymi oskarżeniami wobec rywala. Redakcja czeka na stanowisko.',topic:'media',options:[['Nie publikuj bez dowodów',{trust:7,heat:-8}],['Przekaż materiały niezależnym kontrolerom',{trust:5,budget:-800,heat:-3}],['Nagłoś sprawę bez weryfikacji',{awareness:8,national:.8,trust:-8,heat:16}]]},
24:{title:'Ostatni wielki sondaż',body:'Ogólnokrajowa gazeta przedstawia mapę przewidywanych mandatów. Sztaby reagują nerwowo.',topic:'jobs',options:[['Mów o konkretnych rozwiązaniach',{trust:4,national:1.2}],['Zwołaj masowy wiec',{budget:-3100,awareness:9,national:1.6,energy:-8}],['Skup się na lokalnych wolontariuszach',{org:8,national:.6,energy:-7}]]},
28:{title:'Debata przed ciszą wyborczą',body:'Ostatnie starcie kandydatów ogląda cała republika. Każde słowo może zdecydować o mandatach.',topic:'media',options:[['Postaw na spokojny finał',{trust:6,national:1.25}],['Uderz w przeciwników',{awareness:9,national:2,trust:-5,heat:9}],['Wezwij do współpracy',{trust:5,national:1.4,org:2}]]}
};
const pool=Object.entries(raw).flatMap(([topic,items])=>items.map((entry,index)=>{const p=entry.split('|');return {id:topic+'-'+index,topic,title:p[0],body:p[1],options:options[topic]}}));
window.WYBORY_DATA={pool,milestones};
})();