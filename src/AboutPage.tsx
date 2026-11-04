import {useEffect,useRef,useState} from 'react';
import {ArrowUpLeft,ArrowUpRight,ExternalLink} from 'lucide-react';
import './institutional.css';
import './about-motion.css';
const members=[
 ['salim-al-aufi.png','معالي المهندس سالم بن ناصر العوفي','H.E. Eng. Salim bin Nasser Al Aufi'],
 ['adham-al-said.png','صاحب السمو السيد الدكتور أدهم بن تركي آل سعيد','H.H. Sayyid Dr. Adham bin Turki Al Said'],
 ['mohammed-al-mutawwa.png','سعادة الدكتور محمد بن علي المطوع','H.E. Dr. Mohammed bin Ali Al Mutawwa'],
 ['ibtisam-al-faroujiya.png','سعادة ابتسام بنت أحمد الفروجية','H.E. Ibtisam bint Ahmed Al Faroujiya'],
 ['abdul-wahid-al-murshidi.png','الفاضل عبد الواحد بن محمد المرشدي','Mr. Abdul Wahid Al Murshidi'],
 ['shatha-al-maskiry.png','الفاضلة شذى بنت سليم المسكري','Ms. Shatha bint Salim Al Maskiry'],
 ['intisar-al-kandiyah.jpg','الفاضلة انتصار بنت حمود الكندية','Ms. Intisar bint Hamoud Al Kandiyah']
];
export default function AboutPage({lang,navigate}:{lang:'ar'|'en';navigate:(path:string)=>void}){
 const root=useRef<HTMLDivElement>(null);
 const [activeSection,setActiveSection]=useState('authority');
 useEffect(()=>{
  const container=root.current;
  if(!container||!('IntersectionObserver' in window))return;
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const nodes=Array.from(container.querySelectorAll<HTMLElement>('[data-about-reveal]'));
  const reveal=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(entry.isIntersecting){entry.target.classList.add('about-visible');reveal.unobserve(entry.target);}
  }),{threshold:0.08,rootMargin:'0px 0px -24px 0px'});
  if(!media.matches)nodes.forEach(node=>{node.classList.add('about-pending');reveal.observe(node);});
  const showAll=()=>{if(media.matches){nodes.forEach(node=>node.classList.add('about-visible'));reveal.disconnect();}};
  const focusReveal=(event:FocusEvent)=>{const target=(event.target as HTMLElement).closest('[data-about-reveal]');target?.classList.add('about-visible');};
  container.addEventListener('focusin',focusReveal);
  media.addEventListener('change',showAll);
  const sections=new IntersectionObserver(entries=>{
   const current=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top)[0];
   if(current)setActiveSection(current.target.id);
  },{rootMargin:'-15% 0px -55% 0px',threshold:0});
  container.querySelectorAll('section[id]').forEach(section=>sections.observe(section));
  return()=>{reveal.disconnect();sections.disconnect();media.removeEventListener('change',showAll);container.removeEventListener('focusin',focusReveal);};
 },[]);
 const jump=(id:string)=>{setActiveSection(id);document.getElementById(id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});};
 const t=(ar:string,en:string)=>lang==='ar'?ar:en;const Arrow=lang==='ar'?ArrowUpLeft:ArrowUpRight;
 return <div ref={root} className="container institutional-page about-page">
  <div className="knowledge-breadcrumb"><button onClick={()=>navigate('/')}>{t('الرئيسية','Home')}</button><span>/</span>{t('عن الهيئة','About APSR')}</div>
  <header className="institutional-heading" data-about-reveal><span className="section-index">{t('هيئة تنظيم الخدمات العامة','AUTHORITY FOR PUBLIC SERVICES REGULATION')}</span><h1>{t('عن الهيئة','About the Authority')}</h1><p>{t('التنظيم والرقابة على خدمات أساسية في سلطنة عُمان.','Regulation and oversight of essential services in Oman.')}</p></header>
  <nav className="about-section-nav" aria-label={t('أقسام الصفحة','On this page')}><a href="#authority" aria-current={activeSection==='authority'?'location':undefined} onClick={event=>{event.preventDefault();jump('authority');}}>{t('عن الهيئة','The Authority')}</a><a href="#vision" aria-current={activeSection==='vision'?'location':undefined} onClick={event=>{event.preventDefault();jump('vision');}}>{t('الرؤية والرسالة','Vision & mission')}</a><a href="#chairman" aria-current={activeSection==='chairman'?'location':undefined} onClick={event=>{event.preventDefault();jump('chairman');}}>{t('كلمة الرئيس','Chairman’s foreword')}</a><a href="#board" aria-current={activeSection==='board'?'location':undefined} onClick={event=>{event.preventDefault();jump('board');}}>{t('مجلس الإدارة','Board members')}</a></nav>
  <section id="authority" className="authority-introduction"><figure data-about-reveal className="about-photo"><img src="/about/authority.png" alt={t('مقر هيئة تنظيم الخدمات العامة','APSR reception')} width="1200" height="675"/><figcaption>{t('مقر الهيئة، من الموقع الرسمي','APSR reception, from the official website')}</figcaption></figure><div data-about-reveal><h2>{t('دور الهيئة','The Authority’s role')}</h2><p>{t('تنظم الهيئة خدمات الكهرباء والمياه والصرف الصحي وشبكات نقل الغاز الطبيعي. ويركز دورها على حماية المستفيدين وجودة الخدمة وكفاءة القطاع واستدامة الاستثمار.','APSR oversees electricity, water, wastewater and natural gas transmission. Its role brings together consumer protection, service quality, sector efficiency and sustainable investment.')}</p><p>{t('بدأت أعمالها بموجب المرسوم السلطاني 78/2004، ثم اتسع اختصاصها في عام 2020 ليشمل نقل الغاز الطبيعي والمياه والصرف الصحي. ويعرض الموقع أيضاً دورها في تنظيم النفايات.','Established under Royal Decree 78/2004, its remit expanded in 2020 to include natural gas transmission, water and wastewater. The website also describes its role in waste regulation.')}</p><button className="text-button" onClick={()=>navigate('/sectors')}>{t('تعرّف على القطاعات','Understand the sectors')}<Arrow size={18}/></button></div></section>
  <section id="vision" className="authority-purpose"><article data-about-reveal><span>01</span><h2>{t('الرؤية','Vision')}</h2><p>{t('تنظيم متوازن ومستدام يدعم رفاه المجتمع وازدهار الاقتصاد.','Balanced, sustainable regulation that supports community wellbeing and a thriving economy.')}</p></article><article data-about-reveal><span>02</span><h2>{t('الرسالة','Mission')}</h2><p>{t('منظومة تنظيمية فاعلة ومرنة، تدعم أمان الخدمات ورضا المستفيدين وكفاءة الإنفاق، وتشجع الابتكار والتنافسية.','Effective, adaptable regulation that supports safe services, user satisfaction and efficient spending, while encouraging innovation and competition.')}</p></article></section>
  <section id="chairman" className="chairman-section"><div data-about-reveal><span className="section-index">{t('قيادة الهيئة','LEADERSHIP')}</span><h2>{t('كلمة الرئيس','Chairman’s foreword')}</h2><p>{t('تؤكد كلمة الرئيس أهمية تطوير القطاعات من خلال الممارسات التنظيمية والإدارية والفنية، ومواكبة جهود الحكومة لتحسين الخدمات.','The chairman’s foreword emphasises developing the regulated sectors through regulatory, administrative and technical practice, alongside government efforts to improve services.')}</p><h3>{t('سعادة الدكتور منصور بن طالب الهنائي','H.E. Dr. Mansoor bin Talib Al Hinai')}</h3><small>{t('رئيس هيئة تنظيم الخدمات العامة','Chairman, Authority for Public Services Regulation')}</small></div><div className="about-chairman-photo about-photo" data-about-reveal><img src="/about/chairman.png" alt={t('سعادة الدكتور منصور بن طالب الهنائي','H.E. Dr. Mansoor bin Talib Al Hinai')} width="1400" height="788" loading="lazy"/></div></section>
  <section id="board" className="board-section"><div className="section-heading" data-about-reveal><h2>{t('أعضاء مجلس الإدارة','Board members')}</h2><a className="knowledge-source" href="https://apsr.om/pages/about-us-lb" target="_blank" rel="noopener noreferrer">{t('الموقع الرسمي','Official website')}<ExternalLink size={14}/></a></div><div className="board-grid">{members.map(([image,ar,en],index)=><article key={image} data-about-reveal style={{transitionDelay:`${(index%3)*90}ms`}}><img src={'/about/'+image} width="805" height="444" loading="lazy" alt={t(ar,en)}/><h3>{t(ar,en)}</h3></article>)}</div></section>
  <div className="institutional-source"><p>{t('الصور والأسماء من صفحة الهيئة الرسمية. النصوص ملخصة بالعربية والإنجليزية. تمت المراجعة في 4 نوفمبر 2026.','Images and names from APSR’s official About Us page. Text is summarised in Arabic and English. Reviewed 4 November 2026.')}</p><a href="https://apsr.om/pages/about-us-lb" target="_blank" rel="noopener noreferrer">{t('اقرأ الصفحة الأصلية','Read the original page')}<ExternalLink size={14}/></a></div>
 </div>;
}
