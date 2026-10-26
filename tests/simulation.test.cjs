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
  if(!nodes.has(id))nodes.set(id,{id,value:id==='partyName'?'Komitet Testowy':id==='profile'?'economy':'',innerHTML:'',textContent:'',classList:{add(){},remove(){},toggle(){}},addEventListener(){},scrollIntoView(){},click(){},files:[]});
  return nodes.get(id);
 }
 const doc={getElementById,querySelector:()=>getElementById('article'),querySelectorAll:()=>[],createElement:()=>({click(){}})};
 const ctx={window:{WYBORY_DATA:null,scrollTo(){}},document:doc,navigator:{clipboard:{writeText:()=>Promise.resolve()}},
  Blob:class{},URL:{createObjectURL:()=>'',revokeObjectURL(){}},setTimeout:()=>{},alert:()=>{}};
 vm.createContext(ctx);
 vm.runInContext(data,ctx,{filename:'data.js'});
 vm.runInContext(game+'\nglobalThis.TEST_API={start,decide,next,render,eventForWeek,seats,national,coalition,negotiate,STAFF_ROLES,ACTIONS,TACTICS,getState:()=>S};',ctx,{filename:'game.js'});
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
 assert.equal(Object.keys(data.milestones).length,6);
});
test('40 complete, distinct campaigns through parliament and coalition',()=>{
 const {api,get}=boot();
 let headlines=new Set();
 for(let sim=0;sim<40;sim++){
  get('profile').value=['economy','social','green','freedom'][sim%4];
  api.start();api.getState().seed=sim*1901+347;
  for(let week=0;week<30;week++){
   const e=api.eventForWeek();headlines.add(e.title||e[0]);
   const opts=e.options||e[2];
   const affordable=opts.map((o,i)=>{
    const price=Array.isArray(o[1])?o[3]:Math.max(0,-(o[1].budget||0));
    return price<=api.getState().money?i:-1;
   }).filter(i=>i>=0);
   api.decide('event',affordable.length?affordable[sim%affordable.length]:99);
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