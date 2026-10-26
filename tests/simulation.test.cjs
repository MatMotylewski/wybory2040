'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const data=fs.readFileSync(path.join(root,'data.js'),'utf8');
const game=fs.readFileSync(path.join(root,'game.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
function boot(){
 const nodes=new Map();
 function getElementById(id){
  if(!nodes.has(id))nodes.set(id,{id,value:id==='partyName'?'Komitet Testowy':id==='profile'?'economy':'',innerHTML:'',textContent:'',style:{},classList:{add(){},remove(){},toggle(){}},addEventListener(){},scrollIntoView(){},click(){},files:[]});
  return nodes.get(id);
 }
 const doc={getElementById,querySelector:()=>getElementById('article'),querySelectorAll:()=>[],createElement:()=>({click(){}}),addEventListener(){}};
 const ctx={window:{WYBORY_DATA:null,scrollTo(){}},document:doc,navigator:{clipboard:{writeText:()=>Promise.resolve()}},
  Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL(){}},setTimeout:()=>{},alert:()=>{}};
 vm.createContext(ctx);
 vm.runInContext(data,ctx,{filename:'data.js'});
 vm.runInContext(game+'\nglobalThis.TEST_API={start,decide,next,render,eventForWeek,seats,national,coalition,negotiate,transactFinance,STAFF_ROLES,ACTIONS,TACTICS,getState:()=>S};',ctx,{filename:'game.js'});
 return {api:ctx.TEST_API,elements:nodes,get:getElementById,data:ctx.window.WYBORY_DATA};
}
test('static assets and narrative library',()=>{
 assert.match(html,/<script src="data\.js"><\/script>/);
 assert.match(html,/<script src="game\.js"><\/script>/);
 assert.equal((html.match(/<script src="data\.js"/g)||[]).length,1);
 assert.doesNotMatch(html,/fonts\.googleapis\.com|localStorage|document\.cookie/);
 const {data}=boot();
 assert.equal(data.pool.length,144);
 assert.equal(data.regions.length,9);
 assert.match(html,/id="electionAtlas"/);
 assert.match(html,/id="staffDesk"/);
 assert.match(html,/id="financeDesk"/);
 assert.equal(Object.keys(data.milestones).length,6);
});
test('40 complete, distinct campaigns through parliament and coalition',()=>{
 const {api,get}=boot();
 let headlines=new Set();
 for(let sim=0;sim<40;sim++){
  get('profile').value=['economy','social','green','freedom'][sim%4];
  api.start();api.getState().seed=sim*1901+347;
  if(sim===0){api.transactFinance('sponsor','citizens');assert.ok(api.getState().finance.sponsors.includes('citizens'));}
  if(sim===0){assert.equal((get('electionAtlas').innerHTML.match(/data-atlas-region/g)||[]).length,9,'nine clickable map regions');assert.equal((get('staffDesk').innerHTML.match(/class="staff-person"/g)||[]).length,4,'four staff character cards');}
  for(let week=0;week<30;week++){
   const e=api.eventForWeek();headlines.add(e.title||e[0]);
   const opts=e.options||e[2];
   const affordable=opts.map((o,i)=>{
    const price=Array.isArray(o[1])?o[3]:Math.max(0,-(o[1].budget||0));
    return price<=api.getState().money?i:-1;
   }).filter(i=>i>=0);
   api.decide('event',affordable.length?affordable[sim%affordable.length]:99);
   if([4,10,18,25].includes(week)){
    assert.equal(api.getState().phase,4,'broadcast should open on week '+week);
    for(let round=0;round<3;round++)api.decide('broadcast',sim%3);
   }
   assert.equal(api.getState().phase,1,'week '+week+' event');
   api.decide('region',api.getState().money>=700?(sim+week)%9:9);
   assert.equal(api.getState().phase,2,'week '+week+' region');
   if([2,8,16].includes(week)&&api.getState().money>=3200){
    const role=api.STAFF_ROLES.findIndex(r=>!api.getState().staff.includes(r.id));
    api.decide('hire',role);
   }else{
    const available=api.ACTIONS.map((a,i)=>a[1]<=api.getState().money?i:-1).filter(i=>i>=0);
    api.decide('action',available[(sim+week)%available.length]);
   }
   assert.equal(api.getState().phase,3,'week '+week+' nationwide');
   const tactics=api.TACTICS.map((a,i)=>a.cost<=api.getState().money?i:-1).filter(i=>i>=0);
   api.decide('tactic',tactics[(sim+week)%tactics.length]);
   assert.equal(api.getState().done,true,'week '+week+' tactic');
   assert.ok(api.getState().money>=0,'budget remains nonnegative');
   if(week===8)api.render(); // rehydration after a finished week must show next button
   api.next();
  }
  assert.equal(Object.keys(api.getState().arcs||{}).length,3,'three early decisions should have long-term consequences');
  assert.equal((api.getState().people||[]).length,4,'four story characters remain in state');
  assert.equal(api.seats().reduce((a,b)=>a+b,0),180);
  api.coalition();
  const c=api.getState().negotiations;
  for(let i=0;i<3&&!c.done;i++){
   const next=[0,1,2,3,4].find(x=>!c.tried.includes(x)&&!c.accepted.includes(x));
   if(next===undefined)break;c.selected=next;api.negotiate(i%3);
  }
  assert.equal(c.done,true,'negotiations resolve');
 }
 assert.ok(headlines.size>=50,'campaigns should show different stories');
});