'use strict';
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const REGIONS=[
{name:"Dolnośląskie",population:29,traits:[1.14,1.12,0.9,0.88]},
{name:"Kujawsko-pomorskie",population:20,traits:[0.95,1.07,1.05,1.03]},
{name:"Lubelskie",population:19,traits:[0.86,0.92,1.11,1.17]},
{name:"Lubuskie",population:10,traits:[1.12,1.08,0.94,0.9]},
{name:"Łódzkie",population:23,traits:[1.03,1.15,1,0.97]},
{name:"Małopolskie",population:32,traits:[1.05,1.02,1.01,1.04]},
{name:"Mazowieckie",population:55,traits:[1.3,1.12,0.86,0.82]},
{name:"Opolskie",population:9,traits:[0.98,1.07,1.01,1]},
{name:"Podkarpackie",population:20,traits:[0.89,0.96,1.1,1.15]},
{name:"Podlaskie",population:11,traits:[0.92,0.95,1.12,1.15]},
{name:"Pomorskie",population:23,traits:[1.17,1.05,0.95,0.88]},
{name:"Śląskie",population:43,traits:[0.99,1.21,0.96,0.94]},
{name:"Świętokrzyskie",population:11,traits:[0.91,1.04,1.09,1.1]},
{name:"Warmińsko-mazurskie",population:14,traits:[0.98,0.92,1.11,1.07]},
{name:"Wielkopolskie",population:35,traits:[1.09,1.12,0.96,0.91]},
{name:"Zachodniopomorskie",population:16,traits:[1.13,1.05,0.96,0.91]}
];
const SEG=['Młodzi','Pracujący','Rodziny','Seniorzy'], WEIGHTS=[.27,.30,.25,.18];
const RIVALS=[
{name:'Blok Obywatelski',base:29,lean:[1.2,1.12,.92,.78]},
{name:'Unia Prowincji',base:22,lean:[.68,.9,1.2,1.38]},
{name:'Sojusz Pracy',base:19,lean:[.95,1.32,1.08,.75]},
{name:'Nowa Republika',base:15,lean:[1.25,.91,.8,1.05]},
{name:'Partia Zielonych',base:9,lean:[1.4,.95,.93,.65]}
];
const CHAPTERS=['Narodziny komitetu','Pierwsze sondaże','Kraj słucha','Sezon debat','Kryzys państwowy','Ostatnia prosta'];
const EVENT_POOL=[
['Brak podpisów','Komisja kwestionuje część podpisów pod listami.',[['Wyślij prawników',[1,0,0,0],3,1400],['Mobilizuj wolontariuszy',[2,1,0,0],2,500],['Atakuj urzędników',[1,1,-1,-1],-5,0]]],
['Pierwszy wywiad','Dziennikarz pyta o koszty Twoich obietnic.',[['Przedstaw liczby',[0,2,2,1],5,600],['Mów o zmianach',[3,0,0,0],-1,0],['Odmów komentarza',[-1,0,-1,0],-3,0]]],
['Strajk kolejarzy','Związkowcy blokują dworzec w regionie przemysłowym.',[['Rozmowy ze związkami',[0,3,1,1],3,950],['Poprzyj przedsiębiorców',[0,3,-1,-1],0,0],['Nie angażuj się',[-1,-1,-1,0],-2,0]]],
['Afera mieszkaniowa','Media ujawniają niejasności wokół inwestycji mieszkaniowej.',[['Żądaj kontroli',[2,1,2,0],4,800],['Zaproponuj fundusz najmu',[4,0,2,-1],1,1900],['Zignoruj temat',[-2,0,-1,0],-3,0]]],
['Nauczyciele protestują','Szkoły domagają się większego wsparcia.',[['Program dla szkół',[1,0,3,2],3,1700],['Zwiększ autonomię placówek',[1,2,1,0],1,450],['Uchyl się od odpowiedzi',[-1,0,-2,0],-3,0]]],
['Kryzys energii','Zima zbliża się, a rachunki rosną.',[['Doraźne dopłaty',[0,0,3,3],1,1500],['Inwestycje w sieć',[3,2,0,0],3,1800],['Obniż podatki',[0,3,0,-1],0,900]]],
['Spór o lasy','Lokalne stowarzyszenia protestują przeciw wycince.',[['Ochrona obszarów',[3,0,1,0],2,800],['Wsparcie dla tartaków',[0,3,0,1],0,350],['Konsultacje',[1,1,1,1],4,1100]]],
['Przeciek ze sztabu','Poufna notatka trafia na pierwszą stronę gazety.',[['Opublikuj wyjaśnienie',[1,1,1,1],5,550],['Zwolnij doradcę',[0,0,1,1],1,850],['Oskarż przeciwników',[-1,0,-1,0],-5,0]]],
['Debata o zdrowiu','Pacjenci skarżą się na kolejki do lekarzy.',[['Zwiększ finansowanie',[0,1,3,4],2,1700],['Cyfrowa rejestracja',[3,1,1,0],2,1300],['Oddaj decyzje regionom',[0,2,1,1],3,550]]],
['Wypadek na budowie','Do mediów trafia sprawa bezpieczeństwa pracowników.',[['Inspekcja pracy',[0,3,2,0],3,700],['Pomoc rodzinom',[0,1,3,2],4,1100],['Nie komentuj',[-1,-2,-1,0],-3,0]]],
['Protest rolników','Rolnicy zapowiadają blokady dróg.',[['Dialog w regionie',[0,1,3,3],4,1000],['Pakiet ulg',[0,0,2,3],1,1900],['Poprzyj wolny rynek',[2,2,-1,-1],-1,0]]],
['Debata o emeryturach','Seniorzy żądają konkretów.',[['Waloryzacja świadczeń',[-1,0,1,4],1,1800],['Aktywizacja seniorów',[1,1,2,2],3,900],['Bez obietnic',[0,0,-1,-2],2,0]]],
['Rekordowe korki','Komunikacja nie nadąża za rozwojem miast.',[['Rozbudowa tramwajów',[2,1,2,0],2,1300],['Obwodnice',[0,3,1,1],1,1800],['Lokalny budżet',[1,1,1,1],3,700]]],
['Zagraniczna wizyta','Do kraju przyjeżdża ważna delegacja.',[['Rozmowy gospodarcze',[0,3,0,1],3,900],['Współpraca uczelni',[3,1,1,0],2,850],['Zostań w terenie',[1,0,2,1],1,500]]],
['Debata telewizyjna','Wielka debata transmitowana jest na cały kraj.',[['Szczegółowy plan',[1,2,2,1],5,1300],['Charyzmatyczne wystąpienie',[3,1,0,0],-1,650],['Pojednawczy ton',[1,1,1,2],3,400]]],
['Skandal finansowy rywala','Konkurencja musi tłumaczyć swoje wydatki.',[['Domagaj się audytu',[1,2,1,1],3,500],['Nie wykorzystuj afery',[0,0,1,1],5,0],['Ostra kampania negatywna',[2,1,-1,-1],-4,700]]],
['Kryzys zaopatrzenia','W sklepach brakuje ważnych produktów.',[['Pomoc samorządów',[1,0,3,2],2,1350],['Uwolnienie dostaw',[1,3,0,0],1,850],['Zwołaj ekspertów',[0,1,1,1],4,450]]],
['Kontrowersyjny billboard','Plakat Twojej partii wywołuje dyskusję.',[['Wycofaj billboard',[1,0,1,0],3,600],['Broń przekazu',[2,1,-1,0],-3,0],['Zamień na pozytywny',[1,1,2,1],2,950]]],
['Awaria szpitala','Główny szpital regionalny odwołuje operacje.',[['Zorganizuj pomoc',[0,0,2,4],4,1700],['Plan inwestycji',[1,1,2,2],2,1150],['Wskaż winnych',[-1,0,0,0],-4,0]]],
['Spotkanie studentów','Młodzi domagają się lepszego startu zawodowego.',[['Tanie mieszkania',[4,0,1,-1],2,1650],['Ulgi na firmy',[3,3,-1,-1],0,1200],['Stypendia',[3,0,2,0],2,1350]]],
['Powódź na północy','Niektóre miejscowości potrzebują pomocy.',[['Zbiórka wsparcia',[1,1,2,2],5,1000],['Wizyta sztabu',[1,0,2,2],2,550],['Głośne oskarżenia',[-1,0,-1,-1],-5,0]]],
['Starcie frakcji','Członkowie partii różnią się w sprawie podatków.',[['Wewnętrzna debata',[1,1,1,1],4,800],['Postaw na swoim',[2,1,-1,0],-2,0],['Nowy kompromis',[0,1,2,1],3,1100]]],
['Zamknięcie fabryki','Setki osób tracą zatrudnienie.',[['Pakiet przekwalifikowania',[2,3,1,0],3,1450],['Subsydia dla zakładu',[0,3,2,0],1,1900],['Przedsiębiorczość',[2,2,0,-1],0,550]]],
['Dane o inflacji','Urząd statystyczny publikuje nowe odczyty.',[['Plan antyinflacyjny',[0,2,2,1],4,850],['Podwyżki świadczeń',[0,-1,3,3],-1,1700],['Silny przekaz medialny',[2,1,0,0],-2,500]]],
['Niezależny kandydat','Popularny społecznik proponuje wspólne listy.',[['Przyjmij współpracę',[1,2,1,1],2,1250],['Odmów uprzejmie',[0,0,0,1],2,0],['Zaproponuj debatę',[2,0,1,0],3,650]]],
['Kryzys transportowy','Brakuje połączeń między mniejszymi miejscowościami.',[['Autobusy regionalne',[0,0,3,3],2,1550],['Dopłaty do kolei',[1,1,2,2],2,1800],['Daj decydować gminom',[0,2,1,1],3,400]]],
['Ochrona przyrody','Susza uderza w Jeziorny region.',[['Program retencji',[3,0,2,1],3,1600],['Wsparcie dla gospodarstw',[0,1,3,2],1,1400],['Spotkanie naukowe',[2,1,1,0],4,650]]],
['Pytanie o wolne media','Redakcje pytają o niezależność nadawców.',[['Gwarancje przejrzystości',[3,1,1,1],5,450],['Silniejszy regulator',[0,1,1,2],-1,400],['Unikaj tematu',[-2,0,-1,0],-4,0]]],
['Wielki sondaż','W ostatnich dniach pojawia się głośny sondaż.',[['Spotkania z niezdecydowanymi',[1,2,2,1],3,1500],['Mobilizuj młodych',[4,1,0,-1],1,1200],['Apel do wszystkich',[1,1,1,1],4,500]]],
['Ostatni wiec','Zakończenie kampanii przyciąga kamery.',[['Finał w stolicy',[3,2,0,0],0,2300],['Objazd prowincji',[0,1,3,3],2,2150],['Spokojny apel',[1,1,1,1],5,650]]]
];
const ACTIONS=[
['Prasa i plakaty',1400,[1,1,1,1],0,'Podstawowa ogólnokrajowa promocja.'],
['Debata obywatelska',700,[1,1,1,1],2,'Wiarygodność ponad rozgłos.'],
['Spoty telewizyjne',3500,[2,2,2,2],0,'Szeroki zasięg, wysokie koszty.'],
['Zbiórka sympatyków',-2600,[0,0,0,0],-1,'Uzupełniasz budżet.'],
['Wstrzymaj wydatki',0,[0,0,0,0],0,'Oszczędzasz środki na później.']
];
const STAFF_ROLES=[
{id:'field',name:'Koordynator terenowy',desc:'Kolejne wizyty w regionach dają większy efekt.'},
{id:'press',name:'Rzeczniczka kampanii',desc:'Odpowiedzi na wydarzenia zyskują dodatkowy zasięg.'},
{id:'finance',name:'Skarbniczka',desc:'Większe wpływy ze składek pomiędzy tygodniami.'},
{id:'polls',name:'Analityczka',desc:'Silniejsze efekty ogólnokrajowych działań promocyjnych.'}
];
const TACTICS=[
{name:'Przygotuj szczegółowy plan reform',cost:900,desc:'Konkrety zwiększają wiarygodność i pomagają części wyborców.',delta:[0,1,1,1],trust:3,diplomacy:0,local:0,budget:0},
{name:'Kuluarowe rozmowy z partiami',cost:600,desc:'Budujesz kontakty, które mogą przydać się po wyborach.',delta:[0,0,0,0],trust:1,diplomacy:2,local:0,budget:0},
{name:'Dodatkowy objazd wybranego regionu',cost:1450,desc:'Zwiększasz poparcie tam, gdzie wcześniej pracował sztab.',delta:[0,0,0,0],trust:0,diplomacy:0,local:1.7,budget:0},
{name:'Zbiórka w biurze komitetu',cost:0,desc:'Odbudowujesz budżet kosztem niewielkiego spadku zaufania.',delta:[0,0,0,0],trust:-1,diplomacy:0,local:0,budget:1800},
{name:'Opublikuj spokojne oświadczenie',cost:0,desc:'Nie ryzykujesz budżetem i poprawiasz relacje z wyborcami.',delta:[0,0,0,0],trust:1,diplomacy:0,local:0,budget:0}
];

