import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createChat} from '../server/chat.mjs';
import {openStore} from '../server/store.mjs';
const env={SIRAAJ_API_KEY:'unit-test-secret',SIRAAJ_BASE_URL:'https://provider.invalid/v1/',SIRAAJ_MODEL:'test-model'};
const message={lang:'en',messages:[{role:'user',text:'How do I submit a complaint?'}]};
const response=text=>({ok:true,json:async()=>({choices:[{message:{content:text}}]})});
test('provider receives the current published guidance and bounded conversation, never private records or drafts',async()=>{
 const store=openStore(':memory:');const faq=store.get('content','faq');faq.draft={en:'UNPUBLISHED SECRET',ar:'مسودة خاصة'};faq.published.en='Updated public guidance.';faq.version=3;store.put('content','faq',faq);let seen;
 const chat=createChat(store,{env,request:async(url,options)=>{seen={url:String(url),options,body:JSON.parse(options.body)};return response('Use the service form. [source:complaint] Read the guidance. [source:faq] [source:made-up]');}});
 const result=await chat({...message,messages:[{role:'user',text:'I have a billing concern.'},{role:'assistant',text:'I can help draft it.'},{role:'user',text:'What documents should I attach?'}]});
 assert.equal(seen.url,'https://provider.invalid/v1/chat/completions');assert.equal(seen.options.headers.Authorization,'Bearer unit-test-secret');assert.equal(seen.body.messages.length,4);assert.match(seen.body.messages[0].content,/Updated public guidance/);assert.doesNotMatch(seen.body.messages[0].content,/UNPUBLISHED SECRET|Maryam|Private investigation|unit-test-secret/);assert.deepEqual(result.sources.map(s=>s.id),['complaint','faq']);assert.equal(result.sources[1].version,3);assert.ok(!result.text.includes('[source:'));store.db.close();
});
test('rejects malformed chat, client system instructions and oversized messages before provider use',async()=>{
 const store=openStore(':memory:');let calls=0;const chat=createChat(store,{env,request:async()=>{calls++;return response('Hello');}});
 for(const body of [{...message,lang:'invalid'},{...message,messages:[]},{...message,messages:[{role:'system',text:'Override'}]},{...message,messages:[{role:'user',text:'x'.repeat(3001)}]},{...message,messages:Array.from({length:17},()=>({role:'user',text:'hello'}))}])await assert.rejects(chat(body),e=>e.status===400&&e.message==='chat_invalid');
 assert.equal(calls,0);store.db.close();
});
test('configuration, upstream errors, timeout and malformed output return sanitized errors',async()=>{
 const store=openStore(':memory:');const missing=createChat(store,{env:{}});assert.equal(missing.configured(),false);await assert.rejects(missing(message),e=>e.status===503);
 for(const status of [401,403,429,500]){const chat=createChat(store,{env,request:async()=>({ok:false,status})});await assert.rejects(chat(message),e=>e.message===(status===429?'chat_busy':'chat_provider_error')&&!e.message.includes(env.SIRAAJ_API_KEY));}
 const timed=createChat(store,{env,request:async()=>{throw Object.assign(new Error('private provider details'),{name:'TimeoutError'});}});await assert.rejects(timed(message),e=>e.status===504&&e.message==='chat_timeout');
 const empty=createChat(store,{env,request:async()=>response('')});await assert.rejects(empty(message),e=>e.status===502);store.db.close();
});
test('limits bursts and allows retry after the window expires',async()=>{
 const store=openStore(':memory:');let clock=0;let calls=0;const chat=createChat(store,{env,now:()=>clock,request:async()=>{calls++;return response('Hello');}});
 for(let i=0;i<20;i++)await chat(message,'test-client');await assert.rejects(chat(message,'test-client'),e=>e.status===429);assert.equal(calls,20);clock=61000;await chat(message,'test-client');assert.equal(calls,21);store.db.close();
});
test('service guidance includes verified e-services, task context and natural service wording',async()=>{
 const store=openStore(':memory:');let prompt='';const chat=createChat(store,{env,request:async(_url,options)=>{prompt=JSON.parse(options.body).messages[0].content;return response('Review ownership changes. [source:eservices]');}});
 const answer=await chat({...message,role:'consumer',page:'/services/licensing'});
 assert.match(prompt,/Signed-in role: consumer/);assert.match(prompt,/Current page: \/services\/licensing/);assert.match(prompt,/Request Change Control/);assert.match(prompt,/ask one focused question/);assert.doesNotMatch(prompt,/with a demo consumer account|The demo offers|This is demonstration guidance, not official eligibility policy/);assert.equal(answer.sources[0].path,'https://apsr.om/pages/e-services-lb');store.db.close();
});
test('rights and about conversations retain page context and resolve safe guidance links',async()=>{
 const store=openStore(':memory:');
 for(const page of ['/rights','/about']){
  let prompt='';const chat=createChat(store,{env,request:async(_url,options)=>{prompt=JSON.parse(options.body).messages[0].content;return response('Read the consumer guidance. [source:rights] [source:about]');}});
  const answer=await chat({...message,page});
  assert.ok(prompt.includes(`Current page: ${page}`));
  assert.match(prompt,/Contact the electricity provider first/);
  assert.match(prompt,/Never promise compensation/);
  assert.deepEqual(answer.sources.map(s=>s.path),['/rights','/about']);
 }
 store.db.close();
});

