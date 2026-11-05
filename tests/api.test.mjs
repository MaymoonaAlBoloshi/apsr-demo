import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import {invoke} from './transport.mjs';
import {openStore} from '../server/store.mjs';
import {api} from '../server/api.mjs';
const store=openStore(':memory:');const handler=api(store);
after(()=>store.db.close());
async function user(persona){const r=await invoke(handler,'/api/session',{method:'POST',body:{persona}});return r.headers['set-cookie'].split(';')[0];}
async function request(cookie,path,method='GET',body){const r=await invoke(handler,'/api'+path,{method,headers:{cookie:cookie||''},body});return {status:r.status,data:r.json()};}
const complaint={sector:'electricity',providerId:'nama-supply',category:'billing',provider:'Demo Electricity',account:'DEMO-100',subject:'Unexpected bill increase',description:'Please review the unusually high amount on this month’s electricity bill.'};
const document={name:'sample-bill.txt',type:'text/plain',data:Buffer.from('FICTIONAL BILL\nAccount DEMO-100\nAmount: OMR 42.000').toString('base64')};
test('complete complaint lifecycle, access isolation, files, feedback and derived counts',async()=>{
 const consumer=await user('consumer'),other=await user('consumer2'),officer=await user('officer'),manager=await user('manager');
 const created=await request(consumer,'/cases','POST',complaint);assert.equal(created.status,201);const id=created.data.id;
 assert.equal((await request(other,`/cases/${id}`)).status,404);
 assert.equal((await request(consumer,`/cases/${id}/action`,'POST',{action:'resolve',text:'Fake approval'})).status,403);
 assert.equal((await request(officer,`/cases/${id}/action`,'POST',{action:'close'})).status,409);
 assert.equal((await request(officer,`/cases/${id}/action`,'POST',{action:'review'})).data.status,'in_review');
 assert.equal((await request(officer,`/cases/${id}/action`,'POST',{action:'request'})).status,400);
 assert.equal((await request(officer,`/cases/${id}/action`,'POST',{action:'note',text:'Private investigation note'})).status,200);
 let c=(await request(consumer,`/cases/${id}`)).data;assert.ok(!c.messages.some(m=>m.internal));assert.ok(!c.events.some(e=>e.internal));
 assert.equal((await request(officer,`/cases/${id}/action`,'POST',{action:'request',text:'Please provide the bill.'})).data.status,'awaiting_documents');
 assert.equal((await request(consumer,`/cases/${id}/action`,'POST',{action:'respond',text:'Attached'})).status,400);
 assert.equal((await request(consumer,`/cases/${id}/action`,'POST',{action:'respond',text:'Attached the requested bill.',document})).data.status,'in_review');
 c=(await request(consumer,`/cases/${id}`)).data;const file=c.documents[0];
 assert.equal((await invoke(handler,`/api/files/${file.id}`,{headers:{cookie:other}})).status,404);
 const downloaded=await invoke(handler,`/api/files/${file.id}`,{headers:{cookie:consumer}});assert.match(await downloaded.text(),/FICTIONAL BILL/);
 assert.equal((await request(officer,`/cases/${id}/action`,'POST',{action:'resolve',text:'The demonstration bill was reviewed and corrected.'})).data.status,'resolved');
 assert.equal((await request(officer,`/cases/${id}/action`,'POST',{action:'close'})).data.status,'closed');
 assert.equal((await request(consumer,`/cases/${id}/rating`,'POST',{rating:5})).data.rating,5);
 assert.equal((await request(other,`/cases/${id}/rating`,'POST',{rating:1})).status,404);
 const list=(await request(manager,'/cases')).data;assert.equal(list.length,31);assert.equal(list.find(c=>c.id===id).rating,5);
 const notification=(await request(consumer,'/notifications')).data;assert.ok(notification.some(n=>n.caseId===id&&n.type==='close'));assert.ok(notification.every(n=>!n.internal));
});
test('draft survives a fresh session and cannot cross account boundaries',async()=>{
 const a=await user('consumer');await request(a,'/draft','PUT',complaint);const b=await user('consumer');assert.equal((await request(b,'/draft')).data.subject,complaint.subject);const other=await user('consumer2');assert.deepEqual((await request(other,'/draft')).data,{});
});
test('content requires distinct publisher and both languages; public sees only published version',async()=>{
 const editor=await user('editor'),publisher=await user('publisher');const before=(await request('','/content')).data;
 assert.equal((await request(editor,'/content','PUT',{draft:{ar:'إرشادات جديدة',en:''},review:true})).status,200);
 assert.equal((await request(editor,'/content/publish','POST',{})).status,403);
 assert.equal((await request(publisher,'/content/publish','POST',{})).status,400);
 assert.deepEqual((await request('','/content')).data.published,before.published);
 await request(editor,'/content','PUT',{draft:{ar:'إرشادات جديدة',en:'Updated guidance'},review:true});
 const published=await request(publisher,'/content/publish','POST',{});assert.equal(published.data.version,2);assert.equal((await request('','/content')).data.published.en,'Updated guidance');assert.ok(!('draft' in (await request('','/content')).data));
});
test('settings affect new submissions and malformed attachments are rejected',async()=>{
 const officer=await user('officer'),consumer=await user('consumer');const settings=(await request(officer,'/settings')).data;
 assert.equal((await request(consumer,'/settings','PUT',{...settings,requiredDocument:true})).status,403);
 await request(officer,'/settings','PUT',{...settings,requiredDocument:true});
 assert.equal((await request(consumer,'/cases','POST',complaint)).status,400);
 assert.equal((await request(consumer,'/cases','POST',{...complaint,document:{...document,type:'application/pdf'}})).status,400);
 assert.equal((await request(consumer,'/cases','POST',{...complaint,document:{...document,data:Buffer.alloc(2*1024*1024+1).toString('base64')}})).status,400);
 assert.equal((await request(consumer,'/cases','POST',{...complaint,document})).status,201);
});
test('anonymous and cross-origin mutations are rejected; reset requires manager',async()=>{
 assert.equal((await request('','/cases')).status,401);const consumer=await user('consumer');assert.equal((await request(consumer,'/demo/reset','POST',{})).status,403);
 const r=await invoke(handler,'/api/session',{method:'POST',headers:{origin:'https://example.invalid'},body:{persona:'officer'}});assert.equal(r.status,403);
 const manager=await user('manager');assert.equal((await request(manager,'/demo/reset','POST',{})).status,200);assert.equal((await request(manager,'/cases')).data.length,30);assert.equal(store.all('file').length,0);
});

