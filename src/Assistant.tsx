import GuidedAssistant from './GuidedAssistant';
import {useEffect,useRef,useState} from 'react';
import {MessageSquare,X,Send,BookOpen,RotateCcw,ArrowUpLeft,ArrowUpRight,Copy,Check,Square,LoaderCircle,ArrowRight,Maximize2,Minimize2} from 'lucide-react';
import type {Localized} from './model';
import './assistant.css';
import './assistant-studio.css';
import {assistantGuidance} from './assistantGuidance';
type Source={id:string;path:string;label:Localized;version?:number};
type Message={role:'user'|'assistant';text:string;sources?:Source[]};
type Props={open:boolean;lang:'ar'|'en';identity:string;role:string;page:string;onClose:()=>void;navigate:(path:string)=>void};
const errors:Record<string,Localized>={
 chat_invalid:{ar:'اكتب رسالة لا تتجاوز 3000 حرف. يمكنك بدء محادثة جديدة إذا طالت المحادثة الحالية.',en:'Use a message of up to 3,000 characters. Start a new conversation if this one is too long.'},
 chat_unavailable:{ar:'المساعد غير متاح حالياً. يمكنك متابعة الخدمة من دليل الخدمات.',en:'The assistant is currently unavailable. You can continue through the service catalogue.'},
 chat_busy:{ar:'المساعد مشغول حالياً. انتظر قليلاً ثم أعد المحاولة.',en:'The assistant is busy. Please wait a moment and try again.'},
 chat_timeout:{ar:'استغرقت الإجابة وقتاً أطول من المتوقع. يمكنك إعادة المحاولة.',en:'The reply took longer than expected. Please try again.'},
 chat_provider_error:{ar:'تعذر الحصول على إجابة من المساعد حالياً. يمكنك إعادة المحاولة أو متابعة الدليل خطوة بخطوة.',en:'The AI could not answer right now. Try again or continue with the step-by-step guide.'}
};
export default function Assistant({open,lang,identity,role,page,onClose,navigate}:Props){
 const t=(ar:string,en:string)=>lang==='ar'?ar:en;const Arrow=lang==='ar'?ArrowUpLeft:ArrowUpRight;
 const guidance=assistantGuidance(role,page,lang);
 const panelRef=useRef<HTMLElement>(null);
 const [expanded,setExpanded]=useState(false);
 const [mode,setMode]=useState<'guide'|'chat'>('guide');const [guideVersion,setGuideVersion]=useState(0);
 const [copied,setCopied]=useState<number|null>(null);const [copyError,setCopyError]=useState(false);
 const [messages,setMessages]=useState<Message[]>([]);const [input,setInput]=useState('');const [loading,setLoading]=useState(false);const [error,setError]=useState('');const [available,setAvailable]=useState<boolean|null>(null);
 const controller=useRef<AbortController|null>(null);const version=useRef(0);const pending=useRef(false);const bottom=useRef<HTMLDivElement>(null);const inputRef=useRef<HTMLTextAreaElement>(null);const triggerRef=useRef<HTMLElement|null>(null);
 const clear=()=>{version.current++;controller.current?.abort();pending.current=false;setMessages([]);setMode('guide');setGuideVersion(v=>v+1);setCopied(null);setCopyError(false);setInput('');setError('');setLoading(false);};
 useEffect(()=>{clear();},[identity]);
 useEffect(()=>()=>{controller.current?.abort();},[]);
 useEffect(()=>{if(open&&mode==='chat')inputRef.current?.focus();},[mode,open]);
 useEffect(()=>{if(!open)return;triggerRef.current=document.activeElement as HTMLElement;inputRef.current?.focus();let active=true;fetch('/api/chat/status').then(r=>r.ok?r.json():Promise.reject()).then(d=>{if(active)setAvailable(d.available);}).catch(()=>{if(active)setAvailable(null);});return()=>{active=false;};},[open]);
 useEffect(()=>{if(open&&!messages.length&&!loading&&!error){bottom.current?.parentElement?.scrollTo({top:0});return;}if(open)bottom.current?.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});},[messages,loading,error,open]);
 useEffect(()=>{
  if(!open||!panelRef.current)return;
  const panel=panelRef.current;
  const siblings=Array.from(panel.parentElement?.children||[]).filter((el):el is HTMLElement=>el instanceof HTMLElement&&el!==panel&&!el.classList.contains('assistant-backdrop'));
  const previous=siblings.map(el=>({el,inert:el.inert}));previous.forEach(({el})=>{el.inert=true;});
  const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
  panel.querySelector<HTMLButtonElement>('.chat-header-actions button')?.focus({preventScroll:true});
  return()=>{previous.forEach(({el,inert})=>{el.inert=inert;});document.body.style.overflow=overflow;};
 },[open]);
 const close=()=>{onClose();requestAnimationFrame(()=>triggerRef.current?.focus({preventScroll:true}));};
 async function send(question:string,retry=false){
  if(pending.current||!question.trim())return;
  const next:Message[]=retry?messages:[...messages,{role:'user',text:question.trim()}];
  pending.current=true;setMessages(next);setInput('');setError('');setLoading(true);
  const current=version.current;const abort=new AbortController();controller.current=abort;const timeout=setTimeout(()=>abort.abort('timeout'),65000);
  try{
   const response=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},signal:abort.signal,body:JSON.stringify({lang,page,messages:next.slice(-15).map(({role,text})=>({role,text}))})});
   const data=await response.json();if(!response.ok)throw new Error(data.error||'chat_provider_error');
   if(current!==version.current)return;
   if(typeof data.text!=='string'||!data.text.trim())throw new Error('chat_provider_error');
   setMessages([...next,{role:'assistant',text:data.text,sources:data.sources||[]}]);setAvailable(true);
  }catch(e){if(current!==version.current)return;setError(abort.signal.aborted?'chat_timeout':(e as Error).message in errors?(e as Error).message:'chat_provider_error');}
  finally{clearTimeout(timeout);if(current===version.current){pending.current=false;setLoading(false);inputRef.current?.focus();}}
 }
 const stop=()=>{version.current++;controller.current?.abort();pending.current=false;setLoading(false);setError('');setInput(messages.at(-1)?.role==='user'?messages.at(-1)!.text:'');setMessages(ms=>ms.at(-1)?.role==='user'?ms.slice(0,-1):ms);};
 const copy=async(text:string,index:number)=>{try{await navigator.clipboard.writeText(text);setCopied(index);setCopyError(false);}catch{setCopyError(true);}};
 if(!open)return null;
 return <><div className="assistant-backdrop" aria-hidden="true" onClick={close}/><aside ref={panelRef} aria-modal="true" className={`assistant-panel ai-panel ${expanded?'chat-expanded':''} mode-${mode}`} role="dialog" aria-label={t('مساعد الخدمات','Service guide')} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){const items=Array.from(panelRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],textarea:not(:disabled),summary,[tabindex="0"]')||[]).filter(el=>el.getClientRects().length&&!el.closest('[hidden]'));const first=items[0],last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}}}>
  <div className="assistant-head"><span className="round-icon"><MessageSquare size={21}/></span><div><b>{t('مساعد الخدمات','Service guide')}</b><small>{available===false?t('غير متاح حالياً','Currently unavailable'):t('من سؤالك إلى الخطوة المناسبة','Find the right service. Know what comes next.')}</small></div><div className="chat-header-actions"><button className="icon-button chat-expand" onClick={()=>setExpanded(v=>!v)} aria-label={expanded?t('تصغير المساعد','Reduce assistant'):t('توسيع المساعد','Expand assistant')} aria-pressed={expanded}>{expanded?<Minimize2 size={17}/>:<Maximize2 size={17}/>}</button><button className="icon-button" onClick={clear} title={t('محادثة جديدة','New conversation')} aria-label={t('محادثة جديدة','New conversation')}><RotateCcw size={16}/></button><button className="icon-button" onClick={close} aria-label={t('إغلاق','Close')}><X size={19}/></button></div></div>
  <div className="chat-mode-tabs" role="group" aria-label={t('طريقة المساعدة','Help mode')}><button aria-pressed={mode==='guide'} onClick={()=>setMode('guide')}>{t('خطوة بخطوة','Step by step')}</button><button aria-pressed={mode==='chat'} onClick={()=>setMode('chat')}>{t('اسأل المساعد','Ask the assistant')}</button></div>
  <div hidden={mode!=='guide'} className="assistant-body guide-body"><GuidedAssistant key={identity+'-'+guideVersion} lang={lang} role={role} navigate={path=>{navigate(path);close();}} ask={question=>{setMode('chat');setInput(question);}}/></div>
  {mode==='chat'&&<><div className="assistant-body" role="log" aria-live="polite" aria-relevant="additions text" aria-label={t('المحادثة','Conversation')}>
   {!messages.length&&<><div className="chat-suggestions">{guidance.questions.map((q,index)=><button className="suggestion" key={q} disabled={loading||available===false} onClick={()=>send(q)}><span className="chat-task-number">0{index+1}</span><span>{q}</span><Arrow size={16}/></button>)}</div><button className="chat-direct-action" onClick={()=>{navigate(guidance.action.path);close();}}>{guidance.action.label}<Arrow size={16}/></button></>}
   {messages.map((m,i)=><div className={`chat-turn ${m.role}`} key={i}><small className="chat-speaker">{m.role==='user'?t('أنت','You'):t('مساعد الخدمات','Service guide')}</small><div className="chat-bubble"><div className="chat-answer" dir="auto">{m.text.split(/\n\s*\n/).map((part,j)=><p key={j}>{part}</p>)}</div>{!!m.sources?.length&&<div className="chat-sources">{m.sources.map(s=><button key={s.id} className="source" onClick={()=>{if(s.path.startsWith('https://apsr.om/'))window.open(s.path,'_blank','noopener,noreferrer');else navigate(s.path);close();}}><BookOpen size={13}/>{s.label[lang]}<Arrow size={12}/></button>)}</div>}{m.role==='assistant'&&<button className="chat-copy" aria-label={t('نسخ الإجابة','Copy answer')} onClick={()=>copy(m.text,i)}>{copied===i?<Check size={14}/>:<Copy size={14}/>} {copied===i?t('تم النسخ','Copied'):t('نسخ','Copy')}</button>}</div></div>)}
   {loading&&<div className="chat-thinking" role="status"><LoaderCircle className="chat-loading-icon" size={18}/>{t('أجهّز إجابة مستندة إلى إرشادات الخدمة…','Preparing an answer using the service guidance…')}</div>}
   {error&&<div className="chat-error" role="alert"><p>{errors[error]?.[lang]||errors.chat_provider_error[lang]}</p><div><button onClick={()=>send(messages.at(-1)?.text||'',true)} disabled={loading}><RotateCcw size={14}/>{t('إعادة المحاولة','Retry')}</button><button onClick={()=>setMode('guide')}>{t('متابعة خطوة بخطوة','Continue step by step')}<Arrow size={14}/></button></div></div>}
   {available===false&&!error&&<div className="chat-error"><p>{errors.chat_unavailable[lang]}</p><button onClick={()=>{navigate('/services');close();}}>{t('عرض الخدمات','View services')}<Arrow size={14}/></button></div>}
   {copyError&&<p role="status" className="chat-copy-notice">{t('تعذر النسخ تلقائياً. يمكنك تحديد النص ونسخه.','Automatic copy is unavailable. You can select and copy the text.')}</p>}
   <div ref={bottom}/>
  </div>
  {!!messages.length&&<button className="chat-workspace-link" onClick={()=>{navigate(guidance.action.path);close();}}><span>{guidance.action.label}</span><Arrow size={17}/></button>}
  <form className="chat-form" onSubmit={e=>{e.preventDefault();send(input);}}><textarea ref={inputRef} rows={2} maxLength={3000} aria-label={t('سؤالك','Your question')} placeholder={t('ما الذي تحتاج إلى توضيحه؟','What would you like help understanding?')} value={input} disabled={loading} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();send(input);}}}/><button hidden={loading} aria-label={t('إرسال','Send')} disabled={loading||!input.trim()||available===false} type="submit"><Send size={19}/></button>{loading&&<button type="button" aria-label={t('إيقاف الإجابة','Stop response')} onClick={stop}><Square size={17}/></button>}</form></>}
  <div className="chat-footnote">{mode==='guide'?t('يمكنك الرجوع وتغيير اختياراتك. لن نرسل طلباً أو نغيّر بياناتك هنا.','You can go back and change your choices. Nothing is submitted or changed here.'):t('لا تشارك بيانات شخصية هنا. يساعدك المساعد في الفهم والصياغة، وتراجع طلبك وترسله بنفسك.','Keep personal details out of chat. Get help understanding or drafting, then review and submit the request yourself.')}</div>
 </aside></>;
}
