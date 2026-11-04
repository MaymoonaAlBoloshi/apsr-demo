import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
export const people = {
 consumer:{id:'consumer',role:'consumer',en:'Maryam Al Balushi',ar:'مريم البلوشية'},
 consumer2:{id:'consumer2',role:'consumer',en:'Salim Al Harthi',ar:'سالم الحارثي'},
 officer:{id:'officer',role:'officer',en:'Ahmed Al Riyami',ar:'أحمد الريامي'},
 manager:{id:'manager',role:'manager',en:'Management',ar:'الإدارة'},
 editor:{id:'editor',role:'editor',en:'Content editor',ar:'محرر المحتوى'},
 publisher:{id:'publisher',role:'publisher',en:'Content publisher',ar:'ناشر المحتوى'}
};
export const sectors=['electricity','water','sanitation','gas','waste'];
export function openStore(path='data/demo.sqlite') {
 if(path!==':memory:') mkdirSync(dirname(path),{recursive:true});
 const db=new DatabaseSync(path); db.exec('PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS records (kind TEXT NOT NULL, id TEXT NOT NULL, value TEXT NOT NULL, PRIMARY KEY(kind,id));');
 const get=(kind,id)=>{const r=db.prepare('SELECT value FROM records WHERE kind=? AND id=?').get(kind,id);return r?JSON.parse(r.value):null;};
 const all=kind=>db.prepare('SELECT value FROM records WHERE kind=?').all(kind).map(r=>JSON.parse(r.value));
 const put=(kind,id,value)=>db.prepare('INSERT OR REPLACE INTO records VALUES (?,?,?)').run(kind,id,JSON.stringify(value));
 const del=(kind,id)=>db.prepare('DELETE FROM records WHERE kind=? AND id=?').run(kind,id);
 function reset(){
 db.exec('BEGIN');
 try {
 db.exec('DELETE FROM records');
 const now=Date.now();
 for(let i=1;i<=30;i++){
 const status=['submitted','in_review','awaiting_documents','resolved','closed'][i%5];
 const createdAt=new Date(now-(i+1)*86400000).toISOString();
 const sector=sectors[Math.floor((i-1)/6)];
 const c={id:`APSR-2026-${String(i).padStart(4,'0')}`,userId:i%2?'consumer':'consumer2',sector,provider:'Demo Utilities',subject:{ar:['مراجعة فاتورة الخدمة','استفسار حول قراءة العداد','متابعة جودة الخدمة'][i%3],en:['Service bill review','Meter reading enquiry','Service quality follow-up'][i%3]},description:'Sample case for the demonstration. بيانات افتراضية للعرض.',status,owner:i%3?'officer':null,createdAt,updatedAt:createdAt,dueAt:new Date(Date.parse(createdAt)+7*86400000).toISOString(),resolvedAt:['resolved','closed'].includes(status)?new Date(Date.parse(createdAt)+(i%5+1)*86400000).toISOString():null,documents:[],messages:[],events:[{id:`seed-${i}`,type:'submitted',actor:'consumer',at:createdAt,text:{en:'Complaint received',ar:'تم استلام الشكوى'}}],rating:status==='closed'?3+i%3:null};
 if(status==='awaiting_documents')c.messages.push({id:`request-${i}`,internal:false,actor:'officer',at:createdAt,text:'Please attach a copy of the bill. يرجى إرفاق نسخة من الفاتورة.'});
 if(c.resolvedAt)c.messages.push({id:`resolution-${i}`,internal:false,actor:'officer',at:c.resolvedAt,text:'The demonstration review is complete. تمت مراجعة الحالة الافتراضية.'});
 put('case',c.id,c);
 }
 const faq={ar:'أرفق تفاصيل المشكلة ورقم الحساب والمستندات الداعمة المتاحة. سيظهر أي طلب لمستندات إضافية في صفحة متابعة الشكوى. هذه إرشادات توضيحية للعرض وليست شروطاً رسمية.',en:'Include the issue, account reference and available supporting evidence. Requests for additional documents appear on your complaint tracking page. This is demonstration guidance, not official eligibility policy.'};
 put('content','faq',{id:'faq',title:{ar:'ما المستندات المطلوبة لتقديم شكوى؟',en:'What do I need to submit a complaint?'},published:faq,draft:faq,status:'published',version:1,history:[{version:1,actor:'publisher',at:new Date(now).toISOString()}]});
 put('settings','complaint',{owner:'officer',requiredDocument:false,requirements:{ar:'رقم الحساب وتفاصيل المشكلة وأي مستندات داعمة متاحة.',en:'Account reference, issue details and any available supporting documents.'},targetDays:7});
 db.exec('COMMIT');
 }catch(e){db.exec('ROLLBACK');throw e;}
 }
 if(!get('content','faq'))reset();
 return {db,get,all,put,del,reset};
}