const STORY_ARCS=[
 {id:'fundusz',week:2,title:'Tajemniczy fundusz wyborczy',intro:'Zamożny darczyńca oferuje pomoc w zamian za prywatne spotkania ze sztabem.',options:[
 ['Odmów i ujawnij propozycję',{trust:4,budget:0},'clean'],
 ['Przyjmij darowiznę bez rozgłosu',{trust:-3,budget:6500},'hidden'],
 ['Zażądaj jawnej umowy',{trust:2,budget:2500},'open']
 ],follow:13},
 {id:'fabryka',week:6,title:'Przyszłość starej fabryki',intro:'Zakład w Zagłębiu stoi przed zamknięciem. Pracownicy proszą o wsparcie.',options:[
 ['Poprzyj program dla pracowników',{trust:3,budget:-1400,national:.5},'workers'],
 ['Spotkaj się z właścicielami',{trust:-1,budget:1800},'owners'],
 ['Powołaj niezależnych mediatorów',{trust:2,budget:-500},'mediators']
 ],follow:17},
 {id:'redakcja',week:11,title:'Dziennikarz przychodzi z teczką',intro:'Reporter prosi o ochronę źródeł informacji w zamian za śledztwo w sprawie przetargów.',options:[
 ['Zapewnij niezależność śledztwa',{trust:4,budget:-500},'independent'],
 ['Wykorzystaj informacje w kampanii',{trust:-3,national:1.2},'use'],
 ['Odrzuć współpracę',{trust:0,budget:0},'decline']
 ],follow:22}
,
 {id:'samorzad',week:9,title:'Wojewodowie żądają porozumienia',intro:'Samorządy domagają się jasnego podziału środków i wpływu na decyzje państwa.',options:[
 ['Podpisz pakt regionalny',{trust:3,budget:-1100,org:5},'pact'],
 ['Zaproponuj reformę centralną',{trust:1,national:.9},'central'],
 ['Odłóż decyzję',{trust:-2,budget:0},'delay']
 ],follow:19},
 {id:'media',week:15,title:'Kto kontroluje pierwszą stronę?',intro:'Duży wydawca proponuje poparcie, ale oczekuje wyłączności na wywiady i materiały.',options:[
 ['Ujawnij ofertę',{trust:5,budget:0},'public'],
 ['Przyjmij medialne wsparcie',{trust:-3,national:1.3},'deal'],
 ['Odmów bez komentarza',{trust:1,budget:0},'silent']
 ],follow:26},
 {id:'wolontariusze',week:23,title:'Sztab pęka w szwach',intro:'Wolontariusze domagają się szkoleń i jasnych zasad. Konkurent próbuje przejąć koordynatorów.',options:[
 ['Zainwestuj w szkolenia',{trust:3,budget:-1800,org:6},'train'],
 ['Zaoferuj premie liderom',{trust:-1,budget:-3200,national:.8},'bonuses'],
 ['Zignoruj protest',{trust:-3,budget:0},'ignore']
 ],follow:28}
];
const CHARACTERS=[
 {id:'treasurer',name:'Helena Wolska',role:'Skarbniczka',loyalty:65},
 {id:'spokesperson',name:'Marek Bielski',role:'Rzecznik',loyalty:60},
 {id:'organizer',name:'Irena Brzoza',role:'Koordynatorka terenowa',loyalty:70},
 {id:'strategist',name:'Adam Lis',role:'Strateg',loyalty:58}
];
function ensureNarrative(){if(!S.arcs)S.arcs={};if(!S.people)S.people=CHARACTERS.map(x=>({...x,active:true}));if(!S.consequences)S.consequences=[];}
function storyForWeek(){
 ensureNarrative();
 const aftermath=STORY_ARCS.find(x=>x.follow===S.week&&S.arcs[x.id]);
 if(aftermath){
  const branch=S.arcs[aftermath.id],outcome={
   fundusz:{clean:['Kontrola finansowania kończy się pochwałą','Jawność wcześniejszej decyzji zwiększyła zaufanie.',{trust:5,national:.6}],hidden:['Audytorzy pytają o tajną wpłatę','Dziennikarze znaleźli ślad ukrytego finansowania.',{trust:-9,national:-1.1}],open:['Jawna umowa pod lupą','Dokumenty są dostępne, ale opozycja krytykuje kompromis.',{trust:1,national:.25}]},
   fabryka:{workers:['Pracownicy wracają do negocjacji','Związki zapamiętały Twoją obecność podczas kryzysu.',{trust:4,national:.8}],owners:['Fabryka zwalnia część załogi','Wcześniejsza rozmowa z właścicielami wywołuje pytania.',{trust:-5,national:-.6}],mediators:['Mediacja przynosi porozumienie','Niezależny zespół doprowadził do kompromisu.',{trust:4,national:.5}]},
   redakcja:{independent:['Redakcja publikuje śledztwo','Reporterzy doceniają szacunek do niezależności.',{trust:4,national:.4}],use:['Wyciek rozmów z reporterem','Próba upolitycznienia śledztwa wywołała skandal.',{trust:-8,national:-.9}],decline:['Reportaż ukazuje się bez komentarza','Sztab musi odpowiedzieć na trudne pytania.',{trust:-2,national:-.2}]},
   samorzad:{pact:['Regionalny pakt procentuje','Samorządowcy uruchomili sieć lokalnych spotkań.',{trust:4,national:.8}],central:['Włodarze krytykują centralę','Część lokalnych działaczy wycofuje wsparcie.',{trust:-3,national:-.4}],delay:['Samorządy czekają na konkrety','Brak decyzji ogranicza wiarygodność obietnic.',{trust:-4,national:-.2}]},
   media:{public:['Dziennikarze chwalą przejrzystość','Reakcja na próbę nacisku wzmacnia niezależny wizerunek.',{trust:5,national:.4}],deal:['Wyciekła umowa z wydawcą','Rywal przedstawia medialne wsparcie jako układ.',{trust:-8,national:-.8}],silent:['Cisza w redakcjach','Temat znika, ale nie zdobywasz nowych sympatyków.',{trust:1,national:0}]},
   wolontariusze:{train:['Wolontariusze ruszają w teren','Przygotowane struktury organizują udaną mobilizację.',{trust:4,national:1}],bonuses:['Liderzy zostali, szeregowi protestują','Nierówne premie wywołały spory w zespole.',{trust:-4,national:.1}],ignore:['Rozłam w sztabie terenowym','Część wolontariuszy przechodzi do konkurencji.',{trust:-7,national:-.9}]}
  }[aftermath.id][branch];
  return {title:outcome[0],body:outcome[1],options:[
   ['Przyjmij konsekwencje i przedstaw stanowisko',outcome[2]],
   ['Zwołaj otwarte spotkanie',{trust:2,budget:-750,national:.2}],
   ['Ogranicz komentarze',{trust:-1,budget:0}]
  ]};
 }
 const arc=STORY_ARCS.find(x=>x.week===S.week);
 if(arc)return {title:arc.title,body:arc.intro,options:arc.options.map(o=>[o[0],o[1]]),arc:arc.id};
 const crisis=S.people.find(p=>p.active&&p.loyalty<30);
 if(crisis&&S.week%5===3)return {title:'Bunt w sztabie: '+crisis.name,body:crisis.role+' kwestionuje kierunek kampanii i grozi odejściem.',person:crisis.id,options:[
 ['Wysłuchaj krytyki i zmień obowiązki',{trust:2,budget:-700}],
 ['Zaoferuj większe wynagrodzenie',{budget:-2200,trust:-1}],
 ['Pozwól odejść',{trust:-2,national:-.2}]
 ]};
 return null;
}
function applyNarrative(index,event){
 ensureNarrative();
 if(event.arc){const arc=STORY_ARCS.find(x=>x.id===event.arc);S.arcs[event.arc]=arc.options[index][2];}
 if(event.person){const p=S.people.find(x=>x.id===event.person);if(p){if(index===2){p.active=false;p.loyalty=0;}else p.loyalty=clamp(p.loyalty+(index===0?20:11),0,100);}}
 for(const p of S.people.filter(x=>x.active)){p.loyalty=clamp(p.loyalty+(index===0?1:index===2?-2:0),0,100);}
}
function characterCards(){
 ensureNarrative();return '<div class="groups"><h3 class="section-title">Ludzie sztabu</h3>'+
 S.people.map(p=>'<div class="group"><span>'+esc(p.name)+' · '+esc(p.role)+'</span><b>'+(p.active?p.loyalty+'/100':'ODSZEDŁ')+'</b></div>').join('')+'</div>';
}


