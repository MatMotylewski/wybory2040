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
let S=null;
function safeNum(n){return Math.round(n).toLocaleString('pl-PL')}
function rand(){S.seed=(Math.imul(S.seed,1664525)+1013904223)>>>0;return S.seed/4294967296}
function regionStrength(region){return WEIGHTS.reduce((a,w,i)=>a+w*S.groups[i]*region.traits[i],0)+S.regional[REGIONS.indexOf(region)]}
function pollRegion(i){const reg=REGIONS[i],ours=Math.max(1,regionStrength(reg)),rivals=RIVALS.map((r,j)=>r.base*(.8+WEIGHTS.reduce((a,w,k)=>a+w*r.lean[k]*reg.traits[k],0)*.2)+(j===0?2*Math.sin(S.week/3+i):j===1?Math.cos(i+S.week/4):0));const total=ours+rivals.reduce((a,b)=>a+b,0);return [ours,...rivals].map(v=>Math.max(0,v/total*100))}
function national(){let a=Array(6).fill(0),population=REGIONS.reduce((x,r)=>x+r.population,0);REGIONS.forEach((r,i)=>pollRegion(i).forEach((v,j)=>a[j]+=v*r.population/population));return a}
function allocate(total,proportions){const votes=proportions.map(v=>v>=5?v:0),seats=Array(votes.length).fill(0);for(let i=0;i<total;i++){let pick=0,best=-1;votes.forEach((v,j)=>{const val=v/(seats[j]+1);if(val>best){best=val;pick=j}});seats[pick]++}return seats}
function names(){return [S.name,...RIVALS.map(v=>v.name)]}
function seats(){let sum=Array(6).fill(0);const popTotal=REGIONS.reduce((a,r)=>a+r.population,0),exact=REGIONS.map(r=>180*r.population/popTotal),counts=exact.map(Math.floor);for(let i=180-counts.reduce((a,b)=>a+b,0);i>0;i--){let idx=exact.map((v,j)=>({j,rem:v-counts[j]})).sort((a,b)=>b.rem-a.rem)[0].j;counts[idx]++}REGIONS.forEach((r,i)=>allocate(counts[i],pollRegion(i)).forEach((n,j)=>sum[j]+=n));return sum}
function show(id){['setup','game','end','coalition'].forEach(k=>$(k).classList.toggle('hidden',k!==id));window.scrollTo(0,0)}
function apply(d,t,c,region){const factor=.85+S.trust/300;S.groups=S.groups.map((v,i)=>clamp(v+d[i]*factor,3,70));S.trust=clamp(S.trust+t,0,100);S.money-=c;if(region!==undefined)S.regional[region]=clamp(S.regional[region]+1.7,0,30)}
function log(text){S.history.unshift('TYDZIEŃ '+(S.week+1)+': '+text);if(S.history.length>90)S.history.length=90}
function start(){const bases={economy:[16,24,17,15],social:[17,16,22,24],green:[24,17,17,15],freedom:[25,22,15,12]};S={name:$('partyName').value.trim().replace(/\s+/g,' ').slice(0,32)||'Nowy Kierunek',groups:[...bases[$('profile').value]],regional:Array(9).fill(0),money:22000,trust:55,week:0,phase:0,seed:(Math.random()*2**32)>>>0,history:[],used:[],selectedRegion:0,coalition:[],done:false};show('game');render()}
function eventForWeek(){return EVENT_POOL[S.week%EVENT_POOL.length]}
function render(){if(!S)return;const n=national();$('weekLabel').textContent='TYDZIEŃ '+(S.week+1)+' / 30 · '+CHAPTERS[Math.min(5,Math.floor(S.week/5))];$('campaignTitle').textContent=S.name;$('support').textContent=n[0].toFixed(1)+'%';$('money').textContent=safeNum(S.money)+' zł';$('trust').textContent=S.trust+'/100';$('left').textContent=(30-S.week)+' tyg.';$('phase').textContent=['ETAP I · DEPESZA REDAKCYJNA','ETAP II · REGIONY','ETAP III · SZTAB'][S.phase];$('feedback').classList.add('hidden');$('next').classList.add('hidden');$('history').innerHTML=S.history.slice(0,12).map(x=>'<li>'+esc(x)+'</li>').join('')||'<li>Sztab rozpoczyna pracę.</li>';$('poll').innerHTML=n.map((v,i)=>'<div class="poll-item"><div class="poll-label"><span>'+esc(names()[i])+'</span><b>'+v.toFixed(1)+'%</b></div><div class="bar"><div class="barfill '+(i===0?'you':'')+'" style="width:'+v.toFixed(1)+'%"></div></div></div>').join('');$('groups').innerHTML=REGIONS.map((r,i)=>'<div class="group"><span>'+esc(r.name)+'</span><b>'+pollRegion(i)[0].toFixed(1)+'%</b></div>').join('');if(S.phase===0){let e=eventForWeek();$('eventTitle').textContent=e[0];$('eventText').textContent=e[1];$('choices').innerHTML=e[2].map((o,i)=>'<button class="option" data-kind="event" data-i="'+i+'" '+(o[3]>S.money?'disabled':'')+'><strong>'+esc(o[0])+'</strong><small>Koszt: '+safeNum(o[3])+' zł</small></button>').join('')+(e[2].every(o=>o[3]>S.money)?'<button class="option" data-kind="event" data-i="99"><strong>Awaryjny dyżur wolontariuszy</strong><small>Bez kosztów</small></button>':'')}else if(S.phase===1){$('eventTitle').textContent='Gdzie wysłać działaczy?';$('eventText').textContent='Wybierz region, w którym odbędzie się spotkanie. Każdy region ma inną wagę w wyborach.';$('choices').innerHTML=REGIONS.map((r,i)=>'<button class="option" data-kind="region" data-i="'+i+'" '+(S.money<700?'disabled':'')+'><strong>'+esc(r.name)+'</strong><small>Poparcie: '+pollRegion(i)[0].toFixed(1)+'% · Koszt: 700 zł</small></button>').join('')+(S.money<700?'<button class="option" data-kind="region" data-i="9"><strong>Bez wyjazdu</strong><small>Brak środków na podróż</small></button>':'')}else if(S.phase===2){$('eventTitle').textContent='Decyzja sztabu';$('eventText').textContent='Wybierz jedno działanie ogólnokrajowe. Możesz też zbierać fundusze.';$('choices').innerHTML=ACTIONS.map((a,i)=>'<button class="option" data-kind="action" data-i="'+i+'" '+(S.money<a[1]?'disabled':'')+'><strong>'+esc(a[0])+'</strong><small>'+esc(a[4])+' · '+(a[1]<0?'+':'−')+safeNum(Math.abs(a[1]))+' zł</small></button>').join('')}}
function decide(kind,index){if(!S||S.done)return;if(kind==='event'&&S.phase===0){const e=eventForWeek(),o=e[2][index];if(index===99&&e[2].every(x=>x[3]>S.money)){apply([0,0,0,0],-1,0);log('Doraźna akcja wolontariuszy')}else{if(!o||o[3]>S.money)return;apply(o[1],o[2],o[3]);log(e[0]+' — '+o[0])}S.phase=1;render();$('feedback').textContent='Korespondent: decyzja odnotowana w gazetach.';$('feedback').classList.remove('hidden')}else if(kind==='region'&&S.phase===1){if(index!==9){if(!REGIONS[index]||S.money<700)return;apply([0,0,0,0],1,700,index);log('Spotkanie w regionie '+REGIONS[index].name)}else{if(S.money>=700)return;log('Brak środków na wyjazd')}S.phase=2;render()}else if(kind==='action'&&S.phase===2){const a=ACTIONS[index];if(!a||S.money<a[1])return;apply(a[2],a[3],a[1]);log('Akcja sztabu — '+a[0]);S.done=true;render();$('choices').innerHTML='';$('eventTitle').textContent='Numer tygodnia zamknięty';$('eventText').textContent='Sondaże i rachunki zaktualizowane. Możesz przejść do następnego tygodnia.';$('next').textContent=S.week===29?'Otwórz urny wyborcze →':'Następny tydzień →';$('next').classList.remove('hidden');$('feedback').textContent='Kolejny numer gazety już w drukarni.';$('feedback').classList.remove('hidden')}}
function next(){if(!S||!S.done)return;if(S.week===29){finish();return}S.week++;S.money+=1400;log('Regularne wpłaty członkowskie: +1 400 zł');S.phase=0;S.done=false;render();document.querySelector('.article').scrollIntoView({behavior:'smooth'})}
function finish(){const n=national(),result=seats(),order=result.map((v,i)=>({i,v})).sort((a,b)=>b.v-a.v);$('outcome').textContent=order[0].i===0?'Zwycięstwo wyborcze!':'Werdykt wyborców';$('resultPct').textContent=n[0].toFixed(1)+'%';$('resultText').textContent=S.name+' zdobywa '+result[0]+' ze 180 mandatów. Do większości potrzeba 91 mandatów.';$('finalPoll').innerHTML=result.map((v,i)=>'<div class="poll-item"><div class="poll-label"><span>'+esc(names()[i])+'</span><b>'+v+' mandatów · '+n[i].toFixed(1)+'%</b></div><div class="bar"><div class="barfill '+(i===0?'you':'')+'" style="width:'+(v/180*100).toFixed(1)+'%"></div></div></div>').join('');$('coalitionButton').classList.toggle('hidden',result[0]===0);show('end')}
function coalition(){const result=seats();$('coalitionSeats').textContent=result[0]+' / 91 mandatów';$('coalitionDesc').textContent='Wybierz partie do rozmów. Porozumienie wymaga co najmniej 91 mandatów, lecz nie każdy sojusz będzie możliwy.';$('partners').innerHTML=RIVALS.map((r,i)=>'<label class="group"><span><input type="checkbox" value="'+(i+1)+'" class="partner"> '+esc(r.name)+'</span><b>'+result[i+1]+'</b></label>').join('');$('coalitionResult').textContent='';show('coalition');updateCoalition()}
function updateCoalition(){const result=seats(),partners=[...document.querySelectorAll('.partner:checked')].map(x=>Number(x.value)),sum=result[0]+partners.reduce((a,i)=>a+result[i],0);$('coalitionSeats').textContent=sum+' / 91 mandatów';$('coalitionResult').textContent=sum>=91?'Większość parlamentarna! Możesz powołać rząd koalicyjny.':'Brakuje '+(91-sum)+' mandatów do większości.'}
function reset(){S=null;show('setup')}
$('start').addEventListener('click',start);$('restart').addEventListener('click',reset);$('playAgain').addEventListener('click',reset);$('next').addEventListener('click',next);$('choices').addEventListener('click',e=>{const b=e.target.closest('button[data-kind]');if(b&&!b.disabled)decide(b.dataset.kind,Number(b.dataset.i))});$('coalitionButton').addEventListener('click',coalition);$('partners').addEventListener('change',updateCoalition);$('backResults').addEventListener('click',()=>show('end'));$('share').addEventListener('click',async()=>{if(!S)return;const msg='WYBORY2040: '+S.name+' zdobywa '+seats()[0]+' mandatów!';try{await navigator.clipboard.writeText(msg);$('copyStatus').textContent='Wynik skopiowany.'}catch{$('copyStatus').textContent=msg}});
