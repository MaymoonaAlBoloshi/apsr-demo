async(page)=>{
 const checks=[];
 await page.setViewportSize({width:320,height:740});await page.emulateMedia({reducedMotion:'reduce'});
 await page.evaluate(async()=>{localStorage.setItem('apsr-lang','en');await fetch('/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({persona:'public'})})});
 await page.goto('http://apsr.demo/');await page.locator('.menu-toggle').click();if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='true')throw Error('Menu did not open');await page.keyboard.press('Escape');if(await page.locator('.menu-toggle').getAttribute('aria-expanded')!=='false')throw Error('Menu did not close');checks.push('menu');
 await page.locator('.assistant-launch').click();await page.getByRole('button',{name:'Ask the assistant',exact:true}).click();await page.setViewportSize({width:320,height:480});await page.locator('.chat-form textarea').fill('Help me understand a complaint');
 const chat=await page.locator('.assistant-panel').evaluate(e=>({w:e.clientWidth,sw:e.scrollWidth,h:e.clientHeight,sh:e.scrollHeight}));if(chat.sw>chat.w||chat.sh>chat.h+1)throw Error('Chat overflow '+JSON.stringify(chat));const input=await page.locator('.chat-form').boundingBox();if(input.y+input.height>480)throw Error('Chat composer hidden');await page.keyboard.press('Escape');checks.push('chat with short viewport');
 await page.setViewportSize({width:320,height:740});await page.goto('http://apsr.demo/about');
 for(const button of await page.locator('.board-toggle').all()){
  await button.click();const state=await button.locator('..').evaluate(e=>({open:e.classList.contains('is-open'),h:e.clientHeight,sh:e.scrollHeight}));if(!state.open||state.sh>state.h+2)throw Error('Board details clipped '+JSON.stringify(state));await button.click();
 }
 checks.push('all board details');
 await page.goto('http://apsr.demo/');for(const tab of await page.locator('.media-tabs button').all()){await tab.click();if(await tab.getAttribute('aria-selected')!=='true')throw Error('Media tab');const panel=page.locator('.media-slide.is-active');if(await panel.count()!==1)throw Error('Media panels');if(await panel.evaluate(e=>e.scrollWidth>e.clientWidth))throw Error('Media overflow');}checks.push('all media tabs');
 await page.goto('http://apsr.demo/services');await page.getByRole('textbox',{name:'Search services',exact:true}).fill('licen');if(!await page.locator('.service-directory-grid button').count())throw Error('No search results');checks.push('service search');
 await page.goto('http://apsr.demo/');await page.locator('.account-trigger').click();await page.locator('.signin-roles button').first().click();await page.getByLabel('Demo account',{exact:true}).selectOption('consumer');await page.getByRole('button',{name:'Sign in to workspace',exact:true}).click();await page.waitForURL('**/my-requests');await page.locator('.case-list .table-link').first().click();await page.waitForURL('**/cases/**');checks.push('mobile sign-in and case cards');
 return checks;
}
