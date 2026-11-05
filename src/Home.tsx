import {useEffect,useRef,useState} from 'react';
import {ArrowUpLeft,ArrowUpRight,ArrowDown,ArrowLeft,ArrowRight,MessageSquare,Activity,Building2,Zap,Droplets,Flame,Leaf,Globe,Smartphone,Plus,Minus} from 'lucide-react';
import {sectorNames} from './model';
import './home.css';
import './hero.css';
import HeroMark from './HeroMark';
import HomeStats from './HomeStats';
import './home-motion.css';
import MediaSection from './MediaSection';
import {KnowledgePreview} from './Knowledge';
type Props={lang:'ar'|'en';navigate:(path:string)=>void;track:()=>void;assist:()=>void};
const sectorCopy={
 electricity:{ar:'معلومات واضحة عن خدمات الكهرباء، ومسار مباشر لتقديم الشكاوى ومتابعتها.',en:'Clear information about electricity services, with a direct path to raise and follow a concern.'},
 water:{ar:'اعثر على معلومات خدمات المياه، وشارك ملاحظاتك حول الفواتير وجودة الخدمة.',en:'Find information about water services and raise concerns about billing or service quality.'},
 sanitation:{ar:'تعرّف على خدمات الصرف الصحي، وقدّم استفسارك أو شكواك من مكان واحد.',en:'Explore sanitation services and find one place for your enquiry or complaint.'},
 gas:{ar:'اطّلع على المعلومات التنظيمية لنقل الغاز، والمسار المناسب لاستفساراتك.',en:'Explore gas transmission information and find the right channel for your enquiry.'},
 waste:{ar:'تعرّف على المعلومات المتعلقة بقطاع إدارة النفايات والخدمات المرتبطة به.',en:'Find information about the waste management sector and its related services.'}
};
export default function Home({lang,navigate,track,assist}:Props){
 const t=(ar:string,en:string)=>lang==='ar'?ar:en;const Arrow=lang==='ar'?ArrowUpLeft:ArrowUpRight;const InlineArrow=lang==='ar'?ArrowLeft:ArrowRight;
 const root=useRef<HTMLDivElement>(null);const [sector,setSector]=useState<keyof typeof sectorCopy>('electricity');
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const nodes=root.current?.querySelectorAll<HTMLElement>('[data-reveal]');if(!nodes||media.matches||!('IntersectionObserver'in window))return;const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}}),{threshold:0,rootMargin:'0px 0px -90px 0px'});nodes.forEach(n=>{n.classList.add('reveal-ready');n.querySelectorAll<HTMLElement>('.editorial-service,.knowledge-preview-grid button,.sector-entry,.quick-links-grid a,.media-tabs button,.home-stats dl>div').forEach((child,i)=>child.style.setProperty('--reveal-delay',`${Math.min(i,5)*120}ms`));observer.observe(n);});const change=()=>{if(media.matches){nodes.forEach(n=>n.classList.add('is-visible'));observer.disconnect();}};media.addEventListener('change',change);return()=>{observer.disconnect();media.removeEventListener('change',change);};},[]);
 const cards=[{n:'01',title:t('تقديم شكوى','Make yourself heard.'),description:t('لأن صوتك مهم. شاركنا المشكلة وسنتابعها معك خطوة بخطوة.','Your voice matters. Tell us what happened and follow every step toward an outcome.'),label:t('ابدأ شكواك','Submit a complaint'),icon:<MessageSquare/>,action:()=>navigate('/complaint')},{n:'02',title:t('متابعة طلبك','Know where you stand.'),description:t('كل التفاصيل، في مكان واحد. اطّلع على حالة طلبك والخطوة التالية.','Every detail in one place. See your request’s progress and what happens next.'),label:t('عرض طلباتي','Track my requests'),icon:<Activity/>,action:track},{n:'03',title:t('استثمر بثقة','Explore what’s possible.'),description:t('ابدأ بالمعلومة الصحيحة. تعرّف على التراخيص في القطاعات المنظمة.','Start with the right information. Explore licensing across regulated sectors.'),label:t('التراخيص والموافقات','Licences and approvals'),icon:<Building2/>,action:()=>navigate('/services')}];
 return <div className="home-page" ref={root}>
 <section className="identity-hero hero-refresh" aria-labelledby="hero-title">
  <img className="hero-muscat-image" src="/hero/muscat.jpg?v=2" width="1280" height="853" alt="" fetchPriority="high"/>
  <div className="identity-hero-grid">
   <div className="identity-copy"><div className="hero-kicker intro">{t('هيئة تنظيم الخدمات العامة','AUTHORITY FOR PUBLIC SERVICES REGULATION')}</div><h1 id="hero-title"><span className="hero-title-line"><span>{t('حقوقك محفوظة،','Your rights matter.')}</span></span><span className="hero-title-line"><em>{t('وخدماتك أقرب.','Your services, closer.')}</em></span></h1><p className="intro intro-three">{t('اعرف حقوقك. تابع طلبك. واعثر على الخدمة التي تحتاجها.','Know your rights. Follow your request. Find the service you need.')}</p><div className="identity-actions intro intro-four"><button className="primary" onClick={()=>navigate('/services')}>{t('استكشف الخدمات','Explore services')}<InlineArrow size={21}/></button><button className="text-button" onClick={assist}>{t('اسأل مساعد الخدمات','Ask the service guide')}<MessageSquare size={18}/></button></div></div>
   <HeroMark/>
  </div>
  <div className="hero-photo-credit"><a href="https://commons.wikimedia.org/wiki/File:Fort_Mutrah_in_Muscat,_Oman.jpg" target="_blank" rel="noopener noreferrer">{t('مطرح، مسقط · تصوير Safa Daneshvar','Mutrah, Muscat · Photo by Safa Daneshvar')}</a><a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener noreferrer">CC BY-SA 4.0</a><span>{t('قصّ وتراكب لوني أزرق','Cropped with blue overlay')}</span></div>
 </section>
 <HomeStats lang={lang}/>
 <section className="home-services" id="home-services" data-reveal>
  <div className="editorial-heading home-section-heading"><div><span className="section-index">{t('الخدمات الرقمية','DIGITAL SERVICES')}</span><h2>{t('بداية سهلة.','A simple start.')} {t('في كل مرة.','Every time.')}</h2><p>{t('خدمات واضحة، وخطوات أقل. اختر ما تحتاجه ودعنا نرشدك إلى ما بعده.','Clear services. Fewer steps. Choose what you need and find your way forward.')}</p></div><button className="text-button" onClick={()=>navigate('/services')}>{t('جميع الخدمات','All services')}<Arrow size={18}/></button></div>
  <div className="editorial-service-list">{cards.map(c=><button className="editorial-service" key={c.n} onClick={c.action}><span className="service-number">{c.n}</span><span className="editorial-service-icon">{c.icon}</span><span className="editorial-service-copy"><strong>{c.title}</strong><span>{c.description}</span></span><span className="editorial-service-action">{c.label}<span className="arrow-disc"><Arrow size={23}/></span></span></button>)}</div>
 </section>
 <KnowledgePreview lang={lang} navigate={navigate} assist={assist}/>
 <section className="sector-section"><div className="sector-intro home-section-heading" data-reveal><span className="section-index">{t('قطاعات تمس حياتك','PART OF YOUR EVERYDAY')}</span><h2>{t('خلف تفاصيل يومك،','Behind your everyday,')} {t('دور نعتز به.','a purpose we share.')}</h2></div><div className="sector-accordion">{Object.entries(sectorNames).map(([k,v],i)=>{const active=sector===k;return <div className={`sector-entry ${active?'is-open':''}`} key={k} data-reveal style={{transitionDelay:`${i*100}ms`}}><button aria-expanded={active} aria-controls={`sector-${k}`} onClick={()=>setSector(k as keyof typeof sectorCopy)}><span className="sector-entry-index">0{i+1}</span><span className="sector-entry-icon">{[<Zap/>,<Droplets/>,<Activity/>,<Flame/>,<Leaf/>][i]}</span><strong>{v[lang]}</strong>{active?<Minus size={19}/>:<Plus size={19}/>}</button><div id={`sector-${k}`} className="sector-disclosure" aria-hidden={!active} inert={!active}><div className="sector-disclosure-inner"><p>{sectorCopy[k as keyof typeof sectorCopy][lang]}</p><button className="text-button" onClick={()=>navigate('/sectors/'+(k==='sanitation'?'water':k))}>{t('تعرّف على القطاع','Understand this sector')}<InlineArrow size={16}/></button></div></div></div>;})}</div></section>

 <MediaSection lang={lang}/>

 </div>;
}
