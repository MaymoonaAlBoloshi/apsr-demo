async(page)=>{
 const checks=[];const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5188/');await page.locator('.hero-intents').waitFor();
 if(await page.locator('html').getAttribute('lang')!=='ar')await page.getByRole('button',{name:'العربية',exact:true}).click();
 for(const label of ['العربية والإنجليزية','تجربة متصلة عبر الأجهزة','سلطنة عُمان · هيئة تنظيم الخدمات العامة'])if(await page.getByText(label,{exact:true}).count())throw new Error('Removed label remains');
 if(await page.locator('.demo-strip').count())throw new Error('Demo strip remains');checks.push('Requested strip and labels removed');
 await page.getByRole('button',{name:'أتابع طلباً',exact:true}).click();await page.getByRole('button',{name:'انتقل إلى طلباتي',exact:true}).first().waitFor();
 if(await page.getByRole('button',{name:'أتابع طلباً',exact:true}).getAttribute('aria-pressed')!=='true')throw new Error('Intent not selected');
 await page.getByRole('button',{name:'أبحث عن معلومة',exact:true}).click();await page.getByRole('button',{name:'اسأل المساعد',exact:true}).click();await page.getByRole('dialog',{name:'مساعد الخدمات'}).waitFor();await page.getByRole('dialog',{name:'مساعد الخدمات'}).getByRole('button',{name:'إغلاق',exact:true}).click();checks.push('Hero intent selection updates action and opens assistant');
 await page.getByRole('button',{name:'الحساب ومساحة العمل',exact:true}).click();await page.getByRole('dialog',{name:'الحساب ومساحة العمل'}).waitFor();await page.keyboard.press('Escape');if(await page.locator('.account-panel').count())throw new Error('Account menu did not close');checks.push('Compact account menu opens and closes by keyboard');
 for(const width of [1440,390]){await page.setViewportSize({width,height:950});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:'/home/maymona/Documents/apsr/evidence/refined-home-'+width+'.png',animations:'disabled',fullPage:false});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Home overflow '+width);}
 await page.setViewportSize({width:1440,height:1000});
 for(const path of ['/services','/services/licensing','/services/tariffs','/services/publications','/services/enquiry']){
  await page.goto('http://127.0.0.1:5188'+path);await page.locator('main h1').waitFor();await page.screenshot({path:'/home/maymona/Documents/apsr/evidence/refined-'+path.replaceAll('/','-')+'.png',animations:'disabled',fullPage:true});await page.setViewportSize({width:390,height:844});if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Service page overflow '+path);await page.setViewportSize({width:1440,height:1000});
 }
 checks.push('Catalogue and four distinct information pages render without phone overflow');
 await page.getByRole('button',{name:'English',exact:true}).click();await page.getByRole('button',{name:'Account and workspace',exact:true}).click();await page.getByRole('button',{name:/Ahmed · Case officer/}).click();await page.getByRole('heading',{name:'Every request deserves attention'}).waitFor();await page.screenshot({path:'/home/maymona/Documents/apsr/evidence/refined-workspace.png',animations:'disabled',fullPage:false});
 await page.getByRole('button',{name:'Account and workspace',exact:true}).click();await page.getByRole('button',{name:/Management · Reports/}).click();await page.getByRole('heading',{name:'Clearer visibility. Better decisions.'}).waitFor();await page.screenshot({path:'/home/maymona/Documents/apsr/evidence/refined-reports.png',animations:'disabled',fullPage:false});checks.push('Staff navigation and refreshed reporting render');
 await page.getByRole('button',{name:'Account and workspace',exact:true}).click();await page.getByRole('button',{name:/Public visitor/}).click();
 await page.emulateMedia({reducedMotion:'reduce'});await page.reload();await page.locator('.hero-intents').waitFor();await page.getByRole('button',{name:'Find guidance',exact:true}).click();const animation=await page.locator('.sculpture-facets').evaluate(e=>getComputedStyle(e).animationName);if(animation!=='none')throw new Error('Reduced motion failed');await page.emulateMedia({reducedMotion:'no-preference'});checks.push('Interactive hero respects reduced motion');
 if(errors.length)throw new Error(errors.join('\n'));return {checks,pageErrors:errors};
}