// Granice województw na podstawie danych Geoportalu (2025), źródło: waszkiewiczja/GeoJSON-Polska-Wojewodztwa-Powiaty-Gminy (free to use). Współrzędne uproszczono dla SVG.
const ATLAS_SHAPES=["M175.6,227.3L169.9,224.2L162.7,224.0L154.1,231.9L151.2,228.7L147.9,228.9L148.9,225.4L137.4,222.8L139.1,224.6L136.8,225.1L136.5,227.4L131.2,228.3L129.0,231.5L130.3,232.5L128.4,238.2L121.6,239.3L122.1,241.9L115.5,246.5L109.0,241.2L103.5,241.1L102.7,245.0L100.4,244.8L99.7,249.2L92.4,245.5L86.1,247.7L78.7,252.3L82.6,256.8L82.9,260.1L78.7,273.1L70.3,284.9L80.9,285.2L81.7,278.7L78.9,277.1L79.9,275.7L84.1,274.9L88.6,277.0L90.7,275.1L91.7,277.8L94.4,276.5L96.6,277.8L96.8,283.7L102.0,287.3L102.4,291.3L106.1,289.2L121.6,294.0L128.0,292.8L130.6,298.2L138.1,297.6L139.9,301.2L137.8,302.2L140.0,303.3L144.6,298.9L149.5,301.4L152.1,298.4L158.5,299.1L164.4,304.5L159.5,309.8L156.6,309.5L149.9,314.4L154.7,318.7L159.5,317.9L160.8,321.3L163.6,321.6L170.3,327.9L171.1,332.3L175.3,335.8L180.1,336.5L185.5,330.6L190.6,328.4L195.2,327.0L197.3,328.6L197.3,324.0L193.4,322.2L191.3,317.3L188.4,315.8L194.1,310.7L199.3,312.3L200.0,307.4L203.7,302.6L210.6,301.9L210.1,297.8L211.5,297.1L209.3,295.6L213.9,293.6L211.2,291.7L212.1,290.8L216.8,290.5L215.5,286.4L219.5,283.9L216.9,283.1L217.9,281.4L221.2,282.4L221.4,278.6L227.8,277.0L226.5,272.5L230.2,271.0L228.0,266.1L231.6,263.8L235.2,265.7L242.5,263.7L239.6,260.3L240.7,255.3L237.2,251.9L240.2,249.5L228.6,249.0L226.1,242.7L229.6,241.0L229.6,238.6L223.7,234.6L211.6,233.4L209.0,234.4L208.4,238.5L194.3,240.0L184.5,237.0L183.9,233.6L175.8,232.3L178.1,229.1L175.6,227.3Z","M293.5,96.6L286.2,98.9L284.1,95.7L269.6,95.9L269.2,92.9L258.5,90.5L256.3,94.2L246.7,92.0L248.4,95.3L243.2,97.3L240.6,96.3L237.7,100.2L238.7,103.1L235.1,102.6L235.4,104.6L231.5,102.9L227.9,103.9L225.9,101.5L221.3,103.4L218.6,111.4L210.8,117.6L221.9,124.9L220.6,127.3L215.1,128.3L216.5,132.4L219.1,133.5L216.9,134.0L213.9,143.1L226.5,147.6L225.6,157.0L220.3,157.1L220.2,159.0L225.4,162.1L223.5,164.1L232.8,162.3L235.7,169.3L240.8,165.8L240.6,167.2L247.2,167.3L249.5,171.1L253.8,171.4L253.6,173.3L259.9,172.6L259.6,174.8L266.2,177.3L269.3,177.4L274.7,173.3L276.7,174.0L277.0,178.2L284.8,176.3L286.8,178.6L292.0,179.5L298.1,187.4L307.2,185.1L307.8,182.9L313.9,187.4L323.8,185.5L324.9,186.8L324.4,185.2L329.0,183.3L329.4,181.3L327.2,180.0L330.7,179.6L334.9,175.2L330.7,173.8L332.4,174.3L332.0,171.7L336.5,169.5L333.8,167.0L338.0,164.2L337.8,161.3L342.7,162.4L340.8,157.6L336.7,155.1L339.7,151.8L341.8,152.0L338.0,146.3L345.9,145.6L344.3,143.4L351.8,145.2L348.9,135.3L356.3,132.6L355.3,127.5L352.1,127.0L353.8,122.6L349.3,119.7L342.3,120.7L342.3,118.0L337.0,118.7L337.9,117.6L334.2,115.3L327.2,116.2L323.2,108.6L324.9,107.7L323.8,104.6L298.4,102.3L297.1,99.7L300.0,95.8L293.5,96.6Z","M575.4,326.5L583.4,321.1L585.8,317.4L601.4,315.7L603.6,313.6L607.3,300.7L605.2,298.0L605.7,295.1L602.6,294.8L603.0,292.1L599.1,290.2L601.0,287.3L607.2,287.4L610.0,285.5L599.8,279.7L596.8,276.0L596.5,271.5L593.3,269.8L593.6,265.9L586.5,262.0L584.5,257.6L581.1,256.9L580.5,254.4L584.3,248.3L581.4,246.7L582.5,244.2L576.4,240.7L574.9,232.7L576.1,229.8L574.2,227.7L580.8,223.0L578.5,220.8L580.6,216.7L579.1,215.1L583.6,210.1L581.4,204.6L578.3,201.8L575.5,202.3L571.9,199.3L572.7,197.6L555.7,194.5L555.4,191.0L551.1,190.4L545.5,195.1L547.8,198.2L542.4,198.1L539.8,200.5L541.9,201.9L537.5,202.8L538.0,205.4L531.4,205.0L526.3,201.7L523.3,203.5L524.3,206.4L521.9,208.3L514.5,205.0L505.8,209.8L503.1,207.1L500.5,209.3L487.6,208.2L478.9,211.5L478.1,213.4L480.7,217.2L476.9,220.2L481.6,220.4L483.1,223.3L476.3,226.7L480.2,229.4L471.3,235.5L465.5,232.3L463.6,235.2L468.2,238.3L475.6,238.9L478.5,244.7L476.5,248.5L472.0,249.6L477.4,252.9L473.3,256.8L477.5,258.1L474.7,259.4L473.3,264.5L475.8,273.3L475.0,280.8L478.6,291.2L483.0,291.7L488.9,288.4L495.3,290.0L494.7,291.7L497.5,293.0L494.0,298.5L510.1,304.5L515.9,304.3L516.4,309.0L519.2,309.6L515.4,311.1L519.8,311.4L516.5,313.4L511.6,312.4L512.4,314.3L509.3,316.7L515.2,320.3L525.6,319.5L521.0,322.5L544.8,324.1L554.3,316.8L558.2,319.3L564.4,315.8L568.9,320.0L567.4,322.6L573.8,323.5L573.2,325.8L575.4,326.5Z","M96.2,246.9L100.0,249.0L100.4,244.8L102.7,245.0L103.5,241.1L109.0,241.2L115.5,246.5L118.6,244.9L122.1,241.9L121.6,239.3L128.4,238.2L130.3,232.5L129.0,231.5L131.2,228.3L136.5,227.4L136.8,225.1L139.1,224.6L137.4,222.8L148.9,225.4L147.9,228.9L151.2,228.7L154.1,231.9L162.7,224.1L158.9,217.6L144.6,216.7L146.6,214.6L145.7,210.1L139.2,210.8L136.6,208.4L138.6,205.6L129.0,202.3L131.9,199.2L130.0,192.5L132.8,183.5L127.3,180.0L132.6,179.4L125.7,167.0L127.8,165.0L126.8,162.2L135.5,160.6L134.8,156.0L132.4,155.3L137.1,152.2L135.7,142.9L138.0,139.0L137.5,135.4L129.8,135.1L130.5,136.5L126.0,138.7L127.1,139.8L123.6,143.4L114.8,144.0L112.4,141.8L101.6,146.5L97.4,145.6L99.6,149.8L84.9,154.1L75.5,150.3L74.4,152.1L76.1,153.0L73.0,153.0L72.9,156.7L68.8,158.9L66.2,166.5L59.3,165.5L55.5,167.8L59.8,171.2L57.9,173.8L59.6,176.4L53.8,183.3L56.2,190.3L64.2,193.8L62.3,201.8L66.7,205.1L63.0,216.2L57.0,221.2L66.7,232.3L67.1,235.8L64.0,238.8L65.1,240.9L78.0,245.1L79.2,252.1L91.6,245.4L96.2,246.9Z","M363.0,190.3L349.7,192.6L338.5,186.2L330.9,186.3L328.0,183.3L324.4,185.2L324.9,186.8L323.8,185.5L314.9,187.4L314.0,191.3L318.0,191.8L316.3,194.3L317.4,195.8L307.8,196.5L307.1,200.7L309.3,201.6L307.9,204.3L296.0,205.6L295.7,211.7L298.8,214.4L294.2,221.5L281.7,219.6L281.7,221.6L278.0,223.5L278.3,229.3L275.4,230.9L276.4,233.2L274.6,234.5L276.5,244.5L273.2,248.4L266.7,246.1L265.5,250.5L258.7,253.1L260.7,259.1L264.2,258.3L263.8,265.2L281.2,268.4L282.7,270.4L286.1,267.0L287.8,271.0L292.6,272.8L306.0,272.4L307.8,269.9L315.5,274.8L324.2,277.4L327.0,276.0L326.4,274.0L330.9,273.4L330.7,275.1L337.2,278.8L339.5,284.1L345.6,282.6L352.4,286.9L360.9,281.6L360.2,278.6L363.0,273.2L372.1,278.3L373.3,272.6L369.0,271.6L369.3,267.4L371.6,265.4L369.7,264.1L383.5,263.0L385.2,259.1L391.6,260.6L392.7,258.2L391.2,255.7L395.1,254.1L395.9,249.0L401.0,245.5L400.2,242.4L396.3,242.8L397.2,239.0L392.7,232.3L397.1,229.8L406.0,232.5L408.2,228.0L403.8,226.4L402.4,221.7L405.9,221.6L403.0,217.1L398.9,217.0L395.5,213.4L388.5,215.5L388.0,213.9L384.1,214.0L387.1,211.8L381.6,207.9L385.7,204.4L384.7,201.8L375.4,199.4L373.7,197.0L374.7,194.0L372.5,192.4L364.5,189.0L363.0,190.3Z","M375.2,397.9L378.5,388.9L382.9,386.6L388.3,387.2L388.7,383.3L397.0,382.3L403.4,385.0L405.7,382.2L411.9,382.1L416.3,387.2L420.3,387.0L423.9,390.3L427.2,389.6L430.5,385.7L433.4,385.7L431.2,381.9L435.1,380.9L440.0,383.2L444.0,379.3L451.0,381.1L450.5,377.7L452.1,376.9L448.8,373.8L449.9,372.0L446.9,370.4L449.0,367.8L448.0,364.0L445.9,360.1L442.0,358.3L448.2,355.7L441.0,353.1L444.4,348.4L438.4,348.1L436.7,344.9L439.1,341.3L436.3,340.0L438.4,338.2L437.2,337.3L439.5,336.9L436.6,334.8L438.1,333.8L436.2,327.4L438.5,327.3L436.5,326.2L440.8,322.5L440.0,319.6L438.2,321.2L435.6,319.6L431.5,322.1L421.8,322.8L418.5,325.0L415.8,323.9L409.1,329.8L394.1,330.5L391.8,328.8L393.1,327.1L389.4,325.4L391.0,324.5L390.0,322.9L387.0,321.8L389.6,319.1L385.4,314.5L385.9,311.9L368.4,308.5L368.4,311.6L364.3,311.6L361.6,314.2L352.8,313.3L349.6,315.8L342.2,315.4L340.7,318.8L338.6,318.8L340.2,321.7L336.3,321.1L334.3,325.0L331.0,326.0L337.7,328.2L331.7,330.6L333.4,331.3L332.5,333.2L326.7,334.6L325.6,338.8L321.1,339.7L318.7,343.6L319.4,345.5L317.0,346.6L322.9,346.6L322.1,353.1L327.9,352.6L330.6,358.1L337.2,359.2L337.9,361.0L333.9,363.8L339.9,366.0L339.3,370.3L342.9,371.8L345.9,379.7L349.3,379.5L348.9,382.6L353.8,384.3L358.0,382.7L358.1,389.9L359.8,391.6L356.4,396.3L362.2,397.0L366.2,394.3L375.2,397.9Z","M405.5,125.9L400.5,127.9L396.6,126.3L389.0,132.0L390.6,132.9L378.4,133.3L376.1,131.5L368.8,133.1L363.9,128.5L360.0,131.2L360.8,133.3L357.2,132.4L348.9,135.3L351.8,145.2L344.3,143.4L345.9,145.6L338.0,146.3L341.8,152.0L339.7,151.8L336.7,155.1L340.8,157.6L342.7,162.4L337.8,161.3L338.0,164.2L333.8,167.0L336.8,168.7L332.0,171.7L332.4,174.3L330.7,173.8L334.7,175.5L330.7,179.6L327.2,180.0L329.4,181.3L329.0,184.7L333.0,186.8L338.5,186.2L349.7,192.6L366.4,189.6L374.7,194.0L373.7,197.0L375.4,199.4L385.7,202.9L381.6,207.9L387.1,211.8L384.1,214.0L388.0,213.9L388.5,215.5L395.5,213.4L398.9,217.0L403.0,217.1L405.9,221.6L402.4,221.7L403.8,226.4L407.1,227.1L408.2,229.7L406.0,232.5L397.1,229.8L392.7,232.3L397.2,239.0L396.3,242.8L400.2,242.4L401.0,245.5L395.9,249.0L394.6,252.8L399.4,254.3L398.7,256.5L401.7,261.0L405.2,259.9L410.6,263.3L409.8,266.3L411.7,264.9L417.1,266.7L417.6,264.5L421.0,266.1L423.4,263.4L427.9,266.8L431.2,265.9L432.0,262.3L434.9,263.8L433.2,266.1L437.5,267.9L436.8,271.1L448.4,270.7L450.1,273.7L454.8,275.6L457.7,272.7L464.4,272.2L463.4,271.4L473.0,273.7L474.4,271.6L473.6,263.0L474.7,259.4L477.5,258.1L473.3,256.8L477.4,252.9L472.0,249.3L476.5,248.5L478.5,244.7L475.6,238.9L468.2,238.3L463.6,235.2L465.5,232.3L471.3,235.5L480.2,229.4L476.3,226.7L483.1,223.3L481.6,220.4L476.9,220.2L480.7,217.2L478.1,213.4L478.9,211.5L487.6,208.2L500.5,209.3L503.1,207.1L505.8,209.8L514.5,205.0L521.9,208.3L524.3,206.4L523.3,203.5L526.3,201.7L531.4,205.0L538.0,205.4L537.5,202.8L541.9,201.9L539.8,200.5L542.4,198.1L547.8,198.2L545.5,195.1L551.1,190.4L546.7,190.5L546.5,188.1L541.2,185.0L528.1,185.1L526.7,183.4L518.7,182.7L517.9,178.6L515.5,177.4L516.3,174.8L509.5,168.8L513.2,166.4L511.0,163.1L512.1,156.9L507.8,156.5L505.2,160.1L503.4,159.6L500.3,154.3L503.5,153.5L502.0,150.4L497.8,150.6L498.0,152.5L488.0,152.7L485.4,148.1L487.5,146.9L485.9,144.6L478.8,141.7L479.9,139.7L482.4,140.2L482.2,137.7L478.5,138.8L474.8,135.1L470.6,135.5L468.2,133.5L467.8,128.4L464.2,125.0L466.1,125.3L466.1,121.6L470.5,121.9L465.7,120.6L467.5,118.1L463.1,113.6L463.4,110.6L453.1,111.8L453.2,113.6L448.3,115.1L442.4,114.7L431.0,120.4L424.3,118.7L422.7,119.8L423.7,121.4L419.1,123.2L413.1,121.5L408.1,125.9L405.5,125.9Z","M240.3,339.2L246.7,345.1L257.0,342.7L254.6,339.7L258.5,336.0L257.7,331.7L268.8,330.4L268.0,329.0L274.9,326.2L279.0,326.6L277.1,324.9L277.8,321.6L275.0,319.5L277.1,317.1L275.5,314.9L276.3,311.3L282.2,312.7L279.6,306.9L286.7,307.2L290.0,305.2L288.3,302.3L284.3,301.5L282.4,295.9L287.9,293.0L283.5,289.7L290.0,286.2L292.2,282.1L289.8,279.4L294.6,275.4L293.3,272.6L287.8,271.0L286.4,267.2L284.5,267.1L282.7,270.4L281.2,268.4L263.7,264.8L247.7,269.5L243.5,267.6L244.9,263.6L235.2,265.7L231.6,263.8L228.0,266.1L230.2,271.0L226.5,272.5L227.8,277.0L221.4,278.6L221.2,282.4L217.9,281.4L216.9,283.1L219.5,283.9L215.5,286.4L216.8,290.5L211.2,291.7L213.9,293.6L209.3,295.6L211.5,297.1L210.1,297.8L210.6,301.9L203.7,302.6L200.0,307.4L199.3,312.3L194.1,310.7L191.1,313.2L208.3,317.5L212.3,321.8L216.7,321.3L216.9,325.7L232.2,325.4L237.7,321.7L240.0,323.4L238.4,326.1L240.7,327.5L240.4,329.5L230.8,332.6L240.3,339.2Z","M517.3,319.5L514.9,320.2L509.3,316.7L512.4,314.3L511.6,312.4L516.5,313.4L519.8,311.4L515.4,311.1L519.2,309.6L516.4,309.0L515.9,304.3L510.1,304.5L494.0,298.5L497.5,293.0L494.7,291.7L495.3,290.0L488.9,288.4L483.0,291.7L478.0,289.6L473.1,300.2L469.8,300.1L462.9,308.4L454.2,310.3L453.6,312.8L446.0,315.1L440.0,319.6L440.8,322.5L436.5,326.2L438.5,327.3L436.2,327.4L438.1,333.8L436.6,334.8L439.5,336.9L437.2,337.3L438.4,338.2L436.3,340.0L439.1,341.3L436.7,344.9L438.4,348.1L444.4,348.4L441.0,353.1L448.2,355.7L442.0,358.3L445.9,360.1L448.0,364.0L449.0,367.8L446.9,370.4L449.9,372.0L448.7,373.6L452.1,376.9L450.5,377.7L452.2,382.1L464.5,380.2L473.0,386.3L476.6,384.0L483.9,387.1L489.4,396.0L498.7,397.8L498.8,399.9L507.0,400.3L510.3,403.5L520.5,403.9L525.4,407.5L530.6,406.7L536.4,409.9L536.0,405.1L537.5,403.8L528.6,399.5L529.1,397.8L526.8,398.4L529.1,395.7L527.2,395.0L529.1,386.1L526.2,377.0L522.9,374.7L559.9,336.6L575.4,326.5L573.2,325.8L573.8,323.5L567.4,322.6L568.9,320.0L564.4,315.8L558.2,319.3L554.3,316.8L544.8,324.1L526.8,323.8L521.0,322.5L525.6,319.5L517.3,319.5Z","M565.8,60.7L557.2,58.5L551.8,54.8L546.1,54.8L547.4,53.1L543.4,51.7L544.3,50.3L534.2,48.7L530.9,56.3L523.1,56.7L513.8,62.0L517.5,66.7L520.1,65.8L522.6,68.7L520.6,72.4L524.7,74.0L526.1,77.7L531.1,81.3L530.9,84.9L527.9,87.1L526.2,91.8L513.2,96.0L513.2,98.4L510.3,97.2L487.6,109.5L482.1,108.6L477.6,112.1L467.7,109.8L462.6,110.7L464.2,115.5L467.5,118.1L465.7,120.6L470.5,121.9L466.1,121.6L466.1,125.3L464.2,125.0L467.8,128.4L468.2,133.5L470.6,135.5L474.8,135.1L478.5,138.8L482.2,137.7L482.4,140.2L479.9,139.7L478.8,141.7L485.9,144.6L487.5,146.9L485.4,148.1L488.0,152.7L498.0,152.5L497.8,150.6L502.0,150.4L503.5,153.5L500.3,154.3L503.4,159.6L505.2,160.1L507.8,156.5L512.1,156.9L511.0,163.1L513.2,166.4L509.5,168.8L516.3,174.8L515.4,176.8L517.9,178.6L517.4,181.5L528.1,185.1L541.2,185.0L546.5,188.1L547.1,190.7L554.0,190.7L570.7,172.9L587.5,168.5L598.0,161.9L596.7,146.8L598.5,145.5L594.2,137.3L596.8,132.3L591.1,126.4L581.9,107.9L571.7,76.5L574.3,71.5L571.8,65.7L565.8,60.7Z","M319.7,103.4L324.5,99.7L324.5,96.5L329.1,93.2L330.9,88.3L340.0,90.8L340.0,88.2L345.9,80.8L344.2,79.4L333.8,80.2L334.1,76.9L336.0,75.9L328.4,75.0L328.1,72.4L325.0,71.3L327.0,70.2L324.8,68.2L326.5,64.7L331.1,62.5L327.2,57.1L349.0,49.7L349.1,45.2L332.3,51.2L296.8,30.3L271.7,20.0L252.5,20.3L216.8,25.8L199.0,31.2L190.6,36.2L179.0,37.8L182.8,43.4L186.5,44.8L188.3,50.3L185.4,51.1L188.7,58.5L179.8,61.6L185.2,68.1L184.3,77.2L187.3,76.0L189.3,77.8L188.5,79.2L195.4,82.3L195.1,83.9L189.1,84.7L189.1,87.3L193.5,88.9L188.2,92.8L190.5,101.2L193.7,106.4L196.6,106.0L196.5,108.1L211.8,106.9L219.1,109.9L222.0,102.7L225.9,101.5L227.9,103.9L231.5,102.9L235.4,104.6L235.1,102.6L238.7,103.1L237.7,100.2L240.6,96.3L243.2,97.3L248.4,95.3L246.7,92.0L256.3,94.2L258.5,90.5L269.2,92.9L269.6,95.9L284.1,95.7L286.2,98.9L299.6,95.7L297.1,99.7L298.4,102.3L307.0,104.1L319.7,103.4Z","M339.3,369.1L338.8,364.9L333.9,363.8L337.9,361.0L336.5,358.5L330.6,358.1L327.9,352.6L322.1,353.1L322.9,346.6L317.0,346.6L319.4,345.5L318.7,343.6L321.1,339.7L325.6,338.8L326.7,334.6L332.5,333.2L333.4,331.3L331.7,330.6L337.7,328.2L331.0,326.0L334.3,325.0L336.3,321.1L340.2,321.7L338.6,318.8L340.7,318.8L342.2,315.4L349.6,315.8L352.8,313.3L361.6,314.2L364.3,311.6L368.4,311.6L364.4,307.2L357.9,306.2L365.5,300.9L360.6,299.7L362.7,297.0L353.5,294.5L353.1,292.4L355.1,292.8L358.3,290.9L357.6,288.6L360.4,288.5L355.5,285.4L351.0,286.6L345.6,282.6L339.5,284.1L337.2,278.8L330.7,275.1L330.9,273.4L326.4,274.0L327.0,276.0L324.2,277.4L315.5,274.8L307.8,269.9L306.0,272.4L293.3,272.6L294.6,275.4L289.8,279.4L292.2,282.1L290.0,286.2L283.5,289.7L287.9,293.0L282.4,295.9L284.3,301.5L288.3,302.3L290.0,305.2L286.7,307.2L279.6,306.9L282.2,312.7L276.3,311.3L275.5,314.9L277.1,317.1L275.0,319.5L277.8,321.6L277.1,324.9L279.0,326.6L269.0,328.4L268.8,330.4L257.9,331.5L258.5,336.0L256.3,338.9L261.1,343.7L266.3,343.4L273.0,348.9L273.9,346.9L285.0,350.0L287.5,348.5L287.1,351.3L289.4,352.5L287.3,354.9L290.5,361.8L300.9,364.8L304.1,373.3L302.8,375.1L310.6,376.4L311.1,383.7L323.1,382.7L327.3,374.6L333.2,374.3L333.7,372.2L339.3,369.1Z","M440.0,319.6L446.0,315.1L453.6,312.8L454.2,310.3L462.9,308.4L466.7,302.8L471.3,299.5L473.1,300.2L475.6,296.9L478.3,288.9L475.0,280.8L474.4,271.6L471.5,273.9L467.1,271.2L463.4,271.4L464.4,272.2L457.7,272.7L454.8,275.6L450.1,273.7L448.4,270.7L436.8,271.1L437.5,267.9L433.2,266.1L434.9,263.8L432.0,262.3L431.2,265.9L427.9,266.8L423.4,263.4L421.0,266.1L417.6,264.5L417.1,266.7L411.7,264.9L409.8,266.3L410.6,263.3L405.2,259.9L401.7,261.0L398.7,256.5L399.4,254.3L395.1,253.6L391.2,255.7L392.7,258.2L391.6,260.6L385.2,259.1L383.5,263.0L369.7,264.1L371.6,265.4L369.3,267.4L369.0,271.6L373.3,272.6L372.1,278.3L363.0,273.2L360.2,278.6L360.9,281.6L355.5,285.4L360.4,288.5L357.6,288.6L358.3,290.9L355.1,292.8L353.1,292.4L353.5,294.5L359.1,294.8L362.7,297.0L360.6,299.7L365.6,300.5L357.9,306.2L364.4,307.2L366.2,309.6L369.4,308.5L385.9,311.9L385.4,314.5L389.6,319.1L387.0,321.8L390.0,322.9L391.0,324.5L389.4,325.4L393.1,327.1L391.8,328.8L394.1,330.5L409.1,329.8L415.8,323.9L418.5,325.0L421.8,322.8L431.5,322.1L435.6,319.6L438.2,321.2L440.0,319.6Z","M463.4,110.6L477.6,112.1L482.1,108.6L487.6,109.5L510.3,97.2L513.2,98.4L513.2,96.0L526.2,91.8L527.9,87.1L530.9,84.9L531.1,81.3L526.1,77.7L524.7,74.0L520.6,72.4L522.6,68.7L520.1,65.8L517.5,66.7L513.8,62.0L523.1,56.7L530.9,56.3L532.5,52.5L453.8,54.6L349.8,45.6L349.0,49.7L327.2,57.1L331.1,62.5L326.5,64.7L324.8,68.2L327.0,70.2L325.0,71.3L328.1,72.4L328.4,75.0L336.0,75.9L334.1,76.9L333.8,80.2L344.2,79.4L345.9,80.8L340.0,88.2L340.0,90.8L330.9,88.3L329.1,93.2L324.5,96.5L324.5,99.7L319.7,103.4L323.8,104.6L324.9,107.7L323.2,108.6L327.2,116.2L333.6,115.2L337.9,117.6L337.3,118.8L342.3,118.0L342.3,120.7L352.2,120.3L354.4,124.4L352.1,127.0L355.3,127.5L356.3,132.6L360.8,133.3L360.0,131.2L363.9,128.5L368.8,133.1L376.1,131.5L378.4,133.3L390.6,132.9L389.0,132.0L396.6,126.3L402.2,127.7L408.1,125.9L413.1,121.5L419.1,123.2L423.7,121.4L422.7,119.8L424.3,118.7L431.0,120.4L442.4,114.7L448.3,115.1L453.2,113.6L453.1,111.8L463.4,110.6Z","M284.8,176.3L277.0,178.2L276.7,174.0L274.7,173.3L269.3,177.4L266.2,177.3L259.6,174.8L259.9,172.6L253.6,173.3L253.8,171.4L249.5,171.1L247.2,167.3L240.6,167.2L240.8,165.8L235.7,169.3L232.8,162.3L223.5,164.1L225.4,162.1L220.2,159.0L220.3,157.1L225.6,157.0L226.5,147.6L213.9,143.1L216.9,134.0L219.1,133.5L216.5,132.4L215.1,128.3L220.6,127.3L221.9,124.9L210.8,117.6L219.1,109.9L211.8,106.9L196.5,108.1L196.6,106.0L193.7,106.4L190.2,98.9L182.5,101.0L180.4,107.9L176.3,110.2L164.9,110.1L163.8,112.0L165.4,112.2L166.1,116.8L179.9,122.6L176.3,124.0L174.8,128.8L171.0,127.2L167.5,131.8L161.7,131.8L156.9,140.3L145.8,142.0L136.0,140.1L137.1,152.2L132.4,155.3L134.8,156.0L135.5,160.6L126.8,162.2L127.8,165.0L125.7,167.0L132.6,179.4L127.3,180.0L132.8,183.5L130.0,192.5L131.9,199.2L129.0,202.3L138.6,205.6L136.6,208.4L139.2,210.8L145.7,210.1L146.6,214.6L144.6,216.7L158.9,217.6L161.8,220.4L161.4,223.9L169.9,224.2L176.1,226.7L178.1,229.5L175.8,232.3L183.9,233.6L184.5,237.0L194.3,240.0L208.4,238.5L209.0,234.4L211.6,233.4L225.4,235.3L229.6,238.6L229.6,241.0L226.1,242.7L227.8,248.3L239.8,248.7L237.2,251.9L240.7,255.3L239.6,260.3L241.3,263.1L245.6,264.2L243.9,268.4L247.7,269.5L264.1,264.6L264.2,258.3L260.7,259.1L258.7,253.1L265.5,250.5L266.7,246.1L273.2,248.4L276.5,244.5L276.2,236.3L274.5,236.2L276.4,232.8L274.9,232.3L278.2,229.6L277.8,226.3L279.4,225.3L278.0,223.5L280.1,223.1L279.8,221.3L283.7,219.3L294.2,221.5L298.8,214.4L295.7,211.7L296.2,205.3L307.9,204.3L309.3,201.6L307.1,200.7L307.8,196.5L317.4,195.8L316.3,194.3L318.0,191.8L314.0,191.3L314.9,187.4L310.5,185.8L310.8,184.5L307.8,182.9L307.2,185.1L298.1,187.4L292.0,179.5L286.8,178.6L284.8,176.3Z","M179.0,37.8L168.8,39.8L154.4,52.0L143.7,57.7L97.2,66.0L64.9,74.3L46.1,81.3L39.1,80.1L34.0,81.8L39.3,91.1L38.3,96.0L41.2,101.4L40.4,105.8L48.9,125.4L44.7,129.3L45.3,133.2L42.8,139.3L31.2,145.3L32.2,150.2L30.4,154.2L35.4,155.0L55.0,167.7L59.3,165.5L64.6,167.3L68.7,163.0L68.8,158.9L72.9,156.7L73.0,153.0L76.1,153.0L74.4,152.1L75.5,150.3L84.9,154.1L99.6,149.8L97.4,145.6L101.6,146.5L112.4,141.8L114.8,144.0L123.6,143.4L127.1,139.8L126.0,138.7L131.4,134.7L137.5,135.4L138.0,139.0L136.4,140.0L143.4,141.8L156.9,140.3L161.7,131.8L167.5,131.8L171.0,127.2L174.8,128.8L176.3,124.0L179.9,122.6L166.1,116.8L165.4,112.2L163.8,112.0L164.9,110.1L176.3,110.2L180.4,107.9L182.5,101.0L190.2,98.9L188.2,92.8L193.5,88.9L189.1,87.3L189.1,84.7L195.1,83.9L195.4,82.3L188.5,79.2L189.3,77.8L187.3,76.0L184.3,77.2L185.2,68.1L179.8,61.6L188.7,58.5L185.4,51.1L188.3,50.3L186.5,44.8L182.8,43.4L179.0,37.8Z"];
const ATLAS_CENTERS=[[162,270],[283,138],[538,262],[101,196],[336,236],[386,353],[434,186],[249,300],[496,346],[540,125],[257,64],[312,321],[415,292],[418,85],[211,187],[112,104]];
const ATLAS_SHORT=["Dolnośl.","Kuj.-pom.","Lubelskie","Lubuskie","Łódzkie","Małopol.","Mazowieckie","Opolskie","Podkarp.","Podlaskie","Pomorskie","Śląskie","Świętokrz.","Warm.-maz.","Wielkopol.","Zach.-pom."];
let atlasSelected=0,staffMode=false;
function renderAtlas(){
 const svg=$('electionAtlas');if(!svg||!S)return;
 const canChoose=S.phase===1&&!S.done;
 svg.innerHTML=ATLAS_SHAPES.map((shape,i)=>{
  const p=pollRegion(i)[0],pos=ATLAS_CENTERS[i],selected=atlasSelected===i;
  return '<g role="button" tabindex="0" aria-label="'+esc(REGIONS[i].name)+', '+p.toFixed(1)+' procent poparcia" data-atlas-region="'+i+'">'+
  '<path class="territory '+(selected?'active':'')+'" d="'+shape+'"></path>'+
  '<text class="region-label" x="'+pos[0]+'" y="'+pos[1]+'">'+esc(ATLAS_SHORT[i])+'</text>'+
  '<text class="region-pct" x="'+pos[0]+'" y="'+(pos[1]+17)+'">'+p.toFixed(1)+'%</text></g>';
 }).join('');
 const r=REGIONS[atlasSelected],votes=pollRegion(atlasSelected);
 const seatsEstimate=Math.max(1,Math.round(180*r.population/REGIONS.reduce((n,v)=>n+v.population,0)));
 $('atlasDetail').innerHTML='<strong>'+esc(r.name)+'</strong> · '+votes[0].toFixed(1)+'% Twojego poparcia · ok. '+seatsEstimate+' mandatów'+
 (canChoose?' <button class="btn alt" data-atlas-visit="'+atlasSelected+'" '+(S.money<700?'disabled':'')+'>Wyślij sztab (700 zł)</button>':' · Wybierz region na mapie');
}
function renderStaffDesk(){
 const target=$('staffDesk');if(!target||!S)return;ensureNarrative();
 target.innerHTML='<h3 class="section-title">Twój sztab · '+S.staff.length+'/3 specjalistów</h3><p class="small">Tutaj zatrudniasz i zwalniasz specjalistów. Zatrudnienie kosztuje jednorazowo 3200 zł; utrzymanie każdego: 170 zł tygodniowo. Nie zużywa decyzji kampanii.</p>'+
 STAFF_ROLES.map(p=>{const hired=S.staff.includes(p.id),disabled=!hired&&(S.staff.length>=3||S.money<3200);return '<div class="staff-person"><strong>'+esc(p.name)+'</strong><small>'+esc(p.desc)+(hired?' · poziom '+((S.staffLevels||{})[p.id]||1)+'/3':'')+'</small><div class="staff-controls"><button data-staff-roster="'+p.id+'" '+(disabled?'disabled':'')+'>'+(hired?'Zwolnij — bez zwrotu kosztów':'Zatrudnij — 3200 zł')+'</button>'+(hired?'<button data-staff-train="'+p.id+'" '+(S.money<2100||((S.staffLevels||{})[p.id]||1)>=3?'disabled':'')+'>Szkolenie — 2100 zł</button>':'')+'</div></div>'}).join('')+
 '<h3 class="section-title">Kierownictwo i relacje</h3><p class="small">Lojalność wpływa na działanie kampanii. Rozmowa kosztuje 400 zł i może odbyć się raz na 4 tygodnie.</p>'+
 S.people.map(p=>{const last=(S.staffTalks||{})[p.id],cooldown=Number.isInteger(last)&&S.week-last<4;return '<div class="staff-person"><strong>'+esc(p.name)+'</strong><small>'+esc(p.role)+' · '+(p.active?'lojalność '+p.loyalty+'/100':'odszedł/odeszła')+'</small><div class="loyalty-track"><div class="loyalty-fill" style="width:'+p.loyalty+'%"></div></div>'+(p.active?'<div class="staff-controls"><button data-staff-talk="'+p.id+'" '+(cooldown||S.money<400?'disabled':'')+'>Rozmowa −400 zł</button><button data-staff-bonus="'+p.id+'" '+(cooldown||S.money<1800?'disabled':'')+'>Premia −1800 zł</button></div>':'')+'</div>'}).join('');
}
function manageStaff(id){
 if(!S)return;
 const person=STAFF_ROLES.find(p=>p.id===id);if(!person)return;
 if(S.staff.includes(id)){S.staff=S.staff.filter(x=>x!==id);if(S.staffLevels)delete S.staffLevels[id];log('Rozwiązano współpracę: '+person.name+'.');}
 else {if(S.staff.length>=3||S.money<3200)return;S.money-=3200;S.staff.push(id);log('Zatrudniono: '+person.name+'.');}
 render();
}
function trainStaff(id){if(!S||!S.staff.includes(id)||S.money<2100)return;S.staffLevels=S.staffLevels||{};let lvl=S.staffLevels[id]||1;if(lvl>=3)return;S.money-=2100;S.staffLevels[id]=lvl+1;log('Specjalista kończy szkolenie: '+STAFF_ROLES.find(p=>p.id===id).name+' (poziom '+(lvl+1)+').');render();}
function staffConversation(id,bonus){
 if(!S||S.done&&S.week===29)return;ensureNarrative();
 const p=S.people.find(p=>p.id===id&&p.active);if(!p)return;
 if(!S.staffTalks)S.staffTalks={};
 const last=S.staffTalks[id];if(Number.isInteger(last)&&S.week-last<4)return;
 const cost=bonus?1800:400;if(S.money<cost)return;
 S.money-=cost;S.staffTalks[id]=S.week;p.loyalty=clamp(p.loyalty+(bonus?18:9),0,100);
 if(!bonus)S.trust=clamp(S.trust+1,0,100);
 log('Rozmowa ze sztabem: '+p.name+(bonus?' otrzymuje premię.': ' pozostaje w zespole.'));
 render();
}
document.addEventListener('click',e=>{
 const g=e.target.closest('[data-atlas-region]');
 if(g&&S){atlasSelected=Number(g.dataset.atlasRegion);renderAtlas();return;}
 const visit=e.target.closest('[data-atlas-visit]');
 if(visit&&S&&S.phase===1&&!S.done&&S.money>=700){decide('region',Number(visit.dataset.atlasVisit));window.openGameTab?.('campaign');return;}
 const train=e.target.closest('[data-staff-train]');if(train&&S){trainStaff(train.dataset.staffTrain);return;}
 const roster=e.target.closest('[data-staff-roster]');if(roster&&S){manageStaff(roster.dataset.staffRoster);return;}
 const talk=e.target.closest('[data-staff-talk]');
 if(talk&&S){staffConversation(talk.dataset.staffTalk,false);return;}
 const bonus=e.target.closest('[data-staff-bonus]');
 if(bonus&&S){staffConversation(bonus.dataset.staffBonus,true);return;}
});
document.addEventListener('keydown',e=>{
 const node=e.target.closest('[data-atlas-region]');
 if(node&&(e.key==='Enter'||e.key===' ')){e.preventDefault();atlasSelected=Number(node.dataset.atlasRegion);renderAtlas();}
});


