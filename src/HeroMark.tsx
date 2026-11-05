import {useEffect,useRef,type CSSProperties} from 'react';
// Nested triangles retain the offset opening of the mark.
const contours=Array.from({length:28},(_,i)=>{
 const t=i/27,outer=[[50,3],[99,88],[1,88]],inner=[[44,37],[72,65],[34,77]];
 return outer.map((p,j)=>p.map((v,k)=>v+(inner[j][k]-v)*t)).map(([x,y],j)=>`${j?'L':'M'}${x} ${y}`).join(' ')+'Z';
});
export default function HeroMark(){
 const root=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const mark=root.current,hero=mark?.closest<HTMLElement>('.hero-refresh');if(!mark||!hero)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let frame=0,timer:ReturnType<typeof setTimeout>|undefined,visible=false,idle=false,x=0,y=0;
  let bounds=mark.getBoundingClientRect();
  const rotateOnScroll=()=>{const b=hero.getBoundingClientRect();const progress=Math.max(0,Math.min(1,-b.top/Math.max(b.height,1)));mark.style.setProperty('--mark-scroll',`${reduced.matches?0:progress*90}deg`);};
  const active=()=>visible&&!document.hidden&&!reduced.matches;
  const clearTimer=()=>{if(timer!==undefined){clearTimeout(timer);timer=undefined;}};
  const rest=()=>{clearTimer();if(idle&&active())timer=setTimeout(()=>{timer=undefined;if(active()){idle=false;mark.classList.remove('motion-resting');}},12000);};
  const neutral=()=>{mark.classList.remove('is-interacting');x=0;y=0;mark.style.setProperty('--mark-turn','0deg');mark.style.setProperty('--mark-pitch','0deg');mark.style.setProperty('--mark-x','0px');mark.style.setProperty('--mark-y','0px');mark.style.setProperty('--mark-roll','0deg');mark.style.setProperty('--fan-x','0px');mark.style.setProperty('--fan-y','0px');mark.style.setProperty('--fan-angle','0deg');};
  const sync=()=>{rotateOnScroll();mark.classList.toggle('motion-paused',!active());clearTimer();if(!active()){cancelAnimationFrame(frame);frame=0;neutral();}else rest();};
  const paint=()=>{frame=0;if(!active())return;mark.classList.add('is-interacting');mark.style.setProperty('--mark-turn',`${(x*18).toFixed(1)}deg`);mark.style.setProperty('--mark-pitch',`${(-y*14).toFixed(1)}deg`);mark.style.setProperty('--mark-x',`${(x*14).toFixed(1)}px`);mark.style.setProperty('--mark-y',`${(y*10).toFixed(1)}px`);mark.style.setProperty('--mark-roll',`${(x*3).toFixed(1)}deg`);mark.style.setProperty('--fan-x',`${(x*12).toFixed(2)}px`);mark.style.setProperty('--fan-y',`${(y*9).toFixed(2)}px`);mark.style.setProperty('--fan-angle',`${(x*18).toFixed(2)}deg`);};
  const move=(e:PointerEvent)=>{if(e.pointerType!=='mouse'||!active())return;if(e.clientX<bounds.left||e.clientX>bounds.right||e.clientY<bounds.top||e.clientY>bounds.bottom){neutral();return;}x=Math.max(-1,Math.min(1,(e.clientX-bounds.left)/bounds.width*2-1));y=Math.max(-1,Math.min(1,(e.clientY-bounds.top)/bounds.height*2-1));if(!frame)frame=requestAnimationFrame(paint);};
  const measure=()=>{bounds=mark.getBoundingClientRect();rotateOnScroll();};
  const end=(e:AnimationEvent)=>{if(e.animationName==='hero-contour-draw'&&e.target===Array.from(mark.querySelectorAll('.hero-contour-light')).at(-1)){idle=true;mark.classList.add('motion-resting');rest();}};
  const observer='IntersectionObserver'in window?new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)measure();sync();}):null;
  if(observer)observer.observe(mark);else visible=true;
  hero.addEventListener('pointerenter',measure,{passive:true});hero.addEventListener('pointermove',move,{passive:true});hero.addEventListener('pointerleave',neutral);mark.addEventListener('animationend',end);window.addEventListener('resize',measure,{passive:true});window.addEventListener('scroll',measure,{passive:true});window.addEventListener('blur',neutral);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);sync();
  return()=>{cancelAnimationFrame(frame);clearTimer();observer?.disconnect();hero.removeEventListener('pointerenter',measure);hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',neutral);mark.removeEventListener('animationend',end);window.removeEventListener('resize',measure);window.removeEventListener('scroll',measure);window.removeEventListener('blur',neutral);document.removeEventListener('visibilitychange',sync);reduced.removeEventListener('change',sync);};
 },[]);
 return <div className="hero-mark" ref={root} aria-hidden="true"><div className="hero-mark-entry"><div className="hero-mark-scroll"><div className="hero-mark-tilt"><div className="hero-mark-idle"><svg viewBox="-4 -4 108 100" xmlns="http://www.w3.org/2000/svg" focusable="false"><defs><linearGradient id="hero-mark-contour" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e1fbff"/><stop offset=".48" stopColor="#58bfda"/><stop offset="1" stopColor="#bcecf6"/></linearGradient></defs><g className="hero-mark-lines" fill="none" strokeLinejoin="round">{contours.map((d,i)=><g className="hero-fan-layer" key={i} style={{'--layer-depth':Math.sin(i/27*Math.PI)} as CSSProperties}><path d={d} stroke="url(#hero-mark-contour)" strokeWidth=".32" opacity=".78"/><path className="hero-contour-light" d={d} pathLength="100" stroke="#e3fcff" strokeWidth=".35" strokeLinecap="round" strokeDasharray="100" style={{animationDelay:`${i*.065}s`}}/></g>)}</g></svg></div></div></div></div></div>;
}
