async(page)=>{
 const routes=['/','/about','/rights','/services','/services/licensing','/services/article-106','/services/change-of-control','/services/asset-disposal','/services/article-13','/services/appropriate-person','/services/enquiry','/services/tariffs','/services/publications','/sectors','/sectors/electricity','/sectors/water','/sectors/gas','/sectors/waste','/complaint','/my-requests','/presentation','/missing-page'];
 const results=[];
 const widths=[320,390,768];
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of widths)for(const lang of ['ar','en']){
  await page.evaluate(l=>localStorage.setItem('apsr-lang',l),lang);
  for(const path of routes){
   await page.setViewportSize({width,height:844});await page.goto('http://apsr.demo'+path);await page.locator('main').waitFor();await page.waitForTimeout(80);
   results.push(await page.evaluate(({path,lang,width})=>{
    const outside=[...document.querySelectorAll('main *,header,.site-footer')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&getComputedStyle(e).visibility!=='hidden'&&!e.closest('[hidden],[inert]')&&(r.left< -2||r.right>innerWidth+2)&&!e.closest('.table-wrap,.tariff-table-wrap')}).map(e=>({tag:e.tagName,c:e.className,left:Math.round(e.getBoundingClientRect().left),width:Math.round(e.getBoundingClientRect().width)}));
    return {path,lang,viewport:width,width:document.documentElement.scrollWidth,outside:outside.slice(0,8)};
   },{path,lang,width}));
  }
 }
 const failures=results.filter(r=>r.width>r.viewport||r.outside.length);if(failures.length)throw Error(JSON.stringify(failures));return {checked:results.length,failures};
}