const BROADCASTS={
4:{kind:'debata',title:'Debata telewizyjna na żywo',host:'Prowadząca telewizyjnego studia',rounds:[
{q:'Jak sfinansujesz swój program?',a:[['Przedstawię źródła i koszty',3,1,0],['To rywale powinni się tłumaczyć',-3,3,4],['Powiem o kierunku zmian',0,2,1]]},
{q:'Co zrobisz po politycznej porażce?',a:[['Uszanuję wynik wyborców',3,0,-2],['Zawalczę ze wszystkich sił',0,3,2],['Oskarżę komisję',-6,1,7]]},
{q:'Czy podejmiesz współpracę z rywalami?',a:[['Jeśli służy mieszkańcom',3,1,-1],['Tylko na moich warunkach',-1,3,2],['Nigdy',-3,2,3]]}
]},
10:{kind:'wywiad',title:'Wywiad dla Dziennika Nowin',host:'Redaktor naczelna',rounds:[
{q:'Dziennikarka pyta o wydatki Twojego sztabu.',a:[['Opublikuję zestawienie rachunków',4,0,-2],['To zwykła działalność polityczna',-1,1,3],['Uniknę szczegółów',-3,0,4]]},
{q:'Reporter przytacza krytykę Twoich działaczy.',a:[['Odpowiem na konkretne zarzuty',3,1,-1],['Oskarżę reportera o stronniczość',-4,2,5],['Poproszę o spotkanie po wywiadzie',1,1,0]]},
{q:'Co obiecujesz niezdecydowanym?',a:[['Realistyczny plan na rok',3,1,-1],['Szybkie i wielkie zmiany',-2,4,3],['Dialog społeczny',2,1,-1]]}
]},
18:{kind:'kryzys',title:'Kryzys prasowy w sztabie',host:'Zespół prasowy',rounds:[
{q:'Media publikują anonimową skargę.',a:[['Sprawdzę fakty przed komentarzem',3,0,-2],['Odrzucę oskarżenia bez sprawdzenia',-4,2,5],['Upublicznię dane informatora',-8,2,8]]},
{q:'Rzecznik proponuje oświadczenie.',a:[['Jawne fakty i plan wyjaśnienia',4,0,-2],['Kontratak na konkurencję',-3,3,5],['Milczenie do końca tygodnia',-2,0,3]]},
{q:'Pojawia się sprostowanie w prasie.',a:[['Przyjmę je i podziękuję',3,1,-2],['Zażądam przeprosin od wszystkich',-1,2,2],['Rozpocznę dalszy spór',-3,3,4]]}
]},
25:{kind:'debata',title:'Ostatnia debata przed wyborami',host:'Komisja debat publicznych',rounds:[
{q:'Jak oceniasz swoją kampanię?',a:[['Wskażę konkretne rezultaty',3,1,0],['Ogłoszę nieuchronne zwycięstwo',-2,4,4],['Podziękuję wolontariuszom',2,1,-1]]},
{q:'Rywale proponują przedwyborczy pakt.',a:[['Rozpatrzę jawne warunki',3,1,-2],['Odrzucę rozmowy',-2,2,3],['Zażądam wszystkich stanowisk',-3,3,4]]},
{q:'Ostatnie pytanie dotyczy wiarygodności.',a:[['Odpowiem zwięźle i rzeczowo',4,1,-2],['Wygłoszę ogólny manifest',-1,3,2],['Przerwę rozmowę',-6,0,6]]}
]}};
function broadcastForWeek(){return BROADCASTS[S.week]||null}
function startBroadcast(){const event=broadcastForWeek();S.broadcast={week:S.week,round:0,score:0,attention:0,pressure:0,history:[]};S.phase=4;}
function renderBroadcast(){
 if(S.phase!==4)return;
 const b=S.broadcast,spec=broadcastForWeek();if(!b||!spec)return;
 const question=spec.rounds[b.round];$('phase').textContent='WYDANIE NA ŻYWO · '+(b.round+1)+' / '+spec.rounds.length;
 $('eventTitle').textContent=spec.title;
 $('eventText').textContent=spec.host+': „'+question.q+'”';
 $('choices').innerHTML='<div class="frame"><b>Transmisja na żywo</b><p class="small">Każda odpowiedź wpływa na zaufanie, zainteresowanie mediów oraz napięcie. Wybierz, co powiesz.</p>'+
 question.a.map((answer,i)=>'<button class="option" data-kind="broadcast" data-i="'+i+'"><strong>'+esc(answer[0])+'</strong></button>').join('')+
 '<p class="small">Runda '+(b.round+1)+' z 3 · Zasięg: '+b.attention+' · Napięcie: '+b.pressure+'</p></div>';
 $('next').classList.add('hidden');$('feedback').classList.add('hidden');
}
function decideBroadcast(index){
 const b=S?.broadcast,spec=broadcastForWeek();if(!b||!spec||S.phase!==4)return;
 const answer=spec.rounds[b.round]?.a[index];if(!answer)return;
 b.score+=answer[1];b.attention+=answer[2];b.pressure+=answer[3];b.history.push(answer[0]);b.round++;
 if(b.round===spec.rounds.length){
  S.trust=clamp(S.trust+b.score,0,100);
  S.groups=S.groups.map(g=>clamp(g+b.attention*.22-b.pressure*.12,3,70));
  ensureNarrative();const spokesperson=S.people.find(p=>p.id==='spokesperson');
  if(spokesperson&&spokesperson.active)spokesperson.loyalty=clamp(spokesperson.loyalty+(b.score>=0?3:-5),0,100);
  log(spec.title+': wynik '+b.score+' punktów wiarygodności.');
  S.phase=1;render();
  $('feedback').textContent='Transmisja zakończona. Wynik debaty: '+(b.score>=0?'+':'')+b.score+' wiarygodności.';
  $('feedback').classList.remove('hidden');
 }else {renderBroadcast();}
}


