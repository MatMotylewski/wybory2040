'use strict';
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const REGIONS=[
{name:'Stołeczny',population:21,traits:[1.3,1.15,.8,.8]},
{name:'Przemysłowy',population:17,traits:[.85,1.3,1.05,.95]},
{name:'Nadmorski',population:13,traits:[1.2,1.05,.95,.9]},
{name:'Górski',population:9,traits:[.8,.95,1.05,1.25]},
{name:'Rolniczy',population:13,traits:[.8,.9,1.2,1.25]},
{name:'Wschodni',population:11,traits:[.8,.9,1.15,1.3]},
{name:'Zachodni',population:12,traits:[1.15,1.2,.9,.85]},
{name:'Jeziorny',population:8,traits:[1.2,.95,1.05,.85]},
{name:'Centralny',population:16,traits:[1,1.1,1.15,1]}
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
   redakcja:{independent:['Redakcja publikuje śledztwo','Reporterzy doceniają szacunek do niezależności.',{trust:4,national:.4}],use:['Wyciek rozmów z reporterem','Próba upolitycznienia śledztwa wywołała skandal.',{trust:-8,national:-.9}],decline:['Reportaż ukazuje się bez komentarza','Sztab musi odpowiedzieć na trudne pytania.',{trust:-2,national:-.2}]}
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


const ATLAS_SHAPES=[
'245,48 336,51 350,126 301,158 229,123',
'352,54 468,50 508,117 451,162 351,130',
'475,58 563,86 592,169 503,198 452,163 510,121',
'119,175 207,121 296,162 278,243 188,265 112,228',
'284,247 355,199 451,164 484,250 405,303 317,290',
'489,255 540,208 602,216 581,327 505,352 408,306',
'34,237 108,234 185,268 184,348 93,362 43,313',
'160,56 238,48 222,125 117,173 64,146 89,79',
'191,350 285,293 407,309 439,386 326,412 215,393'
];
const ATLAS_CENTERS=[[286,100],[424,112],[536,137],[197,210],[378,251],[523,289],[106,298],[151,110],[312,356]];
let atlasSelected=0,staffMode=false;
function renderAtlas(){
 const svg=$('electionAtlas');if(!svg||!S)return;
 const canChoose=S.phase===1&&!S.done;
 svg.innerHTML=ATLAS_SHAPES.map((shape,i)=>{
  const p=pollRegion(i)[0],pos=ATLAS_CENTERS[i],selected=atlasSelected===i;
  return '<g role="button" tabindex="0" aria-label="'+esc(REGIONS[i].name)+', '+p.toFixed(1)+' procent poparcia" data-atlas-region="'+i+'">'+
  '<polygon class="territory '+(selected?'active':'')+'" points="'+shape+'"></polygon>'+
  '<text class="region-label" x="'+pos[0]+'" y="'+pos[1]+'">'+esc(REGIONS[i].name)+'</text>'+
  '<text class="region-pct" x="'+pos[0]+'" y="'+(pos[1]+17)+'">'+p.toFixed(1)+'%</text></g>';
 }).join('');
 const r=REGIONS[atlasSelected],votes=pollRegion(atlasSelected);
 const seatsEstimate=Math.max(1,Math.round(180*r.population/REGIONS.reduce((n,v)=>n+v.population,0)));
 $('atlasDetail').innerHTML='<strong>'+esc(r.name)+'</strong> · '+votes[0].toFixed(1)+'% Twojego poparcia · ok. '+seatsEstimate+' mandatów'+
 (canChoose?' <button class="btn alt" data-atlas-visit="'+atlasSelected+'" '+(S.money<700?'disabled':'')+'>Wyślij sztab (700 zł)</button>':' · Wybierz region na mapie');
}
function renderStaffDesk(){
 const target=$('staffDesk');if(!target||!S)return;ensureNarrative();
 const active=S.people.filter(p=>p.active);
 target.innerHTML='<h3 class="section-title">Gabinet kierownictwa</h3><p class="small">Rozmowy i podział obowiązków są osobną czynnością, nie zużywają tury. Każdy współpracownik może odbyć jedną rozmowę co 4 tygodnie.</p>'+
 active.map(p=>{
  const last=(S.staffTalks||{})[p.id],cooldown=Number.isInteger(last)&&S.week-last<4;
  return '<div class="staff-person"><strong>'+esc(p.name)+'</strong><small>'+esc(p.role)+' · lojalność '+p.loyalty+'/100</small>'+
   '<div class="loyalty-track"><div class="loyalty-fill" style="width:'+p.loyalty+'%"></div></div>'+
   '<div class="staff-controls"><button data-staff-talk="'+p.id+'" '+(cooldown?'disabled':'')+'>Porozmawiaj (−400 zł)</button>'+
   '<button data-staff-bonus="'+p.id+'" '+(cooldown||S.money<1800?'disabled':'')+'>Premia (−1800 zł)</button></div></div>';
 }).join('')+
 (S.people.some(p=>!p.active)?'<p class="small">Ze sztabu odeszli: '+S.people.filter(p=>!p.active).map(p=>esc(p.name)).join(', ')+'</p>':'');
}
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
 if(visit&&S&&S.phase===1&&!S.done&&S.money>=700){decide('region',Number(visit.dataset.atlasVisit));return;}
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
 if(!S.finance)S.finance={offices:Array(9).fill(0),sponsors:[],debt:0,arrears:0,crisis:0,lastWeek:-1,monthly:[],usedSponsorWeeks:[]};
 if(!Array.isArray(S.finance.offices)||S.finance.offices.length!==9)S.finance.offices=Array(9).fill(0);
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
  S.rivalAI={regional:Array.from({length:5},()=>Array(9).fill(0)),global:Array(5).fill(0),lastWeek:-1,news:[],pollHistory:[]};
 }
 return S.rivalAI;
}
function runRivals(){
 const ai=ensureRivals();if(ai.lastWeek===S.week)return;
 for(let j=0;j<5;j++){
  const index=Math.floor(rand()*9),tactic=RIVAL_TACTICS[Math.floor(rand()*RIVAL_TACTICS.length)];
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
function start(){const bases={economy:[16,24,17,15],social:[17,16,22,24],green:[24,17,17,15],freedom:[25,22,15,12]};S={name:$('partyName').value.trim().replace(/\s+/g,' ').slice(0,32)||'Nowy Kierunek',groups:[...bases[$('profile').value]],regional:Array(9).fill(0),difficulty:DIFFICULTY[$('difficulty')?.value]?$('difficulty').value:'normal',money:22000,trust:55,week:0,phase:0,seed:(Math.random()*2**32)>>>0,history:[],staff:[],recentTactics:[],diplomacy:0,arcs:{},people:CHARACTERS.map(x=>({...x,active:true})),used:[],selectedRegion:0,coalition:[],rivalAI:{regional:Array.from({length:5},()=>Array(9).fill(0)),global:Array(5).fill(0),lastWeek:-1,news:[],pollHistory:[]},finance:{offices:Array(9).fill(0),sponsors:[],debt:0,arrears:0,crisis:0,lastWeek:-1,monthly:[],usedSponsorWeeks:[]},done:false};show('game');render()}
function eventCost(o){return typeof o[1]==='object'&&!Array.isArray(o[1])?Math.max(0,-(o[1].budget||0)):o[3]}
function eventForWeek(){const narrative=storyForWeek();if(narrative)return narrative;const data=window.WYBORY_DATA;if(data?.milestones?.[S.week])return data.milestones[S.week];const p=data?.pool;if(p?.length){return p[((S.seed>>>0)+S.week*17)%p.length]}return EVENT_POOL[S.week%EVENT_POOL.length]}
function render(){if(!S)return;const n=national();$('weekLabel').textContent='TYDZIEŃ '+(S.week+1)+' / 30 · '+CHAPTERS[Math.min(5,Math.floor(S.week/5))];$('campaignTitle').textContent=S.name;$('support').textContent=n[0].toFixed(1)+'%';$('money').textContent=safeNum(S.money)+' zł';$('trust').textContent=S.trust+'/100';$('left').textContent=(30-S.week)+' tyg.';if($('characterRoster'))$('characterRoster').innerHTML=characterCards();renderStaffDesk();renderAtlas();if($('rivalDesk'))$('rivalDesk').innerHTML=rivalPanel();if($('forecastDesk'))$('forecastDesk').innerHTML=forecastPanel();if($('financeDesk'))$('financeDesk').innerHTML=financePanel();if($('weekProgress'))$('weekProgress').style.width=(((S.week+1)/30)*100).toFixed(2)+'%';$('phase').textContent=['ETAP I · DEPESZA REDAKCYJNA','ETAP II · REGIONY','ETAP III · SZTAB','ETAP IV · PLAN STRATEGICZNY'][S.phase];$('feedback').classList.add('hidden');$('next').classList.add('hidden');$('history').innerHTML=S.history.slice(0,12).map(x=>'<li>'+esc(x)+'</li>').join('')||'<li>Sztab rozpoczyna pracę.</li>';$('poll').innerHTML=n.map((v,i)=>'<div class="poll-item"><div class="poll-label"><span>'+esc(names()[i])+'</span><b>'+v.toFixed(1)+'%</b></div><div class="bar"><div class="barfill '+(i===0?'you':'')+'" style="width:'+v.toFixed(1)+'%"></div></div></div>').join('');$('groups').innerHTML=REGIONS.map((r,i)=>'<div class="group"><span>'+esc(r.name)+'</span><b>'+pollRegion(i)[0].toFixed(1)+'%</b></div>').join('');$('groups').innerHTML+='<div class="paper-banner">MAPA POPARCIA • 9 REGIONÓW</div><div class="map-tiles">'+REGIONS.map((r,i)=>'<div class="map-tile"><strong>'+esc(r.name)+'</strong><span>'+pollRegion(i)[0].toFixed(1)+'% · '+Math.round(180*r.population/REGIONS.reduce((n,x)=>n+x.population,0))+' mand.</span></div>').join('')+'</div>';if(S.phase===0){let e=eventForWeek();$('eventTitle').textContent=e.title||e[0];$('eventText').textContent=e.body||e[1];const opts=e.options||e[2];$('choices').innerHTML=opts.map((o,i)=>'<button class="option" data-kind="event" data-i="'+i+'" '+(eventCost(o)>S.money?'disabled':'')+'><strong>'+esc(o[0])+'</strong><small>Koszt: '+safeNum(eventCost(o))+' zł</small></button>').join('')+(opts.every(o=>eventCost(o)>S.money)?'<button class="option" data-kind="event" data-i="99"><strong>Awaryjny dyżur wolontariuszy</strong><small>Bez kosztów</small></button>':'')}else if(S.phase===1){$('eventTitle').textContent='Gdzie wysłać działaczy?';$('eventText').textContent='Wybierz region, w którym odbędzie się spotkanie. Każdy region ma inną wagę w wyborach.';$('choices').innerHTML=REGIONS.map((r,i)=>'<button class="option" data-kind="region" data-i="'+i+'" '+(S.money<700?'disabled':'')+'><strong>'+esc(r.name)+'</strong><small>Poparcie: '+pollRegion(i)[0].toFixed(1)+'% · Koszt: 700 zł</small></button>').join('')+(S.money<700?'<button class="option" data-kind="region" data-i="9"><strong>Bez wyjazdu</strong><small>Brak środków na podróż</small></button>':'')}else if(S.phase===2){$('eventTitle').textContent='Decyzja sztabu';$('eventText').textContent='Wybierz jedno działanie ogólnokrajowe. Możesz też zbierać fundusze.';$('choices').innerHTML=ACTIONS.map((a,i)=>'<button class="option" data-kind="action" data-i="'+i+'" '+(S.money<a[1]?'disabled':'')+'><strong>'+esc(a[0])+'</strong><small>'+esc(a[4])+' · '+(a[1]<0?'+':'−')+safeNum(Math.abs(a[1]))+' zł</small></button>').join('')}if(S.phase===2&&S.staff.length<3){
 $('choices').innerHTML+='<h3 class="section-title">Zatrudnij eksperta zamiast reklamy</h3>'+
 STAFF_ROLES.map((a,i)=>S.staff.includes(a.id)?'':'<button class="option" data-kind="hire" data-i="'+i+'" '+(S.money<3200?'disabled':'')+'><strong>'+esc(a.name)+'</strong><small>'+esc(a.desc)+' · jednorazowo 3 200 zł</small></button>').join('');
}if(S.phase===3){
 $('eventTitle').textContent='Plan na nadchodzące dni';$('eventText').textContent='Podejmij jedną dodatkową decyzję strategiczną. Jej konsekwencje mogą wpłynąć na regiony, budżet lub przyszłą koalicję.';
 $('choices').innerHTML=TACTICS.map((a,i)=>'<button class="option" data-kind="tactic" data-i="'+i+'" '+(S.money<a.cost?'disabled':'')+'><strong>'+esc(a.name)+'</strong><small>'+esc(a.desc)+' · koszt: '+safeNum(a.cost)+' zł</small></button>').join('');
}if(S.phase===4)renderBroadcast();if(S.done){$('choices').innerHTML='';$('eventTitle').textContent='Numer tygodnia zamknięty';$('eventText').textContent='Wszystkie decyzje z tego tygodnia zostały podjęte. Możesz przejść do kolejnego numeru gazety.';$('next').textContent=S.week===29?'Otwórz urny wyborcze →':'Następny tydzień →';$('next').classList.remove('hidden');}
}
function decide(kind,index){if(!S||S.done)return;if(kind==='broadcast'&&S.phase===4){decideBroadcast(index);return;}if(kind==='event'&&S.phase===0){const e=eventForWeek(),opts=e.options||e[2],o=opts[index];if(index===99&&opts.every(x=>eventCost(x)>S.money)){apply([0,0,0,0],-1,0);log('Doraźna akcja wolontariuszy')}else{if(!o||eventCost(o)>S.money)return;if(e.options){if(e.arc||e.person)applyNarrative(index,e);const v=o[1];S.money+=v.budget||0;S.trust=clamp(S.trust+(v.trust||0),0,100);S.groups=S.groups.map(x=>clamp(x+((v.national||0)+(S.staff?.includes('press')?.25:0))*(.85+S.trust/300)*(.86+(S.people?.filter(p=>p.active).length||4)*.035),3,70));S.regional=S.regional.map(x=>clamp(x+(v.org||0)/12,0,30))}else{apply(o[1],o[2],o[3])}log((e.title||e[0])+' — '+o[0])}if(broadcastForWeek())startBroadcast();else S.phase=1;render();if(S.phase===4)renderBroadcast();else{$('feedback').textContent='Korespondent: decyzja odnotowana w gazetach.';$('feedback').classList.remove('hidden');}$('feedback').classList.remove('hidden')}else if(kind==='region'&&S.phase===1){if(index!==9){if(!REGIONS[index]||S.money<700)return;apply([0,0,0,0],1,700,index);S.selectedRegion=index;log('Spotkanie w regionie '+REGIONS[index].name)}else{if(S.money>=700)return;log('Brak środków na wyjazd')}S.phase=2;render()}else if(kind==='hire'&&S.phase===2){
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
 if(tactic.local&&Number.isInteger(S.selectedRegion)&&S.selectedRegion>=0&&S.selectedRegion<9)S.regional[S.selectedRegion]=clamp(S.regional[S.selectedRegion]+tactic.local,0,30);
 log('Strategia: '+tactic.name);
 S.done=true;render();$('feedback').textContent='Plan strategiczny zakończony. Przed wyborami pozostało '+(30-S.week)+' tygodni.';$('feedback').classList.remove('hidden');
}}
function next(){if(!S||!S.done)return;if(S.week===29){finish();return}ensureNarrative();for(const p of S.people.filter(x=>x.active)){const pressure=(S.money<2500?2:0)+(S.trust<42?1:0)+(S.week>=13?1:0);p.loyalty=clamp(p.loyalty-pressure+(S.staff.length>=2?1:0),0,100);}S.week++;weeklyAccounts();auditSponsors();runRivals();S.phase=0;S.done=false;render();document.querySelector('.article').scrollIntoView({behavior:'smooth'})}
function finish(){const n=national(),result=seats(),order=result.map((v,i)=>({i,v})).sort((a,b)=>b.v-a.v);$('outcome').textContent=order[0].i===0?'Zwycięstwo wyborcze!':'Werdykt wyborców';$('resultPct').textContent=n[0].toFixed(1)+'%';$('resultText').textContent=S.name+' zdobywa '+result[0]+' ze 180 mandatów. Do większości potrzeba 91 mandatów.';$('finalPoll').innerHTML=result.map((v,i)=>'<div class="poll-item"><div class="poll-label"><span>'+esc(names()[i])+'</span><b>'+v+' mandatów · '+n[i].toFixed(1)+'%</b></div><div class="bar"><div class="barfill '+(i===0?'you':'')+'" style="width:'+(v/180*100).toFixed(1)+'%"></div></div></div>').join('');$('coalitionButton').classList.toggle('hidden',result[0]===0);show('end');renderEpilogue()}
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
 const i=co.selected,p=RIVALS[i],diff=Math.abs((PROGRAM_AXIS[$('profile').value]??2)-POLITICAL_AXIS[i]),result=seats();
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
async function importSave(input){const file=input.files?.[0];if(!file)return;try{if(file.size>1000000)throw Error('Plik zbyt duży');const o=JSON.parse(await file.text()),s=o.state;if(o.format!=='wybory2040-save'||!s||!Array.isArray(s.groups)||s.groups.length!==4||!Array.isArray(s.regional)||s.regional.length!==9||!Number.isInteger(s.week)||s.week<0||s.week>29||![0,1,2,3,4].includes(s.phase)||typeof s.name!=='string'||s.name.length>32||!Number.isFinite(s.money)||!Number.isFinite(s.trust)||!Array.isArray(s.history))throw Error('Nieprawidłowy zapis');S={...s,difficulty:DIFFICULTY[s.difficulty]?s.difficulty:'normal',name:s.name.slice(0,32),history:s.history.slice(0,90),done:Boolean(s.done),staff:Array.isArray(s.staff)?s.staff.filter(id=>STAFF_ROLES.some(r=>r.id===id)).slice(0,3):[]};ensureNarrative();initFinance();ensureRivals();show('game');render();$('saveInfo').textContent='Wczytano tydzień '+(S.week+1)}catch(e){$('saveInfo').textContent='Błąd zapisu: '+e.message}finally{input.value=''}}
$('start').addEventListener('click',start);$('restart').addEventListener('click',reset);$('playAgain').addEventListener('click',reset);$('next').addEventListener('click',next);$('choices').addEventListener('click',e=>{const b=e.target.closest('button[data-kind]');if(b&&!b.disabled)decide(b.dataset.kind,Number(b.dataset.i))});$('coalitionButton').addEventListener('click',coalition);$('partners').addEventListener('click',coalitionClick);$('backResults').addEventListener('click',()=>show('end'));$('share').addEventListener('click',async()=>{if(!S)return;const msg='WYBORY2040: '+S.name+' zdobywa '+seats()[0]+' mandatów!';try{await navigator.clipboard.writeText(msg);$('copyStatus').textContent='Wynik skopiowany.'}catch{$('copyStatus').textContent=msg}});

$('exportSave').addEventListener('click',exportSave);$('importSave').addEventListener('change',e=>importSave(e.target));
$('resumeFile').addEventListener('change',e=>importSave(e.target));
