import {useEffect,useRef,useState} from 'react';
import {Download,Share,WifiOff,X} from 'lucide-react';
import './pwa.css';
type InstallEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:'accepted'|'dismissed'}>};
export function ConnectionStatus({lang}:{lang:'ar'|'en'}){
 const [online,setOnline]=useState(navigator.onLine);
 useEffect(()=>{const update=()=>setOnline(navigator.onLine);addEventListener('online',update);addEventListener('offline',update);return()=>{removeEventListener('online',update);removeEventListener('offline',update);};},[]);
 return online?null:<div className="connection-status" role="status"><WifiOff size={18}/><span>{lang==='ar'?'أنت غير متصل. أعد الاتصال لحفظ الطلبات وإرسال الرسائل.':'You’re offline. Reconnect to save requests and send messages.'}</span></div>;
}
export default function PwaInstall({lang}:{lang:'ar'|'en'}){
 const t=(ar:string,en:string)=>lang==='ar'?ar:en;
 const [prompt,setPrompt]=useState<InstallEvent|null>(null);
 const [installed,setInstalled]=useState(()=>matchMedia('(display-mode: standalone)').matches||Boolean((navigator as Navigator&{standalone?:boolean}).standalone));
 const dialog=useRef<HTMLDialogElement>(null);const trigger=useRef<HTMLButtonElement>(null);
 const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 useEffect(()=>{
  const before=(event:Event)=>{event.preventDefault();setPrompt(event as InstallEvent);};
  const done=()=>{setInstalled(true);setPrompt(null);dialog.current?.close();};
  const mode=matchMedia('(display-mode: standalone)');const change=()=>setInstalled(mode.matches||Boolean((navigator as Navigator&{standalone?:boolean}).standalone));
  addEventListener('beforeinstallprompt',before);addEventListener('appinstalled',done);mode.addEventListener('change',change);
  if(import.meta.env.PROD&&'serviceWorker' in navigator&&window.isSecureContext)navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'}).catch(error=>console.warn('Offline support could not start.',error));
  return()=>{removeEventListener('beforeinstallprompt',before);removeEventListener('appinstalled',done);mode.removeEventListener('change',change);};
 },[]);
 const install=async()=>{if(prompt){try{await prompt.prompt();await prompt.userChoice;}catch{dialog.current?.showModal();}finally{setPrompt(null);}}else dialog.current?.showModal();};
 if(installed)return null;
 return <><button ref={trigger} className="install-app" onClick={install}><Download size={19}/>{t('أضف البوابة إلى جهازك','Add the portal to your device')}</button><dialog ref={dialog} className="install-dialog" aria-labelledby="install-title" onClose={()=>trigger.current?.focus()} onClick={e=>{if(e.target===e.currentTarget){const rect=e.currentTarget.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)e.currentTarget.close();}}}>
 <button className="icon-button install-close" onClick={()=>dialog.current?.close()} aria-label={t('إغلاق','Close')}><X size={20}/></button><img src="/icons/icon-192.png" alt="" width="64" height="64"/><span className="install-label">APSR DEMO</span><h2 id="install-title">{t('خدماتك على الشاشة الرئيسية','Your services on your home screen')}</h2><p>{t('افتح البوابة مباشرة من جهازك. تحتاج الخدمات ومتابعة الطلبات إلى اتصال بالإنترنت.','Open the portal directly from your device. Services and request tracking need an internet connection.')}</p>
 <ol>{ios?<><li><Share size={17}/>{t('افتح قائمة المشاركة في المتصفح.','Open the browser’s Share menu.')}</li><li>{t('اختر «إضافة إلى الشاشة الرئيسية»، ثم «إضافة».','Choose “Add to Home Screen”, then “Add”.')}</li></>:<><li>{t('افتح قائمة المتصفح.','Open your browser’s menu.')}</li><li>{t('اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية» إن كان الخيار متاحاً.','Choose “Install app” or “Add to Home Screen” if available.')}</li></>}</ol><small>{t('إذا لم يظهر الخيار، افتح الرابط في Safari على iPhone أو Chrome على Android.','If the option is missing, open this site in Safari on iPhone or Chrome on Android.')}</small>
 </dialog></>;
}