const SPONSORS=[
{id:'cooperative',name:'Spółdzielnie lokalne',amount:4300,trust:2,commitment:'Wspieraj jawność zamówień samorządowych'},
{id:'industry',name:'Związek przemysłowców',amount:8500,trust:-2,commitment:'Podtrzymuj konsultacje z przemysłem'},
{id:'citizens',name:'Komitet drobnych darczyńców',amount:2600,trust:3,commitment:'Publikuj regularne sprawozdania'},
{id:'anonymous',name:'Nieprzejrzysta fundacja',amount:12000,trust:-7,commitment:'Wyjaśnij pochodzenie finansowania'}
];
function initFinance(){
 if(!S.finance)S.finance={offices:Array(REGIONS.length).fill(0),sponsors:[],debt:0,arrears:0,crisis:0,lastWeek:-1,monthly:[],usedSponsorWeeks:[]};
 if(!Array.isArray(S.finance.offices)||S.finance.offices.length!==REGIONS.length)S.finance.offices=Array(REGIONS.length).fill(0);
 return S.finance;
}
function weeklyAccounts(){
 const f=initFinance();if(f.lastWeek===S.week)return;
 const overhead=f.offices.reduce((n,x)=>n+x*120,0)+S.staff.length*170+350;
 const subscriptions=1400+(S.staff.includes('finance')?550:0)+Math.round(f.offices.reduce((n,x)=>n+x*40,0));
 const actual=Math.min(S.money,overhead);S.money-=actual;const unpaid=overhead-actual;
 f.arrears+=unpaid;S.money+=subscriptions;
 if(f.debt>0){const payment=Math.min(S.money,Math.max(200,Math.round(f.debt*.08)));S.money-=payment;f.debt=Math.max(0,f.debt-payment);}
 if(f.arrears>0&&S.money>1000){const payment=Math.min(f.arrears,Math.floor((S.money-1000)*.5));S.money-=payment;f.arrears-=payment;}
 if(f.arrears>2500){f.crisis++;S.trust=clamp(S.trust-2,0,100);S.regional=S.regional.map((n,i)=>clamp(n-(f.offices[i]>.5?.3:0),0,30));}
 f.monthly.push({week:S.week+1,income:subscriptions,expense:overhead,arrears:f.arrears,debt:f.debt});
 f.lastWeek=S.week;
 log('Bilans księgowy: wpływy '+moneyFmt(subscriptions)+', koszty '+moneyFmt(overhead)+'.');
}
function moneyFmt(x){return Math.round(x).toLocaleString('pl-PL')+' zł';}
function financePanel(){
 const f=initFinance();
 return '<div class="finance-panel"><h3 class="section-title">Księga rachunkowa partii</h3>'+
 '<div class="group"><span>Środki w kasie</span><b>'+moneyFmt(S.money)+'</b></div>'+
 '<div class="group"><span>Zaległe płatności</span><b>'+moneyFmt(f.arrears)+'</b></div>'+
 '<div class="group"><span>Zobowiązania pożyczkowe</span><b>'+moneyFmt(f.debt)+'</b></div>'+
 '<div class="group"><span>Biura regionalne</span><b>'+f.offices.reduce((a,b)=>a+b,0)+' / 18</b></div>'+
 '<p class="small">Każde biuro kosztuje 120 zł tygodniowo. Daje lokalne struktury, ale jego utrzymanie obciąża budżet.</p>'+
 '<div class="finance-controls"><button data-finance="office" '+(S.money<2300?'disabled':'')+'>Otwórz biuro w wybranym regionie (2300 zł)</button>'+
 '<button data-finance="loan" '+(f.debt>=10000?'disabled':'')+'>Jawna pożyczka (5000 zł)</button>'+
 '<button data-finance="settle" '+(f.arrears===0||S.money===0?'disabled':'')+'>Spłać zaległości</button></div>'+
 '<h4>Darczyńcy</h4>'+SPONSORS.map(p=>'<button data-sponsor="'+p.id+'" '+(f.sponsors.includes(p.id)||f.usedSponsorWeeks.includes(S.week)?'disabled':'')+'>'+esc(p.name)+' · +'+moneyFmt(p.amount)+'<small>'+esc(p.commitment)+'</small></button>').join('')+
 '<div class="small">Operacje finansowe i sponsorzy mają skutki w kolejnych tygodniach.</div></div>';
}
function transactFinance(action,id){
 if(!S)return;const f=initFinance();
 if(action==='office'){const i=S.selectedRegion||0;if(S.money<2300||f.offices[i]>=2)return;S.money-=2300;f.offices[i]++;S.regional[i]=clamp(S.regional[i]+1.2,0,30);log('Otwarto biuro w regionie '+REGIONS[i].name+'.');}
 if(action==='loan'){if(f.debt>=10000)return;S.money+=5000;f.debt+=6100;S.trust=clamp(S.trust-1,0,100);log('Zaciągnięto pożyczkę na potrzeby kampanii.');}
 if(action==='settle'){let x=Math.min(S.money,f.arrears);S.money-=x;f.arrears-=x;log('Spłacono zaległości: '+moneyFmt(x)+'.');}
 if(action==='sponsor'){
 const p=SPONSORS.find(x=>x.id===id);if(!p||f.sponsors.includes(p.id)||f.usedSponsorWeeks.includes(S.week))return;
 S.money+=p.amount;S.trust=clamp(S.trust+p.trust,0,100);f.sponsors.push(p.id);f.usedSponsorWeeks.push(S.week);log('Przyjęto finansowanie: '+p.name+'.');
 }
 render();
}
function auditSponsors(){
 const f=initFinance();
 if(S.week===14&&f.sponsors.includes('anonymous')){S.trust=clamp(S.trust-8,0,100);log('Kontrola finansowania: nieprzejrzysta fundacja wywołuje skandal.');}
 if(S.week===20&&f.sponsors.includes('industry')){S.trust=clamp(S.trust-2,0,100);log('Przemysłowcy żądają wyjaśnień w sprawie programu.');}
 if(S.week===24&&f.sponsors.includes('citizens')){S.trust=clamp(S.trust+3,0,100);log('Drobni darczyńcy chwalą jawne rachunki.');}
}
document.addEventListener('click',e=>{
 const sponsor=e.target.closest('[data-sponsor]');if(sponsor){transactFinance('sponsor',sponsor.dataset.sponsor);return;}
 const action=e.target.closest('[data-finance]');if(action){transactFinance(action.dataset.finance);return;}
});


const RIVAL_TACTICS=[
 {label:'Wiec regionalny',delta:1.9,global:.03},
 {label:'Kampania telewizyjna',delta:.55,global:.48},
 {label:'Debata programowa',delta:.85,global:.25},
 {label:'Organizacja struktur',delta:1.15,global:.13},
 {label:'Konferencja kryzysowa',delta:.4,global:-.22}
];
function ensureRivals(){
 if(!S.rivalAI||!Array.isArray(S.rivalAI.regional)||S.rivalAI.regional.length!==5){
  S.rivalAI={regional:Array.from({length:5},()=>Array(REGIONS.length).fill(0)),global:Array(5).fill(0),lastWeek:-1,news:[],pollHistory:[]};
 }
 return S.rivalAI;
}
function runRivals(){
 const ai=ensureRivals();if(ai.lastWeek===S.week)return;
 for(let j=0;j<5;j++){
  const pressure=(S.week%3===0),ranked=REGIONS.map((reg,i)=>({i,gap:Math.abs(pollRegion(i)[0]-pollRegion(i)[j+1])})).sort((a,b)=>a.gap-b.gap),index=pressure?ranked[0].i:Math.floor(rand()*REGIONS.length),tactic=RIVAL_TACTICS[Math.floor(rand()*RIVAL_TACTICS.length)];
  const strength=(.68+rand()*.5)*level().rival;
  ai.regional[j][index]=clamp(ai.regional[j][index]+tactic.delta*strength,-5,15);
  ai.global[j]=clamp(ai.global[j]+tactic.global*strength-.07,-6,8);
  const line=RIVALS[j].name+': '+tactic.label.toLowerCase()+' w regionie '+REGIONS[index].name+'.';
  ai.news.unshift({week:S.week+1,text:line,party:j,region:index});
  log(line);
 }
 ai.news=ai.news.slice(0,18);
 ai.lastWeek=S.week;
 ai.pollHistory.push({week:S.week+1,shares:national().map(v=>Number(v.toFixed(2)))});
 ai.pollHistory=ai.pollHistory.slice(-30);
}
function rivalPanel(){
 const ai=ensureRivals(),latest=ai.news.slice(0,5);
 const hist=ai.pollHistory,last=hist.length?hist[hist.length-1]:null;
 const lastPlayer=last?last.shares[0]:national()[0];
 return '<div class="rival-panel"><h3 class="section-title">Konkurencja nie śpi</h3><p class="small">Każda partia prowadzi niezależną kampanię w regionach. Informacje sztabu aktualizują się co tydzień.</p>'+
 latest.map(n=>'<div class="rival-news"><span>TYD. '+n.week+'</span> '+esc(n.text)+'</div>').join('')+
 '<h4>Barometr wyborczy</h4><div class="group"><span>Ostatni zapisany sondaż</span><b>'+lastPlayer.toFixed(1)+'%</b></div>'+
 '<div class="group"><span>Liczba pomiarów</span><b>'+hist.length+'</b></div>'+
 '<div class="rival-chart">'+hist.slice(-12).map(h=>'<div title="Tydzień '+h.week+': '+h.shares[0].toFixed(1)+'%" style="height:'+clamp(h.shares[0]*2,6,100)+'%" aria-label="Tydzień '+h.week+': '+h.shares[0].toFixed(1)+'%"></div>').join('')+'</div></div>';
}


