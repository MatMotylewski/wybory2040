'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.join(__dirname,'..'),data=fs.readFileSync(path.join(root,'data.js'),'utf8'),game=fs.readFileSync(path.join(root,'game.js'),'utf8'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
function boot(){
 const nodes=new Map(),storage=new Map();
 function get(id){
  if(!nodes.has(id))nodes.set(id,{id,value:id==='partyName'?'Komitet Testowy':id==='profile'?'economy':id==='candidateOrigin'?'organizer':id==='difficulty'?'normal':'',innerHTML:'',textContent:'',style:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},scrollIntoView(){},click(){},files:[]});
  return nodes.get(id);
 }
 const doc={getElementById:get,querySelector:()=>get('article'),querySelectorAll:()=>[],createElement:()=>({click(){}}),addEventListener(){}};
 const ctx={window:{WYBORY_DATA:null,scrollTo(){}},document:doc,navigator:{clipboard:{writeText:()=>Promise.resolve()}},Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL(){}},setTimeout:()=>{},alert(){},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}};
 vm.createContext(ctx);
 vm.runInContext(data,ctx,{filename:'data.js'});
 vm.runInContext(game+'\nglobalThis.TEST_API={start,decide,next,render,eventForWeek,eventCost,seats,national,planAction,finishTurn,manageStaff,vacateLeader,hireLeader,trainStaff,weeklyStaffCost,characterRatings,politicianRegionalBonus,politicianEvent,schedulePoliticianCrisis,transactFinance,coalition,negotiate,getState:()=>S};',ctx,{filename:'game.js'});
 return {api:ctx.TEST_API,get,storage,library:ctx.window.WYBORY_DATA};
}
test('full library and newspaper interface',()=>{
 const {library,api,get}=boot();
 assert.equal(library.pool.length,144);
 assert.equal(Object.keys(library.milestones).length,6);
 assert.match(html,/id="planCategory"|id="stepHint"/);
 assert.match(html,/id="candidateOrigin"/);
 assert.match(html,/id="resumeAuto"/);
 assert.match(html,/data-game-tab="legacy"/);
 assert.match(html,/id="politicalReminder"/);
 api.start();
 assert.equal((get('electionAtlas').innerHTML.match(/data-atlas-region/g)||[]).length,16);
 assert.match(get('electionAtlas').innerHTML,/<path class="territory/);
 assert.equal((get('staffDesk').innerHTML.match(/class="staff-person"/g)||[]).length,4);
});
test('four founders, vacancy, three prospects, paid replacement and reset',()=>{
 const {api,get}=boot();api.start();
 let people=api.getState().people;
 assert.equal(people.filter(p=>p.active).length,4);
 assert.equal(api.weeklyStaffCost(),760);
 assert.equal(api.getState().staff.length,4);
 const startingCash=api.getState().money;
 assert.equal(api.vacateLeader('organizer'),true);
 assert.ok(!api.getState().staff.includes('field'),'dismissal removes staff bonus');
 assert.equal(api.weeklyStaffCost(),600,'wage stops at dismissal');
 assert.equal(api.getState().people.find(p=>p.id==='organizer').name,'','slot remains visibly empty');
 assert.equal((get('staffDesk').innerHTML.match(/data-staff-hire="organizer"/g)||[]).length,3,'three candidates for vacant position');
 assert.equal(api.hireLeader('organizer','t-ewa'),true);
 let person=api.getState().people.find(p=>p.id==='organizer');
 assert.equal(person.name,'Ewa Lewicka');
 assert.equal(person.level,1);
 assert.equal(person.skill,2.1);
 assert.equal(person.loyalty,49);
 assert.equal(api.getState().money,startingCash-4500);
 assert.equal(api.weeklyStaffCost(),1010);
 assert.equal(api.trainStaff('field'),true);
 assert.equal(api.getState().people.find(p=>p.id==='organizer').level,2);
 assert.equal(api.vacateLeader('organizer'),true);
 assert.equal(api.hireLeader('organizer','t-anna'),true);
 person=api.getState().people.find(p=>p.id==='organizer');
 assert.equal(person.name,'Anna Ryś');
 assert.equal(person.level,1,'replacement does not inherit training');
 assert.equal(person.loyalty,82,'replacement has own fresh loyalty');
 assert.equal(person.skill,1,'replacement has own fresh competence');
 assert.equal(api.weeklyStaffCost(),745);
 assert.ok(get('staffDesk').innerHTML.includes('Szef struktur terenowych'));
});
test('all four vacancies can be filled and wages are recalculated',()=>{
 const {api}=boot();api.start();
 for(const id of ['treasurer','spokesperson','organizer','strategist'])assert.ok(api.vacateLeader(id));
 assert.equal(api.weeklyStaffCost(),0);
 assert.equal(api.getState().staff.length,0);
 assert.ok(api.hireLeader('treasurer','f-marta'));
 assert.ok(api.hireLeader('spokesperson','m-zofia'));
 assert.ok(api.hireLeader('organizer','t-anna'));
 assert.ok(api.hireLeader('strategist','a-kuba'));
 assert.equal(api.getState().staff.length,4);
 assert.equal(api.weeklyStaffCost(),655);
});
test('politician traits affect field campaigns, debates and controversy stories',()=>{
 const {api}=boot();api.start();
 const organizer=api.getState().people.find(p=>p.id==='organizer');
 const r=api.characterRatings(organizer);
 let before=api.getState().regional[0];api.politicianRegionalBonus(0);
 assert.ok(api.getState().regional[0]>before,'personal support gives regional boost');
 assert.ok(api.getState().people.some(p=>p.popularity>0),'field work builds a politicians personal profile');
 const press=api.getState().people.find(p=>p.id==='spokesperson');
 const beforeRating=api.characterRatings(press).controversy;
 press.scandal=25;
 assert.ok(api.characterRatings(press).controversy>beforeRating,'scandal increases controversy rating');
 api.getState().week=5;
 api.schedulePoliticianCrisis();
 assert.ok(api.getState().politicalCrisis,'high controversy schedules a media crisis');
 api.getState().week=api.getState().politicalCrisis.week;
 assert.equal(api.politicianEvent().politicalCrisis,true);
 press.loyalty=10;
 assert.ok(api.characterRatings(press).controversy>=beforeRating);
});
test('72 campaigns complete across difficulty, origins and strategy',()=>{
 let campaigns=0,topics=new Set();
 for(let run=0;run<72;run++){
  const {api,get,storage}=boot();
  get('difficulty').value=['easy','normal','hard'][run%3];
  get('candidateOrigin').value=['organizer','journalist','mayor','entrepreneur'][run%4];
  get('profile').value=['economy','social','green','freedom'][run%4];
  api.start();api.getState().seed=run*1901+347;
  for(let week=0;week<30;week++){
   let event=api.eventForWeek();topics.add(event.title||event[0]);
   const opts=event.options||event[2],affordable=opts.map((o,i)=>api.eventCost(o)<=api.getState().money?i:-1).filter(i=>i>=0);
   api.decide('event',affordable.length?affordable[(week+run)%affordable.length]:99);
   if(api.getState().phase===4)for(let q=0;q<3;q++)api.decide('broadcast',run%3);
   assert.equal(api.getState().phase,1,'planning week '+week);
   api.getState().selectedRegion=(run+week)%16;
   const actions=run%3===0?['field','fundraise','volunteers']:run%3===1?['media','research','counter']:['fundraise','debate','diplomacy'];
   for(const a of actions)api.planAction(a);
   if(!api.getState().done)api.finishTurn();
   assert.ok(api.getState().turn.report,'newspaper weekly edition');
   assert.ok(api.getState().legacy.decisions.length>0,'political archive records choices');
   assert.ok(storage.size>0,'autosave persists');
   assert.ok(api.getState().money>=0,'nonnegative treasury');
   api.next();
  }
  assert.equal(api.seats().reduce((a,b)=>a+b,0),180);
  assert.equal(Object.keys(api.getState().arcs).length,6);
  assert.ok(api.getState().legacy.chapters.length>=5,'five-week chapter reports exist');
  assert.ok(api.getState().legacy.promises.every(p=>['ongoing','fulfilled','broken'].includes(p.status)),'promise lifecycle is valid');
  assert.match(get('epilogue').innerHTML,/EPILOG/);
  api.coalition();
  let c=api.getState().negotiations;
  for(let q=0;q<3&&!c.done;q++){
   const i=[0,1,2,3,4].find(x=>!c.tried.includes(x)&&!c.accepted.includes(x));
   if(i===undefined)break;c.selected=i;api.negotiate(q%3);
  }
  assert.ok(c.done,'coalition resolves');
  campaigns++;
 }
 assert.equal(campaigns,72);
 assert.ok(topics.size>=55,'story variety across campaigns');
});
