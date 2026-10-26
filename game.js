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

let S=null;
function safeNum(n){return Math.round(n).toLocaleString('pl-PL')}
function rand(){S.seed=(Math.imul(S.seed,1664525)+1013904223)>>>0;return S.seed/4294967296}
function regionStrength(region){return WEIGHTS.reduce((a,w,i)=>a+w*S.groups[i]*region.traits[i],0)+S.regional[REGIONS.indexOf(region)]}
function pollRegion(i){const reg=REGIONS[i],ours=Math.max(1,regionStrength(reg)),rivals=RIVALS.map((r,j)=>r.base*(.8+WEIGHTS.reduce((a,w,k)=>a+w*r.lean[k]*reg.traits[k],0)*.2)+(j===0?2*Math.sin(S.week/3+i):j===1?Math.cos(i+S.week/4):0));const total=ours+rivals.reduce((a,b)=>a+b,0);return [ours,...rivals].map(v=>Math.max(0,v/total*100))}
function national(){let a=Array(6).fill(0),population=REGIONS.reduce((x,r)=>x+r.population,0);REGIONS.forEach((r,i)=>pollRegion(i).forEach((v,j)=>a[j]+=v*r.population/population));return a}
function allocate(total,proportions,eligible){const votes=proportions.map((v,i)=>eligible[i]?v:0),seats=Array(votes.length).fill(0);for(let i=0;i<total;i++){let pick=-1,best=-1;votes.forEach((v,j)=>{if(v<=0)return;const val=v/(seats[j]+1);if(val>best){best=val;pick=j}});if(pick>=0)seats[pick]++}return seats}
function names(){return [S.name,...RIVALS.map(v=>v.name)]}
function seats(){let sum=Array(6).fill(0);const eligible=national().map(v=>v>=5),popTotal=REGIONS.reduce((a,r)=>a+r.population,0),exact=REGIONS.map(r=>180*r.population/popTotal),counts=exact.map(Math.floor);for(let i=180-counts.reduce((a,b)=>a+b,0);i>0;i--){let idx=exact.map((v,j)=>({j,rem:v-counts[j]})).sort((a,b)=>b.rem-a.rem)[0].j;counts[idx]++}REGIONS.forEach((r,i)=>allocate(counts[i],pollRegion(i),eligible).forEach((n,j)=>sum[j]+=n));return sum}
function show(id){['setup','game','end','coalition'].forEach(k=>$(k).classList.toggle('hidden',k!==id));window.scrollTo(0,0)}
function apply(d,t,c,region){const factor=.85+S.trust/300;S.groups=S.groups.map((v,i)=>clamp(v+d[i]*factor,3,70));S.trust=clamp(S.trust+t,0,100);S.money-=c;if(region!==undefined)S.regional[region]=clamp(S.regional[region]+1.7+(S.staff?.includes('field')?.8:0),0,30)}
function log(text){S.history.unshift('TYDZIEŃ '+(S.week+1)+': '+text);if(S.history.length>90)S.history.length=90}
function start(){const bases={economy:[16,24,17,15],social:[17,16,22,24],green:[24,17,17,15],freedom:[25,22,15,12]};S={name:$('partyName').value.trim().replace(/\s+/g,' ').slice(0,32)||'Nowy Kierunek',groups:[...bases[$('profile').value]],regional:Array(9).fill(0),money:22000,trust:55,week:0,phase:0,seed:(Math.random()*2**32)>>>0,history:[],staff:[],diplomacy:0,arcs:{},people:CHARACTERS.map(x=>({...x,active:true})),used:[],selectedRegion:0,coalition:[],done:false};show('game');render()}
function eventCost(o){return typeof o[1]==='object'&&!Array.isArray(o[1])?Math.max(0,-(o[1].budget||0)):o[3]}
function eventForWeek(){const narrative=storyForWeek();if(narrative)return narrative;const data=window.WYBORY_DATA;if(data?.milestones?.[S.week])return data.milestones[S.week];const p=data?.pool;if(p?.length){return p[((S.seed>>>0)+S.week*17)%p.length]}return EVENT_POOL[S.week%EVENT_POOL.length]}
function render(){if(!S)return;const n=national();$('weekLabel').textContent='TYDZIEŃ '+(S.week+1)+' / 30 · '+CHAPTERS[Math.min(5,Math.floor(S.week/5))];$('campaignTitle').textContent=S.name;$('support').textContent=n[0].toFixed(1)+'%';$('money').textContent=safeNum(S.money)+' zł';$('trust').textContent=S.trust+'/100';$('left').textContent=(30-S.week)+' tyg.';if($('characterRoster'))$('characterRoster').innerHTML=characterCards();if($('weekProgress'))$('weekProgress').style.width=(((S.week+1)/30)*100).toFixed(2)+'%';$('phase').textContent=['ETAP I · DEPESZA REDAKCYJNA','ETAP II · REGIONY','ETAP III · SZTAB','ETAP IV · PLAN STRATEGICZNY'][S.phase];$('feedback').classList.add('hidden');$('next').classList.add('hidden');$('history').innerHTML=S.history.slice(0,12).map(x=>'<li>'+esc(x)+'</li>').join('')||'<li>Sztab rozpoczyna pracę.</li>';$('poll').innerHTML=n.map((v,i)=>'<div class="poll-item"><div class="poll-label"><span>'+esc(names()[i])+'</span><b>'+v.toFixed(1)+'%</b></div><div class="bar"><div class="barfill '+(i===0?'you':'')+'" style="width:'+v.toFixed(1)+'%"></div></div></div>').join('');$('groups').innerHTML=REGIONS.map((r,i)=>'<div class="group"><span>'+esc(r.name)+'</span><b>'+pollRegion(i)[0].toFixed(1)+'%</b></div>').join('');$('groups').innerHTML+='<div class="paper-banner">MAPA POPARCIA • 9 REGIONÓW</div><div class="map-tiles">'+REGIONS.map((r,i)=>'<div class="map-tile"><strong>'+esc(r.name)+'</strong><span>'+pollRegion(i)[0].toFixed(1)+'% · '+Math.round(180*r.population/REGIONS.reduce((n,x)=>n+x.population,0))+' mand.</span></div>').join('')+'</div>';if(S.phase===0){let e=eventForWeek();$('eventTitle').textContent=e.title||e[0];$('eventText').textContent=e.body||e[1];const opts=e.options||e[2];$('choices').innerHTML=opts.map((o,i)=>'<button class="option" data-kind="event" data-i="'+i+'" '+(eventCost(o)>S.money?'disabled':'')+'><strong>'+esc(o[0])+'</strong><small>Koszt: '+safeNum(eventCost(o))+' zł</small></button>').join('')+(opts.every(o=>eventCost(o)>S.money)?'<button class="option" data-kind="event" data-i="99"><strong>Awaryjny dyżur wolontariuszy</strong><small>Bez kosztów</small></button>':'')}else if(S.phase===1){$('eventTitle').textContent='Gdzie wysłać działaczy?';$('eventText').textContent='Wybierz region, w którym odbędzie się spotkanie. Każdy region ma inną wagę w wyborach.';$('choices').innerHTML=REGIONS.map((r,i)=>'<button class="option" data-kind="region" data-i="'+i+'" '+(S.money<700?'disabled':'')+'><strong>'+esc(r.name)+'</strong><small>Poparcie: '+pollRegion(i)[0].toFixed(1)+'% · Koszt: 700 zł</small></button>').join('')+(S.money<700?'<button class="option" data-kind="region" data-i="9"><strong>Bez wyjazdu</strong><small>Brak środków na podróż</small></button>':'')}else if(S.phase===2){$('eventTitle').textContent='Decyzja sztabu';$('eventText').textContent='Wybierz jedno działanie ogólnokrajowe. Możesz też zbierać fundusze.';$('choices').innerHTML=ACTIONS.map((a,i)=>'<button class="option" data-kind="action" data-i="'+i+'" '+(S.money<a[1]?'disabled':'')+'><strong>'+esc(a[0])+'</strong><small>'+esc(a[4])+' · '+(a[1]<0?'+':'−')+safeNum(Math.abs(a[1]))+' zł</small></button>').join('')}if(S.phase===2&&S.staff.length<3){
 $('choices').innerHTML+='<h3 class="section-title">Zatrudnij eksperta zamiast reklamy</h3>'+
 STAFF_ROLES.map((a,i)=>S.staff.includes(a.id)?'':'<button class="option" data-kind="hire" data-i="'+i+'" '+(S.money<3200?'disabled':'')+'><strong>'+esc(a.name)+'</strong><small>'+esc(a.desc)+' · jednorazowo 3 200 zł</small></button>').join('');
}if(S.phase===3){
 $('eventTitle').textContent='Plan na nadchodzące dni';$('eventText').textContent='Podejmij jedną dodatkową decyzję strategiczną. Jej konsekwencje mogą wpłynąć na regiony, budżet lub przyszłą koalicję.';
 $('choices').innerHTML=TACTICS.map((a,i)=>'<button class="option" data-kind="tactic" data-i="'+i+'" '+(S.money<a.cost?'disabled':'')+'><strong>'+esc(a.name)+'</strong><small>'+esc(a.desc)+' · koszt: '+safeNum(a.cost)+' zł</small></button>').join('');
}if(S.done){$('choices').innerHTML='';$('eventTitle').textContent='Numer tygodnia zamknięty';$('eventText').textContent='Wszystkie decyzje z tego tygodnia zostały podjęte. Możesz przejść do kolejnego numeru gazety.';$('next').textContent=S.week===29?'Otwórz urny wyborcze →':'Następny tydzień →';$('next').classList.remove('hidden');}
}
function decide(kind,index){if(!S||S.done)return;if(kind==='event'&&S.phase===0){const e=eventForWeek(),opts=e.options||e[2],o=opts[index];if(index===99&&opts.every(x=>eventCost(x)>S.money)){apply([0,0,0,0],-1,0);log('Doraźna akcja wolontariuszy')}else{if(!o||eventCost(o)>S.money)return;if(e.options){if(e.arc||e.person)applyNarrative(index,e);const v=o[1];S.money+=v.budget||0;S.trust=clamp(S.trust+(v.trust||0),0,100);S.groups=S.groups.map(x=>clamp(x+((v.national||0)+(S.staff?.includes('press')?.25:0))*(.85+S.trust/300)*(.86+(S.people?.filter(p=>p.active).length||4)*.035),3,70));S.regional=S.regional.map(x=>clamp(x+(v.org||0)/12,0,30))}else{apply(o[1],o[2],o[3])}log((e.title||e[0])+' — '+o[0])}S.phase=1;render();$('feedback').textContent='Korespondent: decyzja odnotowana w gazetach.';$('feedback').classList.remove('hidden')}else if(kind==='region'&&S.phase===1){if(index!==9){if(!REGIONS[index]||S.money<700)return;apply([0,0,0,0],1,700,index);S.selectedRegion=index;log('Spotkanie w regionie '+REGIONS[index].name)}else{if(S.money>=700)return;log('Brak środków na wyjazd')}S.phase=2;render()}else if(kind==='hire'&&S.phase===2){
 const person=STAFF_ROLES[index];if(!person||S.staff.includes(person.id)||S.staff.length>=3||S.money<3200)return;
 S.money-=3200;S.staff.push(person.id);S.trust=clamp(S.trust+1,0,100);
 log('Zatrudniono: '+person.name+'.');
 S.phase=3;render();
 }else if(kind==='action'&&S.phase===2){const a=ACTIONS[index];if(!a||S.money<a[1])return;apply(S.staff?.includes('polls')?a[2].map(v=>v>0?v+.25:v):a[2],a[3],a[1]);ensureNarrative();if(index===2){for(const p of S.people.filter(x=>x.active))p.loyalty=clamp(p.loyalty-2,0,100);}else if(index===1){for(const p of S.people.filter(x=>x.active))p.loyalty=clamp(p.loyalty+2,0,100);}log('Akcja sztabu — '+a[0]);S.phase=3;render();}else if(kind==='tactic'&&S.phase===3){
 const tactic=TACTICS[index];if(!tactic||S.money<tactic.cost)return;
 S.money-=tactic.cost;S.money+=tactic.budget||0;S.diplomacy=clamp((S.diplomacy||0)+tactic.diplomacy,0,30);
 apply(tactic.delta,tactic.trust,0);
 if(tactic.local&&Number.isInteger(S.selectedRegion)&&S.selectedRegion>=0&&S.selectedRegion<9)S.regional[S.selectedRegion]=clamp(S.regional[S.selectedRegion]+tactic.local,0,30);
 log('Strategia: '+tactic.name);
 S.done=true;render();$('feedback').textContent='Plan strategiczny zakończony. Przed wyborami pozostało '+(30-S.week)+' tygodni.';$('feedback').classList.remove('hidden');
}}
function next(){if(!S||!S.done)return;if(S.week===29){finish();return}ensureNarrative();for(const p of S.people.filter(x=>x.active)){const pressure=(S.money<2500?2:0)+(S.trust<42?1:0)+(S.week>=13?1:0);p.loyalty=clamp(p.loyalty-pressure+(S.staff.length>=2?1:0),0,100);}S.week++;const dues=1400+(S.staff?.includes('finance')?550:0);S.money+=dues;log('Regularne wpłaty członkowskie: +'+dues.toLocaleString('pl-PL')+' zł');S.phase=0;S.done=false;render();document.querySelector('.article').scrollIntoView({behavior:'smooth'})}
function finish(){const n=national(),result=seats(),order=result.map((v,i)=>({i,v})).sort((a,b)=>b.v-a.v);$('outcome').textContent=order[0].i===0?'Zwycięstwo wyborcze!':'Werdykt wyborców';$('resultPct').textContent=n[0].toFixed(1)+'%';$('resultText').textContent=S.name+' zdobywa '+result[0]+' ze 180 mandatów. Do większości potrzeba 91 mandatów.';$('finalPoll').innerHTML=result.map((v,i)=>'<div class="poll-item"><div class="poll-label"><span>'+esc(names()[i])+'</span><b>'+v+' mandatów · '+n[i].toFixed(1)+'%</b></div><div class="bar"><div class="barfill '+(i===0?'you':'')+'" style="width:'+(v/180*100).toFixed(1)+'%"></div></div></div>').join('');$('coalitionButton').classList.toggle('hidden',result[0]===0);show('end')}
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
async function importSave(input){const file=input.files?.[0];if(!file)return;try{if(file.size>1000000)throw Error('Plik zbyt duży');const o=JSON.parse(await file.text()),s=o.state;if(o.format!=='wybory2040-save'||!s||!Array.isArray(s.groups)||s.groups.length!==4||!Array.isArray(s.regional)||s.regional.length!==9||!Number.isInteger(s.week)||s.week<0||s.week>29||![0,1,2,3].includes(s.phase)||typeof s.name!=='string'||s.name.length>32||!Number.isFinite(s.money)||!Number.isFinite(s.trust)||!Array.isArray(s.history))throw Error('Nieprawidłowy zapis');S={...s,name:s.name.slice(0,32),history:s.history.slice(0,90),done:Boolean(s.done),staff:Array.isArray(s.staff)?s.staff.filter(id=>STAFF_ROLES.some(r=>r.id===id)).slice(0,3):[]};ensureNarrative();show('game');render();$('saveInfo').textContent='Wczytano tydzień '+(S.week+1)}catch(e){$('saveInfo').textContent='Błąd zapisu: '+e.message}finally{input.value=''}}
$('start').addEventListener('click',start);$('restart').addEventListener('click',reset);$('playAgain').addEventListener('click',reset);$('next').addEventListener('click',next);$('choices').addEventListener('click',e=>{const b=e.target.closest('button[data-kind]');if(b&&!b.disabled)decide(b.dataset.kind,Number(b.dataset.i))});$('coalitionButton').addEventListener('click',coalition);$('partners').addEventListener('click',coalitionClick);$('backResults').addEventListener('click',()=>show('end'));$('share').addEventListener('click',async()=>{if(!S)return;const msg='WYBORY2040: '+S.name+' zdobywa '+seats()[0]+' mandatów!';try{await navigator.clipboard.writeText(msg);$('copyStatus').textContent='Wynik skopiowany.'}catch{$('copyStatus').textContent=msg}});

$('exportSave').addEventListener('click',exportSave);$('importSave').addEventListener('change',e=>importSave(e.target));
$('resumeFile').addEventListener('change',e=>importSave(e.target));
