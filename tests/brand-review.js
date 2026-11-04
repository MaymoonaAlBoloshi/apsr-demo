async(page)=>{
 const checks=[];const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5188/');
 await page.evaluate(()=>localStorage.setItem('apsr-lang','ar'));await page.reload();
 const screenshot=async(name)=>{for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=650){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(100);}await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(850);await page.screenshot({path:'/home/maymona/Documents/apsr/evidence/'+name+'.png',fullPage:true});};
 for(const [width,lang] of [[1440,'ar'],[390,'ar'],[390,'en'],[1440,'en']]){
  await page.setViewportSize({width,height:1000});
  if(await page.locator('html').getAttribute('lang')!==lang)await page.getByRole('button',{name:lang==='ar'?'العربية':'English',exact:true}).click();
  await screenshot('branded-home-'+lang+'-'+width);
  const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,logo:document.querySelector('.official-logo').naturalWidth,cyan:getComputedStyle(document.querySelector('h1 em')).color}));
  if(state.overflow||state.logo!==336||state.cyan!=='rgb(0, 150, 179)')throw new Error(JSON.stringify(state));
  checks.push(lang+' '+width+': logo, cyan identity, no overflow');
 }
 await page.getByRole('button',{name:'02 Water',exact:true}).click();
 if(await page.getByRole('button',{name:'02 Water',exact:true}).getAttribute('aria-expanded')!=='true')throw new Error('Accordion failed');
 await page.locator('#sector-water').getByText(/billing or service quality/).waitFor();checks.push('Sector accordion updates content');
 await page.getByRole('button',{name:/01 Make yourself heard/}).click();await page.waitForURL('**/complaint');checks.push('Complaint entry connects to existing service');
 await page.getByRole('button',{name:'APSR',exact:true}).click();await page.waitForURL('http://127.0.0.1:5188/');
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.locator('.sculpture-facets').waitFor();
 const reduced=await page.evaluate(()=>({animation:getComputedStyle(document.querySelector('.sculpture-facets')).animationName,hidden:[...document.querySelectorAll('[data-reveal]')].some(e=>getComputedStyle(e).opacity==='0')}));
 if(reduced.animation!=='none'||reduced.hidden)throw new Error('Reduced motion failure');checks.push('Reduced motion disables animation and preserves content');
 await page.emulateMedia({reducedMotion:'no-preference'});
 await page.getByRole('button',{name:'العربية',exact:true}).click();await page.evaluate(()=>scrollTo(0,0));
 if(errors.length)throw new Error(errors.join('\n'));
 return {checks,pageErrors:errors};
}
