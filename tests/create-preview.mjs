import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {openStore,people,sectors} from '../server/store.mjs';
const store=openStore(':memory:');
const assets={};
for(const f of readdirSync('dist/assets'))assets['/assets/'+f]={body:readFileSync('dist/assets/'+f,'utf8'),type:f.endsWith('.css')?'text/css':'text/javascript'};
assets['/']={body:readFileSync('dist/index.html','utf8'),type:'text/html'};
assets['/brand/apsr-logo.png']={body:readFileSync('public/brand/apsr-logo.png').toString('base64'),type:'image/png',base64:true};
for(const f of readdirSync('public/about'))assets['/about/'+f]={body:readFileSync('public/about/'+f).toString('base64'),type:f.endsWith('.png')?'image/png':'image/jpeg',base64:true};
for(const weight of ['Regular','Medium','Bold','ExtraBold'])assets['/fonts/Tajawal-'+weight+'.ttf']={body:readFileSync('public/fonts/Tajawal-'+weight+'.ttf').toString('base64'),type:'font/ttf',base64:true};
const records={};
for(const kind of ['case','content','settings','file','draft'])records[kind]=Object.fromEntries(store.all(kind).map(v=>[v.id||'complaint',v]));
records.settings={complaint:store.get('settings','complaint')};
store.db.close();
const apiSource=readFileSync('server/api.mjs','utf8').replace(/^import .*;\n/gm,'').replace('export function api','function createApi');
const browserCode=`async (page) => {
 const assets=${JSON.stringify(assets)};
 const font=${JSON.stringify(readFileSync('public/fonts/arabic.ttf').toString('base64'))};
 const records=${JSON.stringify(records)};
 const people=${JSON.stringify(people)}; const sectors=${JSON.stringify(sectors)};
 let sequence=0;const randomUUID=()=>String(Date.now())+'-'+(++sequence)+'-'+Math.random().toString(16).slice(2);
 const original=JSON.stringify(records);
 const store={get:(k,id)=>records[k]?.[id]?JSON.parse(JSON.stringify(records[k][id])):null,all:k=>Object.values(records[k]||{}).map(v=>JSON.parse(JSON.stringify(v))),put:(k,id,v)=>{records[k]||={};records[k][id]=JSON.parse(JSON.stringify(v));},del:(k,id)=>{delete records[k]?.[id];},reset:()=>{for(const k of Object.keys(records))delete records[k];Object.assign(records,JSON.parse(original));}};
 ${apiSource}
 // Offline browser fixture, not a provider integration test.
 const fixtureChat=Object.assign(async body=>{const c=store.get('content','faq');const known=/complaint|bill|document|شكوى|شكوا|فاتور|مستند/i.test(body.messages.at(-1).text);return {text:known?c.published[body.lang]:body.lang==='ar'?'لا تتضمن مصادر هذا العرض إجابة موثوقة لهذا السؤال.':'The demonstration sources do not contain a reliable answer to this question.',sources:known?[{id:'faq',path:'/services/publications',label:{ar:'إرشادات الشكوى المنشورة',en:'Published complaint guidance'},version:c.version}]:[{id:'enquiry',path:'/services/enquiry',label:{ar:'الاستفسارات العامة',en:'General enquiries'}}]};},{configured:()=>true});
 const handler=createApi(store,{chat:fixtureChat});
 await page.unrouteAll({behavior:'ignoreErrors'});
 await page.route('http://apsr.demo/**',async route=>{
  const path=new URL(route.request().url()).pathname;
  if(path.startsWith('/api/')){
   const r=route.request(); const req={url:path,method:r.method(),headers:{...await r.allHeaders(),host:'apsr.demo'},async *[Symbol.asyncIterator](){if(r.postData())yield Buffer.from(r.postData());}};
   let status=200;let headers={};let body='';const res={setHeader:(k,v)=>{headers[k]=v;},writeHead:(code,h)=>{status=code;Object.assign(headers,h);},end:v=>{body=v;}};
   await handler(req,res);await route.fulfill({status,headers,body});return;
  }
  if(path==='/fonts/arabic.ttf'){await route.fulfill({status:200,contentType:'font/ttf',body:Buffer.from(font,'base64')});return;}
  const asset=assets[path]||assets['/'];
  await route.fulfill({status:200,contentType:asset.type,body:asset.base64?Buffer.from(asset.body,'base64'):asset.body});
 });
 await page.setViewportSize({width:1440,height:1080});
 await page.goto('http://apsr.demo/');
 await page.locator('main h1').waitFor();
 return {title:await page.title(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)};
}`;
writeFileSync('evidence/preview-harness.js',browserCode);
