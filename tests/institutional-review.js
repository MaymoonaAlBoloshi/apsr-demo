async(page)=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const results=[];
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const lang of ['ar','en']){
  await page.goto('http://apsr.demo/');
  if(await page.locator('html').getAttribute('lang')!==lang)await page.getByRole('button',{name:lang==='ar'?'العربية':'English',exact:true}).click();
  for(const path of ['/','/about','/sectors/electricity','/sectors/water','/sectors/gas','/sectors/waste']){
   await page.goto('http://apsr.demo'+path);await page.locator('main h1').waitFor();await page.evaluate(()=>document.fonts.ready);
   if(await page.getByRole('heading',{name:/^(Page not found|الصفحة غير موجودة)$/}).count())throw Error('Unknown route '+path);
   if(path==='/about'){
    if(await page.locator('.board-grid article').count()!==7)throw Error('Board count');
    await page.locator('.board-grid article').last().scrollIntoViewIfNeeded();
    await page.waitForFunction(()=>[...document.querySelectorAll('.institutional-page img')].every(i=>i.complete&&i.naturalWidth>0));
   }
   for(const width of [1440,390,320]){
    await page.setViewportSize({width,height:950});await page.evaluate(()=>scrollTo(0,0));
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+path+lang+width);
    if(width!==320&&['/','/about','/sectors/electricity'].includes(path))await page.screenshot({path:'/home/maymona/Documents/apsr/evidence/institutional-'+(path.replaceAll('/','-')||'home')+'-'+lang+'-'+width+'.png',fullPage:true,animations:'disabled'});
   }
   if(path.startsWith('/sectors/')){
    const buttons=page.locator('.lesson-flow button');
    for(let i=0;i<await buttons.count();i++){await buttons.nth(i).click();if(await buttons.nth(i).getAttribute('aria-pressed')!=='true')throw Error('Stage selection');if(!(await page.locator('.lesson-explanation>div p').innerText()).trim())throw Error('Empty stage');}
    await page.getByRole('navigation',{name:lang==='ar'?'اختر القطاع':'Choose a sector'}).getByRole('button').first().click();
    if(await page.locator('.lesson-flow button').first().getAttribute('aria-pressed')!=='true')throw Error('Stage reset');
   }
   results.push(lang+' '+path+' at 1440, 390, 320');
  }
  await page.goto('http://apsr.demo/');
  if(await page.locator('.brand-sculpture,.art-guide,.caption-dot,.assistant-mark,.assistant-launch i,.connected-section').count())throw Error('Removed decoration remains');
  if(!(await page.locator('footer').innerText()).includes(lang==='ar'?'الهاتف أو الكمبيوتر':'phone or computer'))throw Error('Footer device note');
  await page.locator('.assistant-launch').click();await page.getByRole('dialog').waitFor();await page.getByRole('dialog').getByRole('button',{name:lang==='ar'?'إغلاق':'Close',exact:true}).click();
  await page.setViewportSize({width:1440,height:950});await page.emulateMedia({reducedMotion:'no-preference'});
  const row=page.locator('.editorial-service').first();await row.scrollIntoViewIfNeeded();await page.mouse.move(0,0);await page.waitForTimeout(500);
  const before=await row.evaluate(e=>getComputedStyle(e,'::before').transform);await row.hover();await page.waitForTimeout(550);
  const after=await row.evaluate(e=>({fill:getComputedStyle(e,'::before').transform,title:getComputedStyle(e.querySelector('strong')).transform,arrow:getComputedStyle(e.querySelector('.arrow-disc')).transform}));
  if(before===after.fill||after.title==='none'||after.arrow==='none')throw Error('Service hover animation missing '+JSON.stringify({before,after}));
  results.push(lang+' hover fill, title and arrow animation verified');await page.emulateMedia({reducedMotion:'reduce'});
 }
 await page.goto('http://apsr.demo/sectors/waste');await page.locator('.assistant-launch').click();
 if(!(await page.locator('.chat-suggestions').innerText()).includes('waste collection'))throw Error('Sector assistant suggestions missing');
 await page.getByRole('dialog').getByRole('button',{name:'Close',exact:true}).click();
 if(errors.length)throw Error(errors.join('\n'));return {results,errors};
}
