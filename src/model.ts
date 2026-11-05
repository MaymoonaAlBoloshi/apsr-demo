import {officialServices} from './officialServices';
export type Localized={ar:string;en:string};
export type Actor={id:string;role:string;ar:string;en:string;providerId?:string};
export type Event={id:string;type:string;actor:string;at:string;text:Localized;internal?:boolean;caseId?:string};
export type Complaint={id:string;userId:string;sector:string;provider:string;providerId?:string|null;category?:string;finding?:string;demo?:boolean;account?:string;subject:string|Localized;description:string;status:string;owner:string|null;createdAt:string;updatedAt:string;dueAt:string;resolvedAt:string|null;documents:{id:string;name:string;size:number;at:string}[];messages:{id:string;actor:string;at:string;text:string;internal:boolean}[];events:Event[];rating:number|null};
export type Content={title:Localized;published:Localized;draft?:Localized;status?:string;version:number;history?:{version:number;actor:string;at:string}[]};
export type Settings={owner:string;requiredDocument:boolean;requirements:Localized;targetDays:number};
export type Upload={name:string;type:string;data:string};
export async function api<T=unknown>(path:string,method='GET',body?:unknown):Promise<T>{const r=await fetch('/api'+path,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});const data=await r.json();if(!r.ok)throw new Error(data.error);return data;}
export async function upload(file:File):Promise<Upload>{if(!['application/pdf','image/png','image/jpeg','text/plain'].includes(file.type))throw new Error('invalid_file');if(file.size>2*1024*1024||!file.size)throw new Error('file_size');return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve({name:file.name,type:file.type,data:String(reader.result).split(',')[1]});reader.onerror=()=>reject(new Error('invalid_file'));reader.readAsDataURL(file);});}
export const sectorNames:Record<string,Localized>={electricity:{ar:'الكهرباء',en:'Electricity'},water:{ar:'المياه',en:'Water'},sanitation:{ar:'الصرف الصحي',en:'Sanitation'},gas:{ar:'نقل الغاز',en:'Gas transmission'},waste:{ar:'إدارة النفايات',en:'Waste management'}};
export const statusNames:Record<string,Localized>={submitted:{ar:'تم الاستلام',en:'Submitted'},in_review:{ar:'قيد المراجعة',en:'In review'},awaiting_documents:{ar:'بانتظار المستندات',en:'Awaiting documents'},resolved:{ar:'تمت المعالجة',en:'Resolved'},closed:{ar:'مغلقة',en:'Closed'}};
export const services=[
 {id:'complaint',ar:'تقديم شكوى',en:'Submit a complaint',descAr:'لديك مشكلة مع أحد مزودي الخدمات؟ نحن هنا لمساعدتك.',descEn:'A concern with your service provider? We are here to help.',tagAr:'خدمة رقمية',tagEn:'Digital service',icon:'message'},
 {id:'tracking',ar:'متابعة طلباتي',en:'Track my requests',descAr:'تابع مستجدات طلبك وتواصل مع فريق الهيئة.',descEn:'Follow your request and stay connected with our team.',tagAr:'حسابي',tagEn:'My account',icon:'track'},
 ...officialServices.map(s=>({id:s.id,ar:s.title.ar,en:s.title.en,descAr:s.summary.ar,descEn:s.summary.en,tagAr:'التراخيص والموافقات',tagEn:'Licences & approvals',icon:'building'})),
 {id:'tariffs',ar:'التعرفة المعتمدة',en:'Permitted tariffs',descAr:'تعرّف على معلومات التعرفة للخدمات المنظمة.',descEn:'Find tariff information for regulated services.',tagAr:'المستهلكون',tagEn:'Consumers',icon:'chart'},
 {id:'publications',ar:'التشريعات والمنشورات',en:'Regulations & publications',descAr:'اطّلع على الأدلة والتشريعات والمنشورات التنظيمية.',descEn:'Explore guidance, regulations and publications.',tagAr:'المعرفة',tagEn:'Resources',icon:'book'},
 {id:'enquiry',ar:'تواصل معنا',en:'General enquiry',descAr:'اعثر على القناة المناسبة لسؤالك أو ملاحظتك.',descEn:'Find the right channel for your question or feedback.',tagAr:'الدعم',tagEn:'Support',icon:'mail'}
];
