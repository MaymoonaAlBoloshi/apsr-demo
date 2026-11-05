async(page)=>{
 const results=[];
 for(const width of [320,390,768])for(const lang of ['ar','en']){
  await page.setViewportSize({width,height:844});
  await page.evaluate(l=>localStorage.setItem('apsr-lang',l),lang);
  for(const [persona,routes] of [['consumer',['/complaint','/my-requests']],['provider-nama-supply',['/provider']],['officer',['/workspace','/settings','/providers']],['manager',['/reports','/providers']],['editor',['/content']],['publisher',['/content']]]){
   await page.evaluate(async persona=>{const r=await fetch('/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({persona})});if(!r.ok)throw Error('Login failed');},persona);
   const cases=['editor','publisher'].includes(persona)?[]:await page.evaluate(async()=>await (await fetch('/api/cases')).json());
   if(Array.isArray(cases)&&cases.length)routes.push('/cases/'+cases[0].id);
   for(const path of routes){await page.goto('http://apsr.demo'+path);await page.waitForTimeout(120);
    results.push(await page.evaluate(({lang,path,persona,width})=>({lang,path,persona,viewport:width,width:document.documentElement.scrollWidth,outside:[...document.querySelectorAll('main *')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('[inert],[hidden],.table-wrap')&&(r.left< -2||r.right>innerWidth+2)}).slice(0,6).map(e=>({c:e.className,tag:e.tagName,width:Math.round(e.getBoundingClientRect().width)}))}),{lang,path,persona}));
    if(width===390&&lang==='en'&&!path.startsWith('/cases/'))await page.screenshot({path:'/home/maymona/Documents/apsr/evidence/mobile-'+persona+path.replaceAll('/','-')+'.png'});
   }
  }
 }
 const failures=results.filter(r=>r.width>r.viewport||r.outside.length);if(failures.length)throw Error(JSON.stringify(failures));return {checked:results.length,failures};
}
