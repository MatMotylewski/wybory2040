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
 vm.runInContext(game+'\nglobalThis.TEST_API={start,decide,next,render,eventForWeek,eventCost,seats,national,planAction,finishTurn,manageStaff,trainStaff,transactFinance,coalition,negotiate,getState:()=>S};',ctx,{filename:'game.js'});
 return {api:ctx.TEST_API,get,storage,library:ctx.window.WYBORY_DATA};
}
test('full library and newspaper interface',()=>{
 const {library,api,get}=boot();
 assert.equal(library.pool.length,144);
 assert.equal(Object.keys(library.milestones).length,6);
 assert.match(html,/id="planCategory"|id="stepHint"/);
 assert.match(html,/id="candidateOrigin"/);
 assert.match(html,/id="resumeAuto"/);
 api.start();
 assert.equal((get('electionAtlas').innerHTML.match(/data-atlas-region/g)||[]).length,16);
 assert.match(get('electionAtlas').innerHTML,/<path class="territory/);
 assert.equal((get('staffDesk').innerHTML.match(/class="staff-person"/g)||[]).length,8);
});
test('team hiring and training',()=>{
 const {api}=boot();api.start();let before=api.getState().money;
 api.manageStaff('field');assert.ok(api.getState().staff.includes('field'));assert.equal(api.getState().money,before-3200);
 api.trainStaff('field');assert.equal(api.getState().staffLevels.field,2);
 api.manageStaff('field');assert.ok(!api.getState().staff.includes('field'));
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
   assert.ok(storage.size>0,'autosave persists');
   assert.ok(api.getState().money>=0,'nonnegative treasury');
   api.next();
  }
  assert.equal(api.seats().reduce((a,b)=>a+b,0),180);
  assert.equal(Object.keys(api.getState().arcs).length,6);
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