test('SQLite data survives closing and reopening the database',async()=>{
 const {mkdtempSync,rmSync}=await import('node:fs');const {tmpdir}=await import('node:os');const {join}=await import('node:path');
 const dir=mkdtempSync(join(tmpdir(),'apsr-persist-'));const path=join(dir,'test.sqlite');
 try{const first=openStore(path);first.put('draft','consumer',{subject:'Persisted draft'});first.db.close();const second=openStore(path);assert.equal(second.get('draft','consumer').subject,'Persisted draft');assert.equal(second.all('case').length,30);second.db.close();}finally{rmSync(dir,{recursive:true,force:true});}
});

test('production static handler serves HTML, deep links, assets and safe failures',async()=>{
 const {serveStatic}=await import('../server/static.mjs');const {mkdtempSync,writeFileSync,rmSync}=await import('node:fs');const {tmpdir}=await import('node:os');const {join}=await import('node:path');
 const root=mkdtempSync(join(tmpdir(),'apsr-static-'));writeFileSync(join(root,'index.html'),'<html>APSR demo</html>');writeFileSync(join(root,'app.js'),'console.log("demo")');writeFileSync(join(root,'sw.js'),'self.addEventListener("fetch",()=>{})');writeFileSync(join(root,'manifest.webmanifest'),'{"display":"standalone"}');
 const handler=(req,res)=>serveStatic(req,res,root);
 try{
 const home=await invoke(handler,'/');assert.equal(home.status,200);assert.match(home.headers['content-type'],/text\/html/);assert.match(home.text(),/APSR demo/);
 const deep=await invoke(handler,'/cases/APSR-2026-0031');assert.match(deep.headers['content-type'],/text\/html/);
 const js=await invoke(handler,'/app.js');assert.equal(js.headers['content-type'],'text/javascript');
 const worker=await invoke(handler,'/sw.js');assert.equal(worker.headers['content-type'],'text/javascript');assert.equal(worker.headers['cache-control'],'no-cache');
 const manifest=await invoke(handler,'/manifest.webmanifest');assert.equal(manifest.headers['content-type'],'application/manifest+json');assert.equal(manifest.headers['cache-control'],'no-cache');assert.equal(home.headers['cache-control'],'no-cache');
 assert.equal((await invoke(handler,'/missing.js')).status,404);
 assert.equal((await invoke(handler,'/%E0%A4%A')).status,400);
 assert.equal((await invoke(handler,'/..%2Fsecret.txt')).status,403);
 }finally{rmSync(root,{recursive:true,force:true});}
});
