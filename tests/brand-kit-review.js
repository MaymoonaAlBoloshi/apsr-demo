async(page)=>{
 const results=[];const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const lang of ['ar','en']){
  await page.evaluate(l=>localStorage.setItem('apsr-lang',l),lang);
  for(const [persona,path] of [['consumer','/complaint'],['officer','/workspace'],['manager','/reports'],['editor','/content'],['publisher','/content']]){
   await page.evaluate(async p=>{const r=await fetch('/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({persona:p})});if(!r.ok)throw Error('session');},persona);
   await page.goto('http://apsr.demo'+path);await page.locator('main h1').waitFor();await page.evaluate(()=>document.fonts.ready);
   for(const width of [1440,390]){
    await page.setViewportSize({width,height:900});
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+lang+persona+width);
   }
   results.push(lang+' '+persona+' '+path);
  }
 }
 await page.evaluate(()=>fetch('/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({persona:'public'})}));
 await page.goto('http://apsr.demo/rights');
 const panel=await page.locator('.rights-summary p').evaluate(e=>({text:getComputedStyle(e).color,background:getComputedStyle(e.parentElement).backgroundColor}));
 if(panel.text!=='rgb(217, 240, 251)')throw Error('Panel text contrast regression');
 if(errors.length)throw Error(errors.join('\n'));
 return {results,panel,errors};
}