const DIFFICULTY={easy:{rival:.7,player:1.12,label:'Debiutant'},normal:{rival:1,player:1,label:'Standard'},hard:{rival:1.48,player:.88,label:'Weteran'}};
function level(){return DIFFICULTY[S?.difficulty]||DIFFICULTY.normal}
function swingVoters(i){const reg=REGIONS[i],base=8+reg.population*.21;return clamp(base+(S.week%6===0?2:0),6,18)}
function forecastPanel(){
 const current=national(),mine=current[0],projected=seats();
 const close=REGIONS.map((reg,i)=>{const v=pollRegion(i),gap=Math.abs(v[0]-Math.max(...v.slice(1)));return {i,name:reg.name,gap,share:v[0]}}).sort((a,b)=>a.gap-b.gap).slice(0,3);
 return '<div class="forecast-panel"><h3 class="section-title">Prognoza wyborcza</h3>'+
 '<div class="group"><span>Poziom rozgrywki</span><b>'+esc(level().label)+'</b></div>'+
 '<div class="group"><span>Prognozowane mandaty Twojej partii</span><b>'+projected[0]+' / 180</b></div>'+
 '<div class="group"><span>Do samodzielnej większości</span><b>'+Math.max(0,91-projected[0])+'</b></div>'+
 '<div class="group"><span>Sondaż krajowy</span><b>'+mine.toFixed(1)+'%</b></div>'+
 '<h4>Regiony zaciętej walki</h4>'+close.map(r=>'<div class="group"><span>'+esc(r.name)+'</span><b>różnica '+r.gap.toFixed(1)+' pkt</b></div>').join('')+
 '<p class="small">Niezdecydowani w każdym regionie mogą zmienić wynik. Prognoza nie jest gwarancją wyniku.</p></div>';
}


const EPILOG_TITLES={mandate:'SAMODZIELNE RZĄDY',coalition:'RZĄD KOALICYJNY',opposition:'LIDER OPOZYCJI',minority:'ŁAWY OPOZYCJI',out:'POZA PARLAMENTEM'};
function campaignEpilogue(){
 const places=seats(),own=places[0],total=S.negotiations?.accepted?.length?coalitionTotal():own;
 const regime=own>=91?'mandate':total>=91?'coalition':own===0?'out':own===Math.max(...places)?'opposition':'minority';
 const finance=initFinance(),friends=S.people?.filter(p=>p.active).length||0;
 const historic=(S.arcs?.fundusz==='hidden'?' Opozycja przypomina niejawne finansowanie.':'')+
  (S.arcs?.fabryka==='workers'?' Organizacje pracownicze pamiętają Twoje wsparcie.':'')+
  (S.arcs?.redakcja==='independent'?' Dziennikarze doceniają niezależność redakcji.':'');
 const score=regime==='mandate'?4:regime==='coalition'?3:regime==='opposition'?2:regime==='minority'?1:0;
 const tone=score>=3?'Obywatele powierzyli Ci odpowiedzialność za powołanie gabinetu.':score===2?'Największe ugrupowanie pozostaje poza gabinetem i organizuje kontrolę rządu.':score===1?'Partia będzie budować wpływy i pracować nad kolejnymi wyborami.':'Projekt polityczny będzie wymagał odbudowania od podstaw.';
 return '<section class="epilogue frame"><div class="kicker">KRONIKA POWYBORCZA / EPILOG</div><h3 class="section-title">'+EPILOG_TITLES[regime]+'</h3>'+
 '<p>'+esc(tone+historic)+'</p>'+
 '<div class="group"><span>Ocena mandatu wyborczego</span><b>'+own+' z 180</b></div>'+
 '<div class="group"><span>Wiarygodność</span><b>'+S.trust+'/100</b></div>'+
 '<div class="group"><span>Lojalni współpracownicy</span><b>'+friends+'/4</b></div>'+
 '<div class="group"><span>Zaległości i zadłużenie</span><b>'+moneyFmt(finance.arrears+finance.debt)+'</b></div>'+
 '<p class="small">Ostateczny bilans zależy od poprzednich decyzji i zawartych porozumień.</p></section>';
}
function renderEpilogue(){const slot=$('epilogue');if(slot&&S)slot.innerHTML=campaignEpilogue();}


let activeGameTab='campaign';
function initializeGameTabs(){
 const tabs=[...document.querySelectorAll('[data-game-tab]')];if(!tabs.length)return;
 const root=$('game'),columns=root.querySelector('.columns');if(!columns)return;
 const article=root.querySelector('.article');
 const sectionIds=['campaign','regions','polls','staff','media','finance'];
 const targets={campaign:article,regions:root.querySelector('.atlas-wrap'),polls:$('poll'),staff:$('staffDesk'),media:$('rivalDesk'),finance:$('financeDesk')};
 const panes={};
 for(const id of sectionIds){const pane=document.createElement('section');pane.className='game-pane';pane.dataset.pane=id;pane.hidden=id!=='campaign';panes[id]=pane;root.appendChild(pane);}
 panes.campaign.appendChild(article);
 panes.regions.appendChild(targets.regions);
 const append=(pane,ids)=>ids.forEach(id=>{const n=$(id);if(n)pane.appendChild(n)});
 append(panes.polls,['poll','groups','forecastDesk']);
 append(panes.staff,['characterRoster','staffDesk']);
 append(panes.media,['history','rivalDesk']);
 append(panes.finance,['financeDesk']);
 columns.classList.add('hidden');
 function switchTab(id){
  if(!panes[id])return;activeGameTab=id;
  for(const key of sectionIds)panes[key].hidden=key!==id;
  tabs.forEach(b=>{const selected=b.dataset.gameTab===id;b.classList.toggle('active',selected);b.setAttribute('aria-selected',String(selected));});
 }
 tabs.forEach(b=>b.addEventListener('click',()=>switchTab(b.dataset.gameTab)));
 window.openGameTab=switchTab;
 switchTab('campaign');
}


const CANDIDATE_IMAGES={
 male:['assets/candidates/man-1.jpg','assets/candidates/man-2.jpg','assets/candidates/man-3.jpg','assets/candidates/man-4.jpg'],
 female:['assets/candidates/woman-1.jpg','assets/candidates/woman-2.jpg','assets/candidates/woman-3.jpg','assets/candidates/woman-4.jpg']
};
let candidateSelection={gender:'male',portrait:0};
function candidateAsset(gender,index){const allowed=gender==='female'?'female':'male';return CANDIDATE_IMAGES[allowed][clamp(Number(index)||0,0,3)]}
function candidateImage(gender,index,alt){return '<img src="'+candidateAsset(gender,index)+'" alt="'+esc(alt)+'" loading="lazy">'}
function selectCandidatePortraits(){
 const target=$('candidatePortraits');if(!target)return;
 candidateSelection.gender=$('candidateGender')?.value==='female'?'female':'male';
 target.innerHTML=CANDIDATE_IMAGES[candidateSelection.gender].map((src,i)=>
 '<button type="button" class="portrait-choice" data-candidate-photo="'+i+'" aria-pressed="'+(i===candidateSelection.portrait)+'" aria-label="Portret '+(i+1)+'">'+candidateImage(candidateSelection.gender,i,'Portret kandydata numer '+(i+1))+'<span>Portret '+(i+1)+'</span></button>').join('');
}
function renderCandidate(){
 if(!S)return;
 const c=S.candidate||{name:'Lider ugrupowania',gender:'male',portrait:0};
 if($('candidateCampaignName'))$('candidateCampaignName').textContent=c.name;
 if($('candidateCampaignPhoto'))$('candidateCampaignPhoto').innerHTML=candidateImage(c.gender,c.portrait,c.name);
 if($('candidateResult'))$('candidateResult').innerHTML=candidateImage(c.gender,c.portrait,c.name)+'<span>'+esc(c.name)+' · '+esc(S.name)+'</span>';
}
$('candidateGender')?.addEventListener('change',()=>{candidateSelection.portrait=0;selectCandidatePortraits()});
$('candidatePortraits')?.addEventListener('click',e=>{const b=e.target.closest('[data-candidate-photo]');if(!b)return;candidateSelection.portrait=clamp(Number(b.dataset.candidatePhoto)||0,0,3);selectCandidatePortraits()});
selectCandidatePortraits();

