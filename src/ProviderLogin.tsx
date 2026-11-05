import {useState} from 'react';
import {providers} from './providers';
export default function ProviderLogin({lang,busy,login}:{lang:'ar'|'en';busy:boolean;login:(id:string)=>void}){
 const [id,setId]=useState('nama-supply');const t=(ar:string,en:string)=>lang==='ar'?ar:en;
 return <div className="provider-login"><label>{t('حساب مزود الخدمة (تجريبي)','Provider account (demo)')}<select value={id} onChange={e=>setId(e.target.value)}>{providers.map(p=><option key={p.id} value={p.id}>{p.name[lang]}</option>)}</select></label><button className="primary" disabled={busy} onClick={()=>login('provider-'+id)}>{t('الدخول كمزود خدمة','Sign in as provider')}</button><small>{t('حسابات عرض ببيانات افتراضية، وليست حسابات الشركات الرسمية.','Demo accounts with fictional cases, not official company accounts.')}</small></div>;
}