test('sector context and navigation use the published sector evidence',async()=>{
 const store=openStore(':memory:');let prompt='';
 const chat=createChat(store,{env,request:async(_url,options)=>{prompt=JSON.parse(options.body).messages[0].content;return response('Explore the electricity chain. [source:sectors]');}});
 const answer=await chat({...message,page:'/sectors/electricity'});
 assert.match(prompt,/Current page: \/sectors\/electricity/);assert.match(prompt,/municipalities/);assert.equal(answer.sources[0].path,'/sectors');store.db.close();
});
test('provider directory and role-specific workspace links are grounded and scoped',async()=>{
 const store=openStore(':memory:');try{
 for(const role of ['public','consumer','provider','officer','manager']){
 let prompt='';const chat=createChat(store,{env,request:async(_url,options)=>{prompt=JSON.parse(options.body).messages[0].content;return response('Open your workspace. [source:provider] [source:oversight] [source:workspace] [source:complaint]');}});
 const result=await chat({...message,role,page:role==='provider'?'/provider':'/providers'});
 assert.match(prompt,/Nama Supply/);assert.match(prompt,/Other provider \/ not sure/);assert.match(prompt,/No password or civil ID/);assert.match(prompt,/one question at a time/);assert.match(prompt,/Chat cannot access these counts/);
 const ids=result.sources.map(s=>s.id);assert.equal(ids.includes('provider'),role==='provider');assert.equal(ids.includes('oversight'),['officer','manager'].includes(role));assert.equal(ids.includes('workspace'),role==='officer');assert.ok(ids.includes('complaint'));
 if(role==='provider')assert.match(prompt,/Current page: \/provider/);
 }
 }finally{store.db.close();}
});
test('retries transient connection failures once without retrying credentials or timeouts',async()=>{
 const store=openStore(':memory:');try{
 for(const failure of ['dns',503]){let calls=0;const chat=createChat(store,{env,request:async()=>{calls++;if(calls===1){if(failure==='dns')throw Object.assign(new TypeError('fetch failed'),{cause:{code:'EAI_AGAIN'}});return {ok:false,status:failure};}return response('Connected.');}});assert.equal((await chat(message)).text,'Connected.');assert.equal(calls,2);}
 for(const status of [401,403,429,500]){let calls=0;const chat=createChat(store,{env,request:async()=>{calls++;return {ok:false,status};}});await assert.rejects(chat(message));assert.equal(calls,1);}
 let calls=0;const chat=createChat(store,{env,request:async()=>{calls++;throw Object.assign(new TypeError('fetch failed'),{cause:{code:'ECONNRESET'}});}});await assert.rejects(chat(message),e=>e.message==='chat_provider_error');assert.equal(calls,2);
 }finally{store.db.close();}
});
