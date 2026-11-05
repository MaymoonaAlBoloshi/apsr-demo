import providers from '../shared/providers.json' with {type:'json'};
import { randomUUID } from 'node:crypto';
import { people,sectors } from './store.mjs';
import { createChat } from './chat.mjs';
const fail=(status,code)=>{throw Object.assign(new Error(code),{status});};
const required=(s,min=1)=>typeof s==='string'&&s.trim().length>=min&&s.length<=5000;
export function api(store,{chat=createChat(store)}={}){
 const sessions=new Map();
 function canRead(c,actor){return !!c&&(actor.role==='consumer'?c.userId===actor.id:actor.role==='provider'?!!actor.providerId&&c.providerId===actor.providerId:['officer','manager'].includes(actor.role));}
 function selection(body,optional=false){
  if(optional&&!body.providerId)return {providerId:null,provider:typeof body.provider==='string'?body.provider.slice(0,200):''};
  if(body.providerId==='other'){if(!optional&&!required(body.provider,2))fail(400,'provider_required');return {providerId:null,provider:typeof body.provider==='string'?body.provider.trim().slice(0,200):''};}
  const provider=providers.find(p=>p.id===body.providerId&&p.sectors.includes(body.sector));
  if(!provider)fail(400,'provider_required');return {providerId:provider.id,provider:provider.name.en};
 }
 function publicCase(c,actor){const copy=structuredClone(c);if(['consumer','provider'].includes(actor.role)){copy.messages=copy.messages.filter(m=>!m.internal);copy.events=copy.events.filter(e=>!e.internal);}if(actor.role==='provider')delete copy.userId;return copy;}
 function document(input,actor,caseId){
 if(!input)return null;
 if(!required(input.name)||!['application/pdf','image/png','image/jpeg','text/plain'].includes(input.type)||typeof input.data!=='string')fail(400,'invalid_file');
 const bytes=Buffer.from(input.data,'base64');
 if(!bytes.length||bytes.length>2*1024*1024)fail(400,'file_size');
 if(input.type==='application/pdf'&&bytes.subarray(0,5).toString()!=='%PDF-')fail(400,'invalid_file');
 if(input.type==='image/png'&&bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')fail(400,'invalid_file');
 if(input.type==='image/jpeg'&&bytes.subarray(0,3).toString('hex')!=='ffd8ff')fail(400,'invalid_file');
 const id=randomUUID(); const d={id,name:input.name.slice(0,120),type:input.type,size:bytes.length,at:new Date().toISOString()};
 store.put('file',id,{...d,data:input.data,userId:actor.id,caseId}); return d;
 }
 return async(req,res)=>{
 const url=new URL(req.url,'http://localhost'); const path=url.pathname; const method=req.method;
 if(!path.startsWith('/api/'))return false;
 const reply=(value,status=200)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(value));};
 try{
 if(path==='/api/providers'&&method==='GET'){reply(providers);return true;}
 if(path==='/api/health'&&method==='GET'){store.get('settings','complaint');reply({ok:true});return true;}
 let body={};
 if(!['GET','HEAD'].includes(method)){
 if(req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host)fail(403,'forbidden');
 if(!String(req.headers['content-type']||'').startsWith('application/json'))fail(415,'json_required');
 let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>3*1024*1024)fail(413,'file_size');}try{body=JSON.parse(raw||'{}');}catch{fail(400,'invalid_json');}
 }
 const token=(req.headers.cookie||'').split(';').map(s=>s.trim()).find(s=>s.startsWith('apsr_demo='))?.slice(10);
 let actor=sessions.get(token);
 const auth=(...roles)=>{if(!actor)fail(401,'sign_in');if(roles.length&&!roles.includes(actor.role))fail(403,'forbidden');};
 if(path==='/api/chat/status'&&method==='GET'){reply({available:chat.configured()});return true;}
 if(path==='/api/chat'&&method==='POST'){reply(await chat({...body,role:actor?.role||'public'},req.socket?.remoteAddress||'local'));return true;}
 if(path==='/api/session'&&method==='POST'){
 if(body.persona==='public'){sessions.delete(token);res.setHeader('Set-Cookie','apsr_demo=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0');reply({actor:null});return true;}
 if(typeof body.persona!=='string'||!Object.hasOwn(people,body.persona))fail(400,'invalid_persona');
 const t=randomUUID();actor=people[body.persona];sessions.set(t,actor);res.setHeader('Set-Cookie',`apsr_demo=${t}; HttpOnly; SameSite=Strict; Path=/`);reply({actor});return true;
 }
 if(path==='/api/session'&&method==='GET'){reply({actor:actor||null});return true;}
 if(path==='/api/content'&&method==='GET'){const c=store.get('content','faq');reply(['editor','publisher'].includes(actor?.role)?c:{id:c.id,title:c.title,published:c.published,version:c.version});return true;}
 if(path==='/api/settings'&&method==='GET'){reply(store.get('settings','complaint'));return true;}
 if(path==='/api/settings'&&method==='PUT'){auth('officer');if(!required(body.requirements?.ar)||!required(body.requirements?.en)||body.owner!=='officer'||typeof body.requiredDocument!=='boolean')fail(400,'required');store.put('settings','complaint',{...store.get('settings','complaint'),requirements:body.requirements,owner:body.owner,requiredDocument:body.requiredDocument});reply({ok:true});return true;}
 if(path==='/api/content'&&method==='PUT'){
 auth('editor');const c=store.get('content','faq');if(!body.draft||typeof body.draft.ar!=='string'||typeof body.draft.en!=='string'||body.draft.ar.length>5000||body.draft.en.length>5000)fail(400,'required');
 c.draft=body.draft;c.status=body.review?'review':'draft';store.put('content','faq',c);reply(c);return true;
 }
 if(path==='/api/content/publish'&&method==='POST'){
 auth('publisher');const c=store.get('content','faq');if(c.status!=='review')fail(409,'review_first');if(!required(c.draft.ar)||!required(c.draft.en))fail(400,'both_languages');
 c.published={...c.draft};c.status='published';c.version++;c.history.push({version:c.version,actor:actor.id,at:new Date().toISOString()});store.put('content','faq',c);reply(c);return true;
 }
 if(path==='/api/draft'){
 auth('consumer');if(method==='GET'){reply(store.get('draft',actor.id)||{});return true;}
 if(method==='PUT'){if(body.description?.length>5000||body.subject?.length>200)fail(400,'required');store.put('draft',actor.id,{sector:body.sector,subject:body.subject||'',description:body.description||'',account:body.account||'',...selection(body,true),category:['billing','outage','quality','connection','other'].includes(body.category)?body.category:'other',updatedAt:new Date().toISOString()});reply({ok:true});return true;}
 }
 if(path==='/api/cases'&&method==='GET'){auth('consumer','officer','manager','provider');reply(store.all('case').filter(c=>canRead(c,actor)).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).map(c=>publicCase(c,actor)));return true;}
 if(path==='/api/cases'&&method==='POST'){
 auth('consumer');if(!sectors.includes(body.sector)||!required(body.subject,3)||body.subject.length>200||!required(body.description,10)||!required(body.account))fail(400,'required');
 const routing=selection(body);if(!['billing','outage','quality','connection','other'].includes(body.category))fail(400,'category_required');
 const settings=store.get('settings','complaint');if(settings.requiredDocument&&!body.document)fail(400,'document_required');
 const seq=Math.max(30,...store.all('case').map(c=>Number(c.id.split('-').at(-1))))+1;const id=`APSR-2026-${String(seq).padStart(4,'0')}`; const now=new Date().toISOString();const d=document(body.document,actor,id);
 const c={id,userId:actor.id,sector:body.sector,...routing,category:body.category,finding:'not_reviewed',account:body.account,subject:body.subject,description:body.description,status:'submitted',owner:settings.owner,createdAt:now,updatedAt:now,dueAt:new Date(Date.now()+settings.targetDays*86400000).toISOString(),resolvedAt:null,documents:d?[d]:[],messages:[],events:[{id:randomUUID(),actor:actor.id,at:now,type:'submitted',text:{ar:'تم استلام الشكوى',en:'Complaint received'}}],rating:null};
 store.put('case',id,c);store.del('draft',actor.id);reply(c,201);return true;
 }
 const match=path.match(/^\/api\/cases\/([^/]+)(?:\/(action|rating))?$/);
 if(match){
 auth('consumer','officer','manager','provider');const c=store.get('case',match[1]);if(!canRead(c,actor))fail(404,'not_found');
 if(!match[2]&&method==='GET'){reply(publicCase(c,actor));return true;}
 if(match[2]==='rating'&&method==='POST'){auth('consumer');if(c.status!=='closed')fail(409,'close_first');if(!Number.isInteger(body.rating)||body.rating<1||body.rating>5)fail(400,'required');c.rating=body.rating;store.put('case',c.id,c);reply(publicCase(c,actor));return true;}
 if(match[2]==='action'&&method==='POST'){
 const now=new Date().toISOString();const type=body.action;const text=body.text?.trim();let eventText;let internal=false;
 if(type==='provider-response'){
 auth('provider');if(['resolved','closed'].includes(c.status))fail(409,'invalid_transition');if(!required(text))fail(400,'explanation_required');
 const d=document(body.document,actor,c.id);if(d)c.documents.push(d);
 eventText={ar:'تم استلام رد مزود الخدمة',en:'Provider response received'};
 }else if(type==='finding'){
 auth('officer');if(!['substantiated','not_substantiated','inconclusive'].includes(body.finding)||!required(text))fail(400,'explanation_required');
 c.finding=body.finding;eventText={ar:'تم تسجيل تقييم الهيئة للمشكلة',en:'APSR assessment recorded'};
 }else if(type==='route-provider'){
 auth('officer');if(['resolved','closed'].includes(c.status))fail(409,'invalid_transition');if(!required(text))fail(400,'explanation_required');
 const routing=selection({providerId:body.providerId,sector:c.sector});Object.assign(c,routing);c.finding='not_reviewed';eventText={ar:'تم تحديث مزود الخدمة المسؤول',en:'Responsible provider updated'};
 }else if(type==='respond'){
 auth('consumer');if(c.status!=='awaiting_documents')fail(409,'invalid_transition');if(!required(text)||!body.document)fail(400,'document_required');const d=document(body.document,actor,c.id);c.documents.push(d);c.status='in_review';eventText={ar:'تم إرسال المستندات المطلوبة',en:'Requested documents received'};
 }else{
 auth('officer');
 if(type==='review'){if(c.status!=='submitted')fail(409,'invalid_transition');c.status='in_review';c.owner=actor.id;eventText={ar:'بدأت مراجعة الشكوى',en:'Review started'};}
 else if(type==='request'){if(c.status!=='in_review')fail(409,'invalid_transition');if(!required(text))fail(400,'explanation_required');c.status='awaiting_documents';eventText={ar:'تم طلب مستندات إضافية',en:'Additional documents requested'};}
 else if(type==='resolve'){if(c.status!=='in_review')fail(409,'invalid_transition');if(!required(text))fail(400,'explanation_required');c.status='resolved';c.resolvedAt=now;eventText={ar:'تم تسجيل نتيجة الشكوى',en:'Resolution recorded'};}
 else if(type==='close'){if(c.status!=='resolved')fail(409,'invalid_transition');c.status='closed';eventText={ar:'تم إغلاق الشكوى',en:'Complaint closed'};}
 else if(type==='assign'){if(['closed','resolved'].includes(c.status))fail(409,'invalid_transition');c.owner=actor.id;eventText={ar:'تم إسناد الشكوى إلى أحمد الريامي',en:'Assigned to Ahmed Al Riyami'};internal=true;}
 else if(type==='note'){if(!required(text))fail(400,'explanation_required');eventText={ar:'تمت إضافة ملاحظة داخلية',en:'Internal note added'};internal=true;}
 else fail(400,'invalid_action');
 }
 if(text)c.messages.push({id:randomUUID(),actor:actor.id,at:now,text,internal});
 c.events.push({id:randomUUID(),type,actor:actor.id,at:now,text:eventText,internal,...(type==='finding'?{finding:c.finding,providerId:c.providerId}:{}),...(type==='route-provider'?{providerId:c.providerId}:{})});c.updatedAt=now;store.put('case',c.id,c);reply(publicCase(c,actor));return true;
 }
 }
 if(path.startsWith('/api/files/')&&method==='GET'){
 auth('consumer','officer','manager','provider');const f=store.get('file',path.split('/').at(-1));const c=f&&store.get('case',f.caseId);if(!canRead(c,actor))fail(404,'not_found');
 res.writeHead(200,{'Content-Type':f.type,'Content-Disposition':`attachment; filename*=UTF-8''${encodeURIComponent(f.name)}`,'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});res.end(Buffer.from(f.data,'base64'));return true;
 }
 if(path==='/api/notifications'&&method==='GET'){
 auth('consumer','officer','manager','provider');const result=store.all('case').filter(c=>canRead(c,actor)).flatMap(c=>c.events.filter(e=>!e.internal).map(e=>({...e,caseId:c.id}))).sort((a,b)=>b.at.localeCompare(a.at)).slice(0,15);reply(result);return true;
 }
 if(path==='/api/demo/reset'&&method==='POST'){auth('manager');store.reset();reply({ok:true});return true;}
 fail(404,'not_found');
 }catch(e){reply({error:e.status?e.message:'server_error'},e.status||500);if(!e.status)console.error(e);}
 return true;
 };
}
