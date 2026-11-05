async(page)=>{
 // Run against the built app over HTTPS or localhost, with an active worker.
 const origin=new URL(page.url()).origin;
 await page.waitForFunction(()=>Boolean(navigator.serviceWorker.controller));
 const manifest=await page.evaluate(async()=>await(await fetch('/manifest.webmanifest')).json());
 if(manifest.display!=='standalone'||manifest.scope!=='/')throw Error('Invalid install configuration');
 const images=await page.evaluate(async()=>Promise.all(['/icons/icon-192.png','/icons/icon-512.png','/icons/maskable-512.png','/icons/apple-touch-icon.png'].map(src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve([image.naturalWidth,image.naturalHeight]);image.onerror=reject;image.src=src}))));
 const cdp=await page.context().newCDPSession(page);const {installabilityErrors}=await cdp.send('Page.getInstallabilityErrors');await cdp.detach();if(installabilityErrors.length)throw Error(JSON.stringify(installabilityErrors));
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>localStorage.setItem('apsr-lang','en'));
 let cache;
 try{
  await page.context().setOffline(true);await page.goto(origin+'/my-requests');
  if(await page.locator('h1').innerText()!=='You’re offline')throw Error('Missing offline page');
  await page.locator('#language').click();if(await page.locator('h1').innerText()!=='أنت غير متصل بالإنترنت')throw Error('Missing Arabic offline copy');
  const rejected=await page.evaluate(()=>fetch('/api/session').then(()=>false).catch(()=>true));if(!rejected)throw Error('API unexpectedly served offline');
  cache=await page.evaluate(async()=>{const keys=(await caches.keys()).filter(k=>k.startsWith('apsr-offline-'));return(await Promise.all(keys.map(async key=>(await(await caches.open(key)).keys()).map(r=>new URL(r.url).pathname)))).flat()});
  if(cache.some(path=>path.startsWith('/api/')||path.startsWith('/cases/')))throw Error('Private data cached');
  await page.screenshot({path:'/home/maymona/Documents/apsr/evidence/pwa-offline-verified.png'});
 }finally{await page.context().setOffline(false)}
 await page.locator('#retry').click();await page.locator('.sign-in h1').waitFor();
 return {installabilityErrors,icons:images,offline:['ar','en'],cache,reconnected:true};
}
