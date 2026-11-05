import {useEffect,useRef} from 'react';
import {ExternalLink} from 'lucide-react';
export default function HomeStats({lang}:{lang:'ar'|'en'}){
 const root=useRef<HTMLElement>(null);
 useEffect(()=>{
  const container=root.current;if(!container)return;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const nodes=Array.from(container.querySelectorAll<HTMLElement>('[data-stat]'));
  if(!('IntersectionObserver' in window))return;
  const order=nodes.map((_,i)=>i);for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
  const pending=new Map<HTMLElement,{start:number;value:string;number:number;digits:number;prefix:string;suffix:string}>();let frame=0;
  const finish=(node:HTMLElement)=>{const number=node.querySelector<HTMLElement>('[data-count]');if(number)number.textContent=number.dataset.count||'';node.classList.remove('stat-pending');node.classList.add('stat-visible');pending.delete(node);};
  const tick=(now:number)=>{frame=0;pending.forEach((entry,node)=>{if(now<entry.start)return;node.classList.add('stat-visible');const progress=Math.min(1,(now-entry.start)/2200);const eased=1-Math.pow(1-progress,3);const number=node.querySelector<HTMLElement>('[data-count]');if(number)number.textContent=entry.prefix+(entry.number*eased).toLocaleString('en-US',{minimumFractionDigits:entry.digits,maximumFractionDigits:entry.digits})+entry.suffix;if(progress===1)finish(node);});if(pending.size)frame=requestAnimationFrame(tick);};
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;const node=entry.target as HTMLElement;observer.unobserve(node);if(media.matches||document.hidden){finish(node);return;}const value=node.querySelector<HTMLElement>('[data-count]')?.dataset.count||'0';const numeric=value.replace(/[^0-9.]/g,'');pending.set(node,{start:performance.now()+order[nodes.indexOf(node)]*180,value,number:Number(numeric),digits:numeric.split('.')[1]?.length||0,prefix:value.startsWith('≈')?'≈':'',suffix:value.endsWith('%')?'%':value.endsWith('+')?'+':''});if(!frame)frame=requestAnimationFrame(tick);}),{threshold:.2});
  nodes.forEach(node=>{if(media.matches)finish(node);else{node.classList.add('stat-pending');observer.observe(node);}});
  const reduce=()=>{if(media.matches){cancelAnimationFrame(frame);frame=0;observer.disconnect();nodes.forEach(finish);}};
  const hidden=()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;Array.from(pending.keys()).forEach(finish);}};
  media.addEventListener('change',reduce);document.addEventListener('visibilitychange',hidden);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();media.removeEventListener('change',reduce);document.removeEventListener('visibilitychange',hidden);nodes.forEach(finish);};
 },[]);
 const t=(ar:string,en:string)=>lang==='ar'?ar:en;
 const briefing=t('معلن في مارس 2026','Reported March 2026');
 const groups=[
 {title:t('حماية المستفيدين','Consumer support'),items:[
 {value:'7,000+',label:t('شكوى تم التعامل معها','Complaints handled'),note:'2025'},
 {value:'≈153,000',unit:t('ر.ع.','OMR'),label:t('تعويضات دُفعت للمشتركين','Compensation paid to customers'),note:briefing},
 {value:'9,000+',label:t('مشترك استفاد من التعويضات','Customers receiving compensation'),note:briefing}]},
 {title:t('خدمات أكثر اتصالاً','Digital services'),items:[
 {value:'99%',label:t('التحول إلى عدادات المياه الذكية','Water smart-meter transition'),note:briefing},
 {value:'80%',label:t('التحول إلى عدادات الكهرباء الذكية','Electricity smart-meter transition'),note:briefing},
 {value:'100%',label:t('رقمنة خدمات الهيئة','APSR services digitised'),note:briefing}]},
 {title:t('تطوير القطاعات','Sector development'),items:[
 {value:'≈3.4',unit:t('مليار ر.ع.','billion OMR'),label:t('استثمارات في القطاعات المنظمة','Investment in regulated sectors'),note:t('2021 إلى 2025','2021 to 2025')},
 {value:'9.46%',label:t('حصة الطاقة المتجددة من إنتاج الكهرباء','Renewable share of electricity generation'),note:'2025'},
 {value:'≈2,050',label:t('وظيفة مستحدثة في الخدمات الأساسية','Jobs created in essential services'),note:'2025'}]}
 ];
 return <section ref={root} className="home-stats home-stats-expanded" aria-labelledby="home-stats-title"><div className="home-stats-context" data-reveal><div><span className="section-index">{t('مؤشرات منشورة','PUBLISHED INDICATORS')}</span><h2 id="home-stats-title">{t('الهيئة والقطاعات بالأرقام','APSR and the sectors in numbers')}</h2><p>{t('من اللقاء الإعلامي للهيئة في 31 مارس 2026. الفترة موضحة لكل مؤشر.','From APSR’s media briefing on 31 March 2026. Each indicator shows its reporting period.')}</p></div><a href="https://www.argaam.com/ar/article/articledetail/id/1892206" target="_blank" rel="noopener noreferrer">{t('العُمانية عبر أرقام','ONA via Argaam')}<ExternalLink size={15}/></a></div><div className="home-stat-groups">{groups.map((group,i)=><div className="home-stat-group" key={i}><h3><span>0{i+1}</span>{group.title}</h3><dl>{group.items.map((item,index)=><div key={index} data-stat><dt>{item.label}<small>{item.note}</small></dt><dd><b dir="ltr" aria-hidden="true" data-count={item.value}>{item.value}</b><span className="sr-only">{item.value}</span>{item.unit&&<span>{item.unit}</span>}</dd></div>)}</dl></div>)}</div></section>;
}
