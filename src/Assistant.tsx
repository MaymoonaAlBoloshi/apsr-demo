import {useEffect,useRef,useState} from 'react';
import {MessageSquare,X,Send,BookOpen,RotateCcw,ArrowUpLeft,ArrowUpRight,Sparkles} from 'lucide-react';
import type {Localized} from './model';
import './assistant.css';
import AssistantMark from './AssistantMark';
import {assistantGuidance} from './assistantGuidance';
type Source={id:string;path:string;label:Localized;version?:number};
type Message={role:'user'|'assistant';text:string;sources?:Source[]};
type Props={open:boolean;lang:'ar'|'en';identity:string;role:string;page:string;onClose:()=>void;navigate:(path:string)=>void};
const errors:Record<string,Localized>={
 chat_invalid:{ar:'اكتب رسالة لا تتجاوز 3000 حرف. يمكنك بدء محادثة جديدة إذا طالت المحادثة الحالية.',en:'Use a message of up to 3,000 characters. Start a new conversation if this one is too long.'},
 chat_unavailable:{ar:'المساعد غير متاح حالياً. يمكنك متابعة الخدمة من دليل الخدمات.',en:'The assistant is currently unavailable. You can continue through the service catalogue.'},
 chat_busy:{ar:'المساعد مشغول حالياً. انتظر قليلاً ثم أعد المحاولة.',en:'The assistant is busy. Please wait a moment and try again.'},
 chat_timeout:{ar:'استغرقت الإجابة وقتاً أطول من المتوقع. يمكنك إعادة المحاولة.',en:'The reply took longer than expected. Please try again.'},
 chat_provider_error:{ar:'تعذر الاتصال بالمساعد. احتفظنا بسؤالك لتتمكن من إعادة المحاولة.',en:'Could not reach the assistant. Your question is kept so you can retry.'}
};
export default function Assistant({open,lang,identity,role,page,onClose,navigate}:Props){
 const t=(ar:string,en:string)=>lang==='ar'?ar:en;const Arrow=lang==='ar'?ArrowUpLeft:ArrowUpRight;
 const guidance=assistantGuidance(role,page,lang);
 const [messages,setMessages]=useState<Message[]>([]);const [input,setInput]=useState('');const [loading,setLoading]=useState(false);const [error,setError]=useState('');const [available,setAvailable]=useState<boolean|null>(null);
 const controller=useRef<AbortController|null>(null);const version=useRef(0);const pending=useRef(false);const bottom=useRef<HTMLDivElement>(null);const inputRef=useRef<HTMLTextAreaElement>(null);const triggerRef=useRef<HTMLElement|null>(null);
 const clear=()=>{version.current++;controller.current?.abort();pending.current=false;setMessages([]);setInput('');setError('');setLoading(false);};
 useEffect(()=>{clear();},[identity]);
 useEffect(()=>()=>{controller.current?.abort();},[]);
 useEffect(()=>{if(!open)return;triggerRef.current=document.activeElement as HTMLElement;inputRef.current?.focus();let active=true;fetch('/api/chat/status').then(r=>r.ok?r.json():Promise.reject()).then(d=>{if(active)setAvailable(d.available);}).catch(()=>{if(active)setAvailable(null);});return()=>{active=false;};},[open]);
 useEffect(()=>{if(open)bottom.current?.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});},[messages,loading,error,open]);
 const close=()=>{onClose();triggerRef.current?.focus();};
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
 if(!open)return null;
 return <aside className="assistant-panel ai-panel" role="dialog" aria-label={t('مساعد الخدمات','Service guide')} onKeyDown={e=>{if(e.key==='Escape')close();}}>
  <div className="assistant-head"><span className="round-icon"><AssistantMark/></span><div><b>{t('مساعد الخدمات','Service guide')}</b><small>{available===false?t('غير متاح حالياً','Currently unavailable'):t('مساعد ذكي لخدمات الهيئة','Your AI guide to APSR services')}</small></div><div className="chat-header-actions"><button className="icon-button" onClick={clear} title={t('محادثة جديدة','New conversation')} aria-label={t('محادثة جديدة','New conversation')}><RotateCcw size={16}/></button><button className="icon-button" onClick={close} aria-label={t('إغلاق','Close')}><X size={19}/></button></div></div>
  <div className="chat-context-note"><Sparkles size={13}/>{t('إجابات مستندة إلى محتوى الخدمات المنشور','Answers grounded in published service content')}</div>
  <div className="assistant-body" role="log" aria-live="polite" aria-relevant="additions text" aria-label={t('المحادثة','Conversation')}>
   {!messages.length&&<><div className="chat-bubble chat-welcome"><span className="chat-welcome-icon"><AssistantMark/></span><h3>{guidance.title}</h3><p>{guidance.description}</p></div><div className="chat-suggestions">{guidance.questions.map(q=><button className="suggestion" key={q} disabled={loading||available===false} onClick={()=>send(q)}>{q}<Arrow size={15}/></button>)}</div><button className="chat-direct-action" onClick={()=>{navigate(guidance.action.path);close();}}>{guidance.action.label}<Arrow size={16}/></button></>}
   {messages.map((m,i)=><div className={`chat-turn ${m.role}`} key={i}><small className="chat-speaker">{m.role==='user'?t('أنت','You'):t('مساعد الخدمات','Service guide')}</small><div className="chat-bubble"><p dir="auto">{m.text}</p>{!!m.sources?.length&&<div className="chat-sources">{m.sources.map(s=><button key={s.id} className="source" onClick={()=>{if(s.path.startsWith('https://apsr.om/'))window.open(s.path,'_blank','noopener,noreferrer');else navigate(s.path);close();}}><BookOpen size={13}/>{s.label[lang]}{s.version?` · v${s.version}`:''}<Arrow size={12}/></button>)}</div>}</div></div>)}
   {loading&&<div className="chat-thinking" role="status"><span><i/><i/><i/></span>{t('أراجع معلومات الخدمة...','Checking the service information...')}</div>}
   {error&&<div className="chat-error" role="alert"><p>{errors[error]?.[lang]||errors.chat_provider_error[lang]}</p><div><button onClick={()=>send(messages.at(-1)?.text||'',true)} disabled={loading}><RotateCcw size={14}/>{t('إعادة المحاولة','Retry')}</button><button onClick={()=>{navigate('/services');close();}}>{t('دليل الخدمات','Service catalogue')}<Arrow size={14}/></button></div></div>}
   {available===false&&!error&&<div className="chat-error"><p>{errors.chat_unavailable[lang]}</p><button onClick={()=>{navigate('/services');close();}}>{t('عرض الخدمات','View services')}<Arrow size={14}/></button></div>}
   <div ref={bottom}/>
  </div>
  <form className="chat-form" onSubmit={e=>{e.preventDefault();send(input);}}><textarea ref={inputRef} rows={2} maxLength={3000} aria-label={t('سؤالك','Your question')} placeholder={t('اكتب سؤالك...','Type your question...')} value={input} disabled={loading} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();send(input);}}}/><button aria-label={t('إرسال','Send')} disabled={loading||!input.trim()||available===false} type="submit"><Send size={19}/></button></form>
  <div className="chat-footnote">{t('راجع التفاصيل قبل إرسال طلبك.','Review the details before submitting your request.')}</div>
 </aside>;
}
