import {ExternalLink} from 'lucide-react';
const links=[
 ['about-us-lb','عن الهيئة','About Us'],['e-services-lb','الخدمات الإلكترونية','E-Services'],['eparticipate-lb','المشاركة الإلكترونية','eParticipate'],['contact-us-lb','تواصل معنا','Contact Us'],['codes-lb','القواعد الفنية','Codes'],['reports-1-lb/documents?editMode=false&topicId=f1def606-f66d-4d82-a0e7-f4b012ab9dea','التقارير','Reports'],['tarrifs-lb','التعرفة','Tariffs']
];
export default function QuickLinks({lang}:{lang:'ar'|'en'}){return <nav className="official-quick-links" aria-labelledby="quick-links-title"><div><span className="section-index">APSR.OM</span><h2 id="quick-links-title">{lang==='ar'?'روابط سريعة':'Quick Links'}</h2></div><div className="quick-links-grid">{links.map(([path,ar,en])=><a key={path} href={'https://apsr.om/pages/'+path} target="_blank" rel="noopener noreferrer"><span>{lang==='ar'?ar:en}</span><ExternalLink size={16}/></a>)}</div></nav>;}