let S=null;
function safeNum(n){return Math.round(n).toLocaleString('pl-PL')}
function rand(){S.seed=(Math.imul(S.seed,1664525)+1013904223)>>>0;return S.seed/4294967296}
function regionStrength(region){return WEIGHTS.reduce((a,w,i)=>a+w*S.groups[i]*region.traits[i],0)+S.regional[REGIONS.indexOf(region)]}
function pollRegion(i){const reg=REGIONS[i],ours=Math.max(1,regionStrength(reg))*level().player,rivals=RIVALS.map((r,j)=>r.base*(.8+WEIGHTS.reduce((a,w,k)=>a+w*r.lean[k]*reg.traits[k],0)*.2)+(j===0?2*Math.sin(S.week/3+i):j===1?Math.cos(i+S.week/4):0)+(S.rivalAI?.regional?.[j]?.[i]||0)+(S.rivalAI?.global?.[j]||0));const uncertainty=swingVoters(i),rawRivals=rivals.map(v=>v*level().rival),total=ours+rawRivals.reduce((a,b)=>a+b,0);return [ours,...rawRivals].map(v=>Math.max(0,v/total*(100-uncertainty)))}
function national(){let a=Array(6).fill(0),population=REGIONS.reduce((x,r)=>x+r.population,0);REGIONS.forEach((r,i)=>pollRegion(i).forEach((v,j)=>a[j]+=v*r.population/population));return a}
function allocate(total,proportions,eligible){const votes=proportions.map((v,i)=>eligible[i]?v:0),seats=Array(votes.length).fill(0);for(let i=0;i<total;i++){let pick=-1,best=-1;votes.forEach((v,j)=>{if(v<=0)return;const val=v/(seats[j]+1);if(val>best){best=val;pick=j}});if(pick>=0)seats[pick]++}return seats}
function names(){return [S.name,...RIVALS.map(v=>v.name)]}
function seats(){let sum=Array(6).fill(0);const eligible=national().map(v=>v>=5),popTotal=REGIONS.reduce((a,r)=>a+r.population,0),exact=REGIONS.map(r=>180*r.population/popTotal),counts=exact.map(Math.floor);for(let i=180-counts.reduce((a,b)=>a+b,0);i>0;i--){let idx=exact.map((v,j)=>({j,rem:v-counts[j]})).sort((a,b)=>b.rem-a.rem)[0].j;counts[idx]++}REGIONS.forEach((r,i)=>allocate(counts[i],pollRegion(i),eligible).forEach((n,j)=>sum[j]+=n));return sum}
function show(id){['setup','game','end','coalition'].forEach(k=>$(k).classList.toggle('hidden',k!==id));window.scrollTo(0,0)}
function apply(d,t,c,region){const factor=.85+S.trust/300;S.groups=S.groups.map((v,i)=>clamp(v+d[i]*factor,3,70));S.trust=clamp(S.trust+t,0,100);S.money-=c;if(region!==undefined)S.regional[region]=clamp(S.regional[region]+1.7+(S.staff?.includes('field')?.8:0),0,30)}
function log(text){S.history.unshift('TYDZIEŃ '+(S.week+1)+': '+text);if(S.history.length>90)S.history.length=90}
function start(){const bases={economy:[16,24,17,15],social:[17,16,22,24],green:[24,17,17,15],freedom:[25,22,15,12]};S={profile:$('profile').value,origin:($('candidateOrigin')?.value||'organizer'),candidate:{name:($('candidateName')?.value||'Jan Kowalski').trim().replace(/\s+/g,' ').slice(0,42)||'Jan Kowalski',gender:candidateSelection.gender,portrait:candidateSelection.portrait},name:$('partyName').value.trim().replace(/\s+/g,' ').slice(0,32)||'Nowy Kierunek',groups:[...bases[$('profile').value]],regional:Array(REGIONS.length).fill(0),difficulty:DIFFICULTY[$('difficulty')?.value]?$('difficulty').value:'normal',money:($('candidateOrigin')?.value==='entrepreneur'?36000:22000),trust:($('candidateOrigin')?.value==='organizer'?65:55),week:0,phase:0,seed:(Math.random()*2**32)>>>0,history:[],staff:[],recentTactics:[],diplomacy:0,arcs:{},people:CHARACTERS.map(x=>({...x,active:true})),used:[],selectedRegion:0,coalition:[],rivalAI:{regional:Array.from({length:5},()=>Array(REGIONS.length).fill(0)),global:Array(5).fill(0),lastWeek:-1,news:[],pollHistory:[]},finance:{offices:Array(REGIONS.length).fill(0),sponsors:[],debt:0,arrears:0,crisis:0,lastWeek:-1,monthly:[],usedSponsorWeeks:[]},done:false};show('game');window.openGameTab?.('campaign');render()}
function eventCost(o){return typeof o[1]==='object'&&!Array.isArray(o[1])?Math.max(0,-(o[1].budget||0)):o[3]}
function eventForWeek(){const narrative=storyForWeek();if(narrative)return narrative;const data=window.WYBORY_DATA;if(data?.milestones?.[S.week])return data.milestones[S.week];const p=data?.pool;if(p?.length){return p[((S.seed>>>0)+S.week*17)%p.length]}return EVENT_POOL[S.week%EVENT_POOL.length]}
function render(){if(!S)return;renderCandidate();const n=national();$('weekLabel').textContent='TYDZIEŃ '+(S.week+1)+' / 30 · '+CHAPTERS[Math.min(5,Math.floor(S.week/5))];$('campaignTitle').textContent=S.name;$('support').textContent=n[0].toFixed(1)+'%';$('money').textContent=safeNum(S.money)+' zł';$('trust').textContent=S.trust+'/100';$('left').textContent=(30-S.week)+' tyg.';if($('characterRoster'))$('characterRoster').innerHTML=characterCards();renderStaffDesk();renderAtlas();if($('rivalDesk'))$('rivalDesk').innerHTML=rivalPanel();if($('forecastDesk'))$('forecastDesk').innerHTML=forecastPanel();if($('financeDesk'))$('financeDesk').innerHTML=financePanel();if($('stepHint'))$('stepHint').textContent=S.done?'Wszystkie decyzje podjęte. Przejdź do kolejnego tygodnia.':(['1/4 · Przeczytaj depeszę i wybierz odpowiedź.','2/4 · Wybierz województwo na kampanię albo zrezygnuj z wyjazdu.','3/4 · Wybierz jedno działanie ogólnopolskie. Specjalistów zatrudnisz osobno w zakładce Sztab.','4/4 · Wybierz taktykę na koniec tygodnia.','Debata · Odpowiedz na kolejne pytanie.'][S.phase]||'');if($('weekProgress'))$('weekProgress').style.width=(((S.week+1)/30)*100).toFixed(2)+'%';$('phase').textContent=['ETAP I · DEPESZA REDAKCYJNA','ETAP II · REGIONY','ETAP III · SZTAB','ETAP IV · PLAN STRATEGICZNY'][S.phase];$('feedback').classList.add('hidden');$('next').classList.add('hidden');$('history').innerHTML=S.history.slice(0,12).map(x=>'<li>'+esc(x)+'</li>').join('')||'<li>Sztab rozpoczyna pracę.</li>';$('poll').innerHTML=n.map((v,i)=>'<div class="poll-item"><div class="poll-label"><span>'+esc(names()[i])+'</span><b>'+v.toFixed(1)+'%</b></div><div class="bar"><div class="barfill '+(i===0?'you':'')+'" style="width:'+v.toFixed(1)+'%"></div></div></div>').join('');$('groups').innerHTML=REGIONS.map((r,i)=>'<div class="group"><span>'+esc(r.name)+'</span><b>'+pollRegion(i)[0].toFixed(1)+'%</b></div>').join('');$('groups').innerHTML+='<div class="paper-banner">MAPA POPARCIA • 16 WOJEWÓDZTW</div><div class="map-tiles">'+REGIONS.map((r,i)=>'<div class="map-tile"><strong>'+esc(r.name)+'</strong><span>'+pollRegion(i)[0].toFixed(1)+'% · '+Math.round(180*r.population/REGIONS.reduce((n,x)=>n+x.population,0))+' mand.</span></div>').join('')+'</div>';if(S.phase===0){let e=eventForWeek();$('eventTitle').textContent=e.title||e[0];$('eventText').textContent=e.body||e[1];const opts=e.options||e[2];$('choices').innerHTML=opts.map((o,i)=>'<button class="option" data-kind="event" data-i="'+i+'" '+(eventCost(o)>S.money?'disabled':'')+'><strong>'+esc(o[0])+'</strong><small>Koszt: '+safeNum(eventCost(o))+' zł</small></button>').join('')+(opts.every(o=>eventCost(o)>S.money)?'<button class="option" data-kind="event" data-i="99"><strong>Awaryjny dyżur wolontariuszy</strong><small>Bez kosztów</small></button>':'')}else if(S.phase===1){$('eventTitle').textContent='Gdzie wysłać działaczy?';$('eventText').textContent='Wybierz region, w którym odbędzie się spotkanie. Każdy region ma inną wagę w wyborach.';$('choices').innerHTML=REGIONS.map((r,i)=>'<button class="option" data-kind="region" data-i="'+i+'" '+(S.money<700?'disabled':'')+'><strong>'+esc(r.name)+'</strong><small>Poparcie: '+pollRegion(i)[0].toFixed(1)+'% · Koszt: 700 zł</small></button>').join('')+(S.money<700?'<button class="option" data-kind="region" data-i="'+REGIONS.length+'"><strong>Bez wyjazdu</strong><small>Przejdź dalej bez kosztów podróży</small></button>':'')}else if(S.phase===2){$('eventTitle').textContent='Decyzja sztabu';$('eventText').textContent='Wybierz jedno działanie ogólnokrajowe. Możesz też zbierać fundusze.';$('choices').innerHTML=ACTIONS.map((a,i)=>'<button class="option" data-kind="action" data-i="'+i+'" '+(S.money<a[1]?'disabled':'')+'><strong>'+esc(a[0])+'</strong><small>'+esc(a[4])+' · '+(a[1]<0?'+':'−')+safeNum(Math.abs(a[1]))+' zł</small></button>').join('')}if(S.phase===3){
 $('eventTitle').textContent='Plan na nadchodzące dni';$('eventText').textContent='Podejmij jedną dodatkową decyzję strategiczną. Jej konsekwencje mogą wpłynąć na regiony, budżet lub przyszłą koalicję.';
 $('choices').innerHTML=TACTICS.map((a,i)=>'<button class="option" data-kind="tactic" data-i="'+i+'" '+(S.money<a.cost?'disabled':'')+'><strong>'+esc(a.name)+'</strong><small>'+esc(a.desc)+' · koszt: '+safeNum(a.cost)+' zł</small></button>').join('');
}if(S.phase===4)renderBroadcast();if(S.done){$('choices').innerHTML='';$('eventTitle').textContent='Numer tygodnia zamknięty';$('eventText').textContent='Wszystkie decyzje z tego tygodnia zostały podjęte. Możesz przejść do kolejnego numeru gazety.';$('next').textContent=S.week===29?'Otwórz urny wyborcze →':'Następny tydzień →';$('next').classList.remove('hidden');}
}
function decide(kind,index){if(!S||S.done)return;if(kind==='broadcast'&&S.phase===4){decideBroadcast(index);return;}if(kind==='event'&&S.phase===0){const e=eventForWeek(),opts=e.options||e[2],o=opts[index];if(index===99&&opts.every(x=>eventCost(x)>S.money)){apply([0,0,0,0],-1,0);log('Doraźna akcja wolontariuszy')}else{if(!o||eventCost(o)>S.money)return;if(e.options){if(e.arc||e.person)applyNarrative(index,e);const v=o[1];S.money+=v.budget||0;S.trust=clamp(S.trust+(v.trust||0),0,100);S.groups=S.groups.map(x=>clamp(x+((v.national||0)+(S.staff?.includes('press')?.25:0))*(.85+S.trust/300)*(.86+(S.people?.filter(p=>p.active).length||4)*.035),3,70));S.regional=S.regional.map(x=>clamp(x+(v.org||0)/12,0,30));S.groups=S.groups.map(x=>clamp(x+(v.awareness||0)*.035-(v.heat||0)*.018,3,70));S.trust=clamp(S.trust-(v.heat||0)*.10,0,100);if(v.org)S.regional[S.selectedRegion||0]=clamp(S.regional[S.selectedRegion||0]+v.org*.15,0,30)}else{apply(o[1],o[2],o[3])}log((e.title||e[0])+' — '+o[0])}if(broadcastForWeek())startBroadcast();else S.phase=1;render();if(S.phase===4)renderBroadcast();else{$('feedback').textContent='Korespondent: decyzja odnotowana w gazetach.';$('feedback').classList.remove('hidden');}$('feedback').classList.remove('hidden')}else if(kind==='region'&&S.phase===1){if(index!==REGIONS.length){if(!REGIONS[index]||S.money<700)return;apply([0,0,0,0],1,700,index);S.selectedRegion=index;log('Spotkanie w regionie '+REGIONS[index].name)}else{if(S.money>=700)return;log('Brak środków na wyjazd')}S.phase=2;render()}else if(kind==='hire'&&S.phase===2){
 const person=STAFF_ROLES[index];if(!person||S.staff.includes(person.id)||S.staff.length>=3||S.money<3200)return;
 S.money-=3200;S.staff.push(person.id);S.trust=clamp(S.trust+1,0,100);
 log('Zatrudniono: '+person.name+'.');
 S.phase=3;render();
 }else if(kind==='action'&&S.phase===2){const a=ACTIONS[index];if(!a||S.money<a[1])return;apply(S.staff?.includes('polls')?a[2].map(v=>v>0?v+.25:v):a[2],a[3],a[1]);ensureNarrative();if(index===2){for(const p of S.people.filter(x=>x.active))p.loyalty=clamp(p.loyalty-2,0,100);}else if(index===1){for(const p of S.people.filter(x=>x.active))p.loyalty=clamp(p.loyalty+2,0,100);}log('Akcja sztabu — '+a[0]);S.phase=3;render();}else if(kind==='tactic'&&S.phase===3){
 const tactic=TACTICS[index];if(!tactic||S.money<tactic.cost)return;
 S.recentTactics=S.recentTactics||[];const repeats=S.recentTactics.filter(v=>v===index).length;const penalty=Math.min(3,repeats);
 S.money-=tactic.cost;S.money+=Math.round((tactic.budget||0)*(1-penalty*.14));S.diplomacy=clamp((S.diplomacy||0)+tactic.diplomacy,0,30);
 apply(tactic.delta.map(v=>v>0?Math.max(0,v-penalty*.5):v),tactic.trust>0?Math.max(0,tactic.trust-penalty):tactic.trust,0);
 S.recentTactics.push(index);S.recentTactics=S.recentTactics.slice(-4);
 if(tactic.local&&Number.isInteger(S.selectedRegion)&&S.selectedRegion>=0&&S.selectedRegion<REGIONS.length)S.regional[S.selectedRegion]=clamp(S.regional[S.selectedRegion]+tactic.local,0,30);
 log('Strategia: '+tactic.name);
 S.done=true;render();$('feedback').textContent='Plan strategiczny zakończony. Przed wyborami pozostało '+(30-S.week)+' tygodni.';$('feedback').classList.remove('hidden');
}}
function next(){if(!S||!S.done)return;if(S.week===29){finish();return}ensureNarrative();for(const p of S.people.filter(x=>x.active)){const pressure=(S.money<2500?2:0)+(S.trust<42?1:0)+(S.week>=13?1:0);p.loyalty=clamp(p.loyalty-pressure+(S.staff.length>=2?1:0),0,100);}S.week++;weeklyAccounts();auditSponsors();runRivals();S.phase=0;S.done=false;window.openGameTab?.('campaign');render();document.querySelector('.article').scrollIntoView({behavior:'smooth'})}
function finish(){const n=national(),result=seats(),order=result.map((v,i)=>({i,v})).sort((a,b)=>b.v-a.v);$('outcome').textContent=order[0].i===0?'Zwycięstwo wyborcze!':'Werdykt wyborców';$('resultPct').textContent=n[0].toFixed(1)+'%';$('resultText').textContent=S.name+' zdobywa '+result[0]+' ze 180 mandatów. Do większości potrzeba 91 mandatów.';$('finalPoll').innerHTML=result.map((v,i)=>'<div class="poll-item"><div class="poll-label"><span>'+esc(names()[i])+'</span><b>'+v+' mandatów · '+n[i].toFixed(1)+'%</b></div><div class="bar"><div class="barfill '+(i===0?'you':'')+'" style="width:'+(v/180*100).toFixed(1)+'%"></div></div></div>').join('');$('coalitionButton').classList.toggle('hidden',result[0]===0);show('end');renderEpilogue();renderCandidate()}
const POLITICAL_AXIS=[2,3,1,4,0],PROGRAM_AXIS={economy:4,social:1,green:0,freedom:2};
function coalition(){
 if(!S.negotiations)S.negotiations={accepted:[],tried:[],selected:null,round:0,done:false,message:''};
 show('coalition');updateCoalition();
}
function coalitionTotal(){
 const result=seats();return result[0]+(S.negotiations?.accepted||[]).reduce((n,i)=>n+result[i+1],0);
}
function updateCoalition(){
 const result=seats(),co=S.negotiations,total=coalitionTotal();
 if(total>=91){co.done=true;co.message='Koalicja osiąga większość. Możesz utworzyć rząd!';}
 if(result[0]>=91){co.done=true;co.message='Samodzielne rządy: zdobyto co najmniej 91 mandatów.';}
 const available=RIVALS.map((r,i)=>({r,i})).filter(x=>result[x.i+1]>0&&!co.tried.includes(x.i)&&!co.accepted.includes(x.i));
 if((co.round>=3||!available.length)&&total<91&&!co.done){co.done=true;co.message='Koniec negocjacji. Nie udało Ci się zdobyć większości, pozostajesz w opozycji.';}
 $('coalitionSeats').textContent=total+' / 91 mandatów';
 $('coalitionDesc').textContent='Runda '+Math.min(3,co.round+1)+' z 3. Poparcie musi przekroczyć 90 mandatów. Porozumienie zależy od programu i ustępstw.';
 if(co.done){$('partners').innerHTML='<div class="frame"><h3>'+esc(total>=91?'Rząd utworzony':'Koniec rozmów')+'</h3><p>'+esc(co.message)+'</p></div>';}
 else if(co.selected===null){
  $('partners').innerHTML='<p class="small">Wybierz ugrupowanie do rozmów. Masz tylko trzy próby.</p>'+
  available.map(x=>'<button class="option" data-coalition-party="'+x.i+'"><strong>'+esc(x.r.name)+'</strong><small>'+result[x.i+1]+' mandatów · różnice programowe mają znaczenie</small></button>').join('')+
  '<button class="btn alt" data-coalition-action="end">Zakończ rozmowy</button>';
 }else{
  const party=RIVALS[co.selected];
  $('partners').innerHTML='<h3 class="section-title">'+esc(party.name)+'</h3><p class="small">Twój partner oczekuje ustępstw programowych. Zdecyduj, jaką ofertę przedstawisz.</p>'+
  '<button class="option" data-coalition-offer="0"><strong>Hojny kompromis</strong><small>Duże ustępstwa, większa szansa zgody, −4 wiarygodności.</small></button>'+
  '<button class="option" data-coalition-offer="1"><strong>Równy podział odpowiedzialności</strong><small>Średnie ustępstwa, −1 wiarygodności.</small></button>'+
  '<button class="option" data-coalition-offer="2"><strong>Twarde stanowisko</strong><small>Mało ustępstw, trudniej o zgodę, +2 wiarygodności.</small></button>'+
  '<button class="btn alt" data-coalition-action="back">Wybierz innego partnera</button>';
 }
 renderEpilogue();
 $('coalitionResult').textContent=co.message||('Do większości brakuje '+Math.max(0,91-total)+' mandatów.');
}
function negotiate(offer){
 const co=S.negotiations;if(co.done||co.selected===null||![0,1,2].includes(offer))return;
 const i=co.selected,p=RIVALS[i],diff=Math.abs((PROGRAM_AXIS[S.profile||'economy']??2)-POLITICAL_AXIS[i]),result=seats();
 const chance=clamp(27+S.trust*.45-diff*9+[30,14,-14][offer]+(coalitionTotal()+result[i+1]>=91?12:0)+(S.diplomacy||0)*1.3,8,94);
 const accepted=rand()*100<chance;
 co.tried.push(i);co.round++;co.selected=null;
 if(accepted){co.accepted.push(i);S.trust=clamp(S.trust+[-4,-1,2][offer],0,100);co.message=p.name+' przyjmuje ofertę. +'+result[i+1]+' mandatów. Szansa powodzenia: '+Math.round(chance)+'%.';}
 else co.message=p.name+' odrzuca propozycję. Szansa powodzenia: '+Math.round(chance)+'%.';
 updateCoalition();
}
function coalitionClick(e){
 const btn=e.target.closest('button');if(!btn||!S?.negotiations)return;
 if(btn.dataset.coalitionParty!==undefined){S.negotiations.selected=Number(btn.dataset.coalitionParty);updateCoalition();}
 else if(btn.dataset.coalitionOffer!==undefined){negotiate(Number(btn.dataset.coalitionOffer));}
 else if(btn.dataset.coalitionAction==='back'){S.negotiations.selected=null;updateCoalition();}
 else if(btn.dataset.coalitionAction==='end'){S.negotiations.done=true;S.negotiations.message='Zdecydowano o przejściu do opozycji.';updateCoalition();}
}
function reset(){S=null;show('setup')}
function exportSave(){if(!S)return;const b=new Blob([JSON.stringify({format:'wybory2040-save',version:2,state:S},null,2)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='wybory2040-tydzien-'+(S.week+1)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}
async function importSave(input){const file=input.files?.[0];if(!file)return;try{if(file.size>1000000)throw Error('Plik zbyt duży');const o=JSON.parse(await file.text()),s=o.state;if(o.format!=='wybory2040-save'||!s||!Array.isArray(s.groups)||s.groups.length!==4||!Array.isArray(s.regional)||s.regional.length!==REGIONS.length||!Number.isInteger(s.week)||s.week<0||s.week>29||![0,1,2,3,4].includes(s.phase)||typeof s.name!=='string'||s.name.length>32||!Number.isFinite(s.money)||!Number.isFinite(s.trust)||!Array.isArray(s.history))throw Error('Nieprawidłowy zapis');S={...s,origin:['organizer','journalist','mayor','entrepreneur'].includes(s.origin)?s.origin:'organizer',profile:Object.prototype.hasOwnProperty.call(PROGRAM_AXIS,s.profile)?s.profile:'economy',candidate:s.candidate&&['male','female'].includes(s.candidate.gender)?{name:String(s.candidate.name||'Lider ugrupowania').slice(0,42),gender:s.candidate.gender,portrait:clamp(Number(s.candidate.portrait)||0,0,3)}:{name:'Lider ugrupowania',gender:'male',portrait:0},difficulty:DIFFICULTY[s.difficulty]?s.difficulty:'normal',name:s.name.slice(0,32),history:s.history.slice(0,90),done:Boolean(s.done),staff:Array.isArray(s.staff)?s.staff.filter(id=>STAFF_ROLES.some(r=>r.id===id)).slice(0,3):[]};ensureNarrative();initFinance();ensureRivals();show('game');render();$('saveInfo').textContent='Wczytano tydzień '+(S.week+1)}catch(e){$('saveInfo').textContent='Błąd zapisu: '+e.message}finally{input.value=''}}
$('start').addEventListener('click',start);$('restart').addEventListener('click',reset);$('playAgain').addEventListener('click',reset);$('next').addEventListener('click',next);$('choices').addEventListener('click',e=>{const b=e.target.closest('button[data-kind]');if(b&&!b.disabled)decide(b.dataset.kind,Number(b.dataset.i))});$('coalitionButton').addEventListener('click',coalition);$('partners').addEventListener('click',coalitionClick);$('backResults').addEventListener('click',()=>show('end'));$('share').addEventListener('click',async()=>{if(!S)return;const msg='WYBORY2040: '+S.name+' zdobywa '+seats()[0]+' mandatów!';try{await navigator.clipboard.writeText(msg);$('copyStatus').textContent='Wynik skopiowany.'}catch{$('copyStatus').textContent=msg}});

$('exportSave').addEventListener('click',exportSave);$('importSave').addEventListener('change',e=>importSave(e.target));
$('resumeFile').addEventListener('change',e=>importSave(e.target));

initializeGameTabs();

// Nowa pętla kampanii: działania strategiczne, cele, konsekwencje i wydania tygodniowe.
const LEGACY_RENDER=render, LEGACY_DECIDE=decide, LEGACY_NEXT=next;
const PLAN_ACTIONS=[
 {id:'field',label:'Objazd województwa',cost:700,desc:'Wzmacnia poparcie w wybranym województwie.',category:'region'},
 {id:'media',label:'Ogólnopolska kampania medialna',cost:2400,desc:'Szeroki zasięg i wzrost poparcia.',category:'media'},
 {id:'debate',label:'Przygotowanie do debaty',cost:950,desc:'Wiarygodność i lepsza pozycja w mediach.',category:'media'},
 {id:'volunteers',label:'Budowa struktur lokalnych',cost:800,desc:'Długofalowe korzyści w wybranym województwie.',category:'region'},
 {id:'fundraise',label:'Zbiórka sympatyków',cost:0,desc:'Zdobywa środki. Dostępna raz w tygodniu.',category:'finance'},
 {id:'diplomacy',label:'Rozmowy z innymi partiami',cost:600,desc:'Przygotowuje grunt pod przyszłą koalicję.',category:'strategy'},
 {id:'counter',label:'Odpowiedź na ofensywę rywala',cost:1050,desc:'Ogranicza wpływy rywala w wybranym województwie.',category:'region'},
 {id:'research',label:'Analiza i przygotowanie programu',cost:850,desc:'Poprawia zaufanie i program partii.',category:'strategy'},
 {id:'rest',label:'Spotkanie z wolontariuszami',cost:0,desc:'Mały darmowy wzrost zaufania.',category:'strategy'}
];
function setupTurn(){
 if(!S)return;
 if(!S.turn){S.turn={week:S.week,points:3,done:[],snapshot:{money:S.money,trust:S.trust,poll:national()[0],seats:seats()[0]},report:null};}
 if(S.turn.week!==S.week)S.turn={week:S.week,points:3,done:[],snapshot:{money:S.money,trust:S.trust,poll:national()[0],seats:seats()[0]},report:null};
 if(!S.goals)S.goals={};
}
function campaignGoal(){
 const i=(Math.floor(S.week/5)*3+S.seed%REGIONS.length)%REGIONS.length;
 const target=REGIONS[i],stage=Math.floor(S.week/5),base=S.goals[stage]?.base;
 if(!S.goals[stage])S.goals[stage]={base:pollRegion(i)[0],earned:false,region:i};
 const g=S.goals[stage],current=pollRegion(g.region)[0],needed=g.base+2.5;
 return {stage,region:g.region,current,needed,earned:g.earned};
}
function checkGoal(){
 const g=campaignGoal();if(!g.earned&&g.current>=g.needed){
 S.goals[g.stage].earned=true;S.trust=clamp(S.trust+3,0,100);S.regional[g.region]=clamp(S.regional[g.region]+1.5,0,30);
 log('SUKCES MISJI: '+REGIONS[g.region].name+' — zbudowano trwałe struktury i zdobyto zaufanie.');
 }
}
function makeWeeklyReport(){
 const t=S.turn;if(!t||t.report)return;
 const now=national()[0],old=t.snapshot;
 const difference=now-old.poll,mandates=seats()[0]-old.seats;
 const news=(S.rivalAI?.news||[]).filter(x=>x.week===S.week+1).slice(0,2);
 t.report={week:S.week+1,delta:difference,mandates,spent:S.money-old.money,trust:S.trust-old.trust,news:news.map(x=>x.text),actions:[...t.done]};
}
function planAction(id){
 if(!S||S.done||S.phase!==1)return;
 setupTurn();const a=PLAN_ACTIONS.find(v=>v.id===id);if(!a||S.turn.points<=0||S.money<a.cost)return;
 if(id==='fundraise'&&S.turn.done.includes('fundraise'))return;
 if(id==='rest'&&S.turn.done.includes('rest'))return;
 const r=Number.isInteger(S.selectedRegion)?S.selectedRegion:0;
 S.money-=a.cost;
 if(id==='field'){apply([0,0,0,0],1,0,r);S.regional[r]=clamp(S.regional[r]+.4+(S.origin==='mayor'?.7:0)+(S.staff.includes('field')?(((S.staffLevels||{}).field||1)-1)*.6:0),0,30)}
 if(id==='volunteers'){S.regional[r]=clamp(S.regional[r]+2.1+(S.origin==='organizer'?.8:0),0,30)}
 if(id==='media')apply([1.8,1.8,1.8,1.8].map(x=>x+(S.origin==='journalist'?.35:0)+(S.staff?.includes('press')?.3*((S.staffLevels||{}).press||1):0)),0,0);
 if(id==='debate')apply([.4,.5,.5,.5],3+(S.origin==='journalist'?1:0),0);
 if(id==='fundraise'){const n=2200+(S.staff.includes('finance')?650*((S.staffLevels||{}).finance||1):0);S.money+=n;S.trust=clamp(S.trust-1,0,100)}
 if(id==='diplomacy'){S.diplomacy=clamp((S.diplomacy||0)+3,0,30)}
 if(id==='counter'){const ai=ensureRivals(),top=ai.news.find(n=>n.region===r),j=top?.party??0;ai.regional[j][r]=clamp(ai.regional[j][r]-2,-5,15);S.regional[r]=clamp(S.regional[r]+1,0,30);S.trust=clamp(S.trust+1,0,100)}
 if(id==='research')apply([.5,.5,.5,.5].map(x=>x+(S.staff.includes('polls')?.2*((S.staffLevels||{}).polls||1):0)),3,0);
 if(id==='rest')S.trust=clamp(S.trust+1,0,100);
 S.turn.points--;S.turn.done.push(id);log('Działanie: '+a.label);checkGoal();
 if(S.turn.points===0)finishTurn();else render();
}
function finishTurn(){
 if(!S||S.done)return;setupTurn();makeWeeklyReport();S.done=true;render();
}
function planningMarkup(){
 const goal=campaignGoal(),sel=REGIONS[S.selectedRegion||0];
 const target=REGIONS[goal.region].name;
 const progress=Math.max(0,Math.min(100,(goal.current/goal.needed)*100)).toFixed(0);
 return '<div class="turn-planner"><div class="kicker">PLAN TYGODNIA · '+S.turn.points+' / 3 PUNKTY DZIAŁAŃ</div>'+
 '<p class="small">Sam wybierasz trzy działania. Możesz powtórzyć część akcji albo zakończyć tydzień wcześniej.</p>'+
 '<div class="frame"><strong>CEL ROZDZIAŁU: '+esc(target)+'</strong><p class="small">Osiągnij '+goal.needed.toFixed(1)+'% poparcia. Teraz: '+goal.current.toFixed(1)+'%.'+(goal.earned?' Cel osiągnięty — bonus przyznany.':' Nagroda: trwałe struktury i +3 wiarygodności.')+'</p><div class="bar"><div class="barfill you" style="width:'+progress+'%"></div></div></div>'+
 '<label class="field"><span>Cel regionalnych działań</span><select id="planRegion">'+REGIONS.map((r,i)=>'<option value="'+i+'" '+(S.selectedRegion===i?'selected':'')+'>'+esc(r.name)+' — '+pollRegion(i)[0].toFixed(1)+'%</option>').join('')+'</select></label>'+
 PLAN_ACTIONS.map(a=>'<button class="option" data-kind="plan" data-plan="'+a.id+'" '+(S.money<a.cost||(a.id==='fundraise'&&S.turn.done.includes(a.id))||(a.id==='rest'&&S.turn.done.includes(a.id))?'disabled':'')+'><strong>'+esc(a.label)+'</strong><small>'+esc(a.desc)+' · '+(a.cost?moneyFmt(a.cost):'za darmo')+'</small></button>').join('')+
 '<button class="btn alt" data-kind="plan-finish">Zakończ planowanie tygodnia</button></div>';
}
function reportMarkup(){
 const t=S.turn?.report;if(!t)return '';
 const val=(n,unit)=>((n>=0?'+':'')+n.toFixed(1)+unit);
 return '<section class="weekly-edition frame"><div class="kicker">DZIENNIK WYBORCZY / WYDANIE '+t.week+'</div><h2>TYDZIEŃ ZAMKNIĘTY</h2><p>Poparcie: <strong>'+val(t.delta,' pp')+'</strong> · Mandaty: <strong>'+((t.mandates>=0?'+':'')+t.mandates)+'</strong> · Zaufanie: <strong>'+((t.trust>=0?'+':'')+t.trust)+'</strong></p><p>Bilans: '+moneyFmt(t.spent)+' · Wykonane działania: '+(t.actions.map(id=>esc(PLAN_ACTIONS.find(a=>a.id===id)?.label||id)).join(', ')||'brak')+'.</p>'+
 (t.news.length?'<h3>Z OSTATNIEJ CHWILI</h3><p>'+t.news.map(esc).join('</p><p>')+'</p>':'')+'</section>';
}
render=function(){
 if(!S)return;setupTurn();LEGACY_RENDER();
 if(S.phase===1&&!S.done){
 $('phase').textContent='TWOJA STRATEGIA · TYDZIEŃ '+(S.week+1);
 $('eventTitle').textContent='Zaplanuj działania sztabu';
 $('eventText').textContent='Wybierz priorytety kampanii na ten tydzień.';
 $('choices').innerHTML=planningMarkup();
 if($('stepHint'))$('stepHint').textContent='Pozostało '+S.turn.points+' z 3 punktów działań. Najpierw wybierz region, potem zaplanuj akcje.';
 }
 if(S.done&&S.turn?.report){
 $('eventText').textContent='Przeczytaj wydanie tygodnia i przejdź dalej.';
 $('choices').innerHTML=reportMarkup();
 }
};
decide=function(kind,index){
 if(kind==='plan')return planAction(index);
 if(kind==='plan-finish')return finishTurn();
 return LEGACY_DECIDE(kind,index);
};
next=function(){if(!S?.done)return;const oldWeek=S.week;LEGACY_NEXT();if(S&&S.week!==oldWeek){S.turn=null;setupTurn();render();}};
$('choices').addEventListener('change',e=>{if(e.target.id==='planRegion'&&S){S.selectedRegion=clamp(Number(e.target.value)||0,0,REGIONS.length-1);render();}});
$('choices').addEventListener('click',e=>{const b=e.target.closest('button[data-plan],button[data-kind="plan-finish"]');if(!b)return;e.stopPropagation();if(b.dataset.plan)planAction(b.dataset.plan);else finishTurn();});
