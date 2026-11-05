import {test} from 'node:test';
import assert from 'node:assert/strict';
import {invoke} from './transport.mjs';
import {openStore} from '../server/store.mjs';
import {api} from '../server/api.mjs';
const complaint={sector:'electricity',providerId:'nama-supply',category:'quality',account:'TEST',subject:'Quality issue',description:'Fictional service quality complaint for testing.'};
test('provider isolation, response permissions, assessment and reassignment',async()=>{
 const store=openStore(':memory:');try{
 const handler=api(store);const request=async(cookie,path,method='GET',body)=>{const r=await invoke(handler,'/api'+path,{method,headers:{cookie},body});return {status:r.status,data:r.json()};};
 const login=async persona=>{const r=await invoke(handler,'/api/session',{method:'POST',body:{persona,providerId:'nama-supply'}});return r.headers['set-cookie'].split(';')[0];};
 const consumer=await login('consumer'),officer=await login('officer'),provider=await login('provider-nama-supply'),other=await login('provider-nama-distribution');
 const document={name:'sample.txt',type:'text/plain',data:Buffer.from('fictional evidence').toString('base64')};
 const created=await request(consumer,'/cases','POST',{...complaint,document});assert.equal(created.status,201);const id=created.data.id,path='/cases/'+id,file=created.data.documents[0].id;
 assert.equal((await request(provider,path)).status,200);assert.equal((await request(other,path)).status,404);
 assert.ok((await request(provider,'/cases')).data.every(c=>c.providerId==='nama-supply'));
 assert.ok(!(await request(other,'/notifications')).data.some(e=>e.caseId===id));
 assert.equal((await invoke(handler,'/api/files/'+file,{headers:{cookie:other}})).status,404);
 assert.equal((await invoke(handler,'/api/files/'+file,{headers:{cookie:provider}})).status,200);
 await request(officer,path+'/action','POST',{action:'note',text:'Private staff note'});
 const view=(await request(provider,path)).data;assert.ok(!view.messages.some(m=>m.internal));assert.ok(!view.events.some(e=>e.internal));assert.ok(!('userId' in view));
 for(const action of ['resolve','finding','note','route-provider'])assert.equal((await request(provider,path+'/action','POST',{action,text:'Attempt',finding:'substantiated',providerId:'nama-distribution'})).status,403);
 assert.equal((await request(other,path+'/action','POST',{action:'provider-response',text:'Wrong company'})).status,404);
 const reply=await request(provider,path+'/action','POST',{action:'provider-response',text:'Investigation underway'});assert.equal(reply.data.status,'submitted');assert.ok((await request(consumer,path)).data.messages.some(m=>m.text==='Investigation underway'));
 assert.equal((await request(officer,path+'/action','POST',{action:'finding',finding:'substantiated'})).status,400);
 assert.equal((await request(officer,path+'/action','POST',{action:'finding',finding:'substantiated',text:'Evidence reviewed'})).data.finding,'substantiated');
 assert.equal((await request(officer,path+'/action','POST',{action:'route-provider',providerId:'nama-distribution',text:'Network responsibility'})).status,200);
 assert.equal((await request(provider,path)).status,404);assert.equal((await request(other,path)).status,200);
 assert.equal((await invoke(handler,'/api/files/'+file,{headers:{cookie:provider}})).status,404);
 assert.ok(!(await request(provider,'/notifications')).data.some(e=>e.caseId===id));
 }finally{store.db.close();}
});
test('directory validation, drafts and unlisted intake',async()=>{
 const store=openStore(':memory:');try{const handler=api(store);const login=await invoke(handler,'/api/session',{method:'POST',body:{persona:'consumer'}});const cookie=login.headers['set-cookie'].split(';')[0];
 const req=(path,body)=>invoke(handler,'/api'+path,{method:'POST',headers:{cookie},body});
 for(const change of [{providerId:'fake'},{sector:'water'},{providerId:''},{category:'fake'}])assert.equal((await req('/cases',{...complaint,...change})).status,400);
 const unknown=await req('/cases',{...complaint,providerId:'other',provider:'Local operator'});assert.equal(unknown.status,201);assert.equal(unknown.json().providerId,null);
 const draft=await invoke(handler,'/api/draft',{method:'PUT',headers:{cookie},body:complaint});assert.equal(draft.status,200);
 const restored=await invoke(handler,'/api/draft',{headers:{cookie}});assert.equal(restored.json().providerId,'nama-supply');assert.equal(restored.json().category,'quality');
 assert.equal((await req('/session',{persona:'toString'})).status,400);
 const list=(await invoke(handler,'/api/providers')).json();assert.equal(new Set(list.map(p=>p.id)).size,list.length);assert.ok(list.length>=30);
 }finally{store.db.close();}
});
test('provider migration preserves submitted cases and drafts',async()=>{
 const {mkdtempSync,rmSync}=await import('node:fs');const {tmpdir}=await import('node:os');const {join}=await import('node:path');const dir=mkdtempSync(join(tmpdir(),'apsr-provider-'));const file=join(dir,'test.sqlite');let store;
 try{store=openStore(file);const seed=store.all('case')[0];store.put('case',seed.id,{...seed,provider:'Demo Utilities',providerId:undefined});const existing={...seed,id:'USER-EXISTING',provider:'My original provider',providerId:undefined,description:'A real submitted description'};store.put('case',existing.id,existing);store.put('draft','consumer',{provider:'Legacy draft'});store.del('migration','providers-v1');store.db.close();store=openStore(file);assert.ok(store.get('case',seed.id).providerId);assert.deepEqual(store.get('case',existing.id),JSON.parse(JSON.stringify(existing)));assert.equal(store.get('draft','consumer').provider,'Legacy draft');}finally{store?.db.close();rmSync(dir,{recursive:true,force:true});}
});
