import {chromium} from 'playwright';
import {readFileSync,writeFileSync} from 'node:fs';
import './create-preview.mjs';
// Browser integration uses the production bundle and actual API handler source.
// Its transport/storage adapter is in memory; api.test.mjs covers real SQLite.
const browser=await chromium.launch({headless:true,...(process.env.BROWSER_PATH?{executablePath:process.env.BROWSER_PATH}:{} )});
const context=await browser.newContext({viewport:{width:1440,height:1080},recordVideo:{dir:'evidence/video',size:{width:1440,height:1080}}});
const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 const setup=eval('('+readFileSync('evidence/preview-harness.js','utf8')+')');await setup(page);
 const journey=eval('('+readFileSync('tests/journey.js','utf8')+')');const result=await journey(page);
 if(errors.length)throw new Error(errors.join('\n'));
 writeFileSync('evidence/browser-results.json',JSON.stringify({...result,pageErrors:errors},null,2));console.log(JSON.stringify(result,null,2));
}finally{await context.close();await browser.close();}
