async(page)=>{
 await page.emulateMedia({reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));const checks=[];
 for(const lang of ['ar','en']){
  await page.goto('http://apsr.demo/');
  if(await page.locator('html').getAttribute('lang')!==lang)await page.getByRole('button',{name:lang==='en'?'English':'العربية',exact:true}).click();
  for(const path of ['/','/about','/rights']){
   await page.goto('http://apsr.demo'+path);await page.locator('main h1').waitFor();if(await page.getByRole('heading',{name:/^(Page not found|الصفحة غير موجودة)$/}).count())throw Error('Unexpected not-found state '+path);await page.evaluate(()=>document.fonts.ready);
   {
    const font=await page.evaluate(()=>({family:getComputedStyle(document.body).fontFamily,loaded:[...document.fonts].some(f=>f.family==='Tajawal'&&f.status==='loaded')}));
    if(!font.family.startsWith('Tajawal')||!font.loaded)throw Error('Tajawal did not load: '+JSON.stringify(font));
   }
   for(const width of [1440,390,320]){
    await page.setViewportSize({width,height:900});
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow '+path+lang+width);
    if(width!==320)await page.screenshot({path:'/home/maymona/Documents/apsr/evidence/knowledge-'+(path.slice(1)||'home')+'-'+lang+'-'+width+'.png',fullPage:true,animations:'disabled'});
   }
   const brand=await page.evaluate(()=>{const s=getComputedStyle(document.documentElement);const logo=document.querySelector('.official-logo');return {palette:['--brand-primary','--brand-pale','--brand-light','--brand-medium','--brand-sky','--brand-soft'].map(k=>s.getPropertyValue(k).trim().toUpperCase()),logoFilter:logo?getComputedStyle(logo).filter:null,logoBlend:logo?getComputedStyle(logo).mixBlendMode:null};});
   if(JSON.stringify(brand.palette)!==JSON.stringify(['#0096B3','#B3DBE5','#D9F0FB','#3AACC1','#ECF3F7','#75C7D6']))throw Error('Brand palette mismatch');
   if(brand.logoFilter!=='none'||brand.logoBlend!=='normal')throw Error('Logo colour treatment changed');
   checks.push(lang+' '+path+' at 1440, 390 and 320px, Tajawal and brand palette');
  }
  const topicButtons=page.locator('.rights-topics button');
  for(let i=0;i<4;i++){await topicButtons.nth(i).click();if(await topicButtons.nth(i).getAttribute('aria-pressed')!=='true')throw Error('Topic not selected');if(!(await page.locator('.rights-detail h3').innerText()).trim())throw Error('Missing guidance');}
  await page.locator('.rights-checklist input').nth(0).check();await page.locator('.rights-checklist input').nth(1).check();
  if(!(await page.locator('.rights-checklist .section-index').innerText()).includes('2 / 3'))throw Error('Checklist count');
  await page.locator('.rights-checklist input').nth(0).uncheck();
  await page.locator('.rights-detail aside button').click();await page.getByRole('dialog').waitFor();
  if(!(await page.locator('.chat-suggestions').innerText()).includes(lang==='ar'?'بمن أتواصل':'Who should I contact'))throw Error('Rights assistant context missing');
  await page.getByRole('dialog').getByRole('button',{name:lang==='ar'?'إغلاق':'Close',exact:true}).click();
  await page.locator('.rights-preparation .primary').click();
  if(new URL(page.url()).pathname!=='/complaint')throw Error('Complaint navigation');
  await page.goto('http://apsr.demo/about');await page.locator('.authority-introduction .text-button').click();
  if(new URL(page.url()).pathname!=='/sectors')throw Error('About to sectors navigation');
  await page.goto('http://apsr.demo/');await page.locator('.knowledge-preview-grid button').first().click();
  if(new URL(page.url()).pathname!=='/about')throw Error('Homepage to about navigation');
  checks.push(lang+' topics, checklist, assistant and navigation');
 }
 await page.setViewportSize({width:1440,height:1000});await page.goto('http://apsr.demo/rights');
 if(errors.length)throw Error(errors.join('\n'));
 return {checks,pageErrors:errors};
}
