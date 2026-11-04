import {ArrowUpLeft,ArrowUpRight,ExternalLink} from 'lucide-react';
import {sectorLessons} from './sectorContent';
import './institutional.css';
import ElectricityTariffs from './ElectricityTariffs';
export default function SectorsPage({lang,slug,navigate}:{lang:'ar'|'en';slug?:string;navigate:(path:string)=>void}){
 const t=(a:string,b:string)=>lang==='ar'?a:b;const Arrow=lang==='ar'?ArrowUpLeft:ArrowUpRight;
 const lesson=sectorLessons.find(s=>s.id===(slug||'electricity'));
 if(!lesson)return <div className="container"><h1>{t('القطاع غير موجود','Sector not found')}</h1><button className="primary" onClick={()=>navigate('/sectors')}>{t('عرض القطاعات','View sectors')}</button></div>;
 return <div className="container institutional-page sectors-page"><div className="knowledge-breadcrumb"><button onClick={()=>navigate('/')}>{t('الرئيسية','Home')}</button><span>/</span>{t('القطاعات','Sectors')}</div><header className="institutional-heading"><span className="section-index">{t('تعرّف على خدماتك','UNDERSTAND YOUR SERVICES')}</span><h1>{t('كيف تعمل القطاعات؟','How do the sectors work?')}</h1><p>{t('تعرّف على الجهات التي تقدم الخدمة، وكيف تصل إليك، ودور الهيئة في تنظيمها.','Understand who provides each service, how it reaches you and how APSR regulates it.')}</p></header>
 <nav className="sector-lesson-nav" aria-label={t('اختر القطاع','Choose a sector')}>{sectorLessons.map(s=><button key={s.id} aria-current={lesson.id===s.id?'page':undefined} onClick={()=>{navigate('/sectors/'+s.id);}}>{s.name[lang]}</button>)}</nav>
 <section className="sector-lesson"><div className="lesson-heading"><h2>{lesson.name[lang]}</h2><p>{lesson.intro[lang]}</p></div><div className="sector-reading-list">{lesson.steps.map((s,i)=><article key={s.title.en}><h3><span>{String(i+1).padStart(2,'0')}</span>{s.title[lang]}</h3><div>{s.body[lang].split('\n\n').map(paragraph=><p key={paragraph}>{paragraph}</p>)}</div></article>)}</div><aside className="sector-definition"><h3>{lesson.term[lang]}</h3><p>{lesson.definition[lang]}</p></aside></section>
 {lesson.id==='electricity'&&<ElectricityTariffs lang={lang}/>}
 <section className="lesson-responsibilities"><article><h2>{t('ما دور الهيئة؟','What does APSR do?')}</h2><p>{lesson.role[lang]}</p></article><article><h2>{t('ما الذي يهمك كمستفيد؟','What does this mean for you?')}</h2><p>{lesson.takeaway[lang]}</p><button className="text-button" onClick={()=>navigate(lesson.next)}>{lesson.nextLabel[lang]}<Arrow size={17}/></button></article></section>
 <div className="institutional-source"><p>{t('ملخص تعليمي من محتوى الهيئة المنشور، تمت مراجعته في 4 نوفمبر 2026. راجع صفحة القطاع الأصلية للاطلاع على أحدث المعلومات.','An educational summary of APSR’s published content, reviewed 4 November 2026. Check the original sector page for the latest information.')}</p><a href={lesson.source} target="_blank" rel="noopener noreferrer">{t('المصدر: هيئة تنظيم الخدمات العامة','Source: Authority for Public Services Regulation')}<ExternalLink size={14}/></a></div>
 </div>;
}
