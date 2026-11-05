import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
function worker(){
 const handlers={};const stores=new Map();let networkFails=false;
 const caches={async keys(){return [...stores.keys()];},async delete(key){return stores.delete(key);},async open(key){if(!stores.has(key))stores.set(key,new Map());const store=stores.get(key);return {async addAll(paths){for(const path of paths)store.set(path,new Response('cached '+path));},async match(path){return store.get(path)?.clone();}};}};
 const self={location:{origin:'https://apsr.example'},clients:{async claim(){}},addEventListener:(type,handler)=>handlers[type]=handler};
 runInNewContext(readFileSync('public/sw.js','utf8'),{self,caches,URL,Response,fetch:async request=>{if(networkFails)throw new TypeError('offline');return new Response('network '+(request.url||request));}});
 return {stores,caches,offline(){networkFails=true;},async lifecycle(type){let work;handlers[type]({waitUntil:p=>work=p});await work;},async request(path,{method='GET',mode='cors'}={}){let response;handlers.fetch({request:{url:'https://apsr.example'+path,method,mode},respondWith:p=>response=p});return response?await response:null;}};
}
test('offline fallback works on deep links without caching cases or intercepting API requests',async()=>{
 const w=worker();await w.lifecycle('install');w.offline();
 assert.match(await(await w.request('/cases/DEMO',{mode:'navigate'})).text(),/cached \/offline.html/);
 assert.equal(await w.request('/api/session'),null);assert.equal(await w.request('/api/cases'),null);assert.equal(await w.request('/api/chat',{method:'POST'}),null);
 assert.equal(await w.request('/complaint',{method:'POST',mode:'navigate'}),null);
 assert.deepEqual([...w.stores.values()].flatMap(s=>[...s.keys()]),['/offline.html','/icons/icon-192.png','/fonts/Tajawal-Regular.ttf','/fonts/Tajawal-Bold.ttf']);
});
test('online navigation stays fresh and activation only removes old APSR caches',async()=>{
 const w=worker();await w.lifecycle('install');await w.caches.open('apsr-offline-old');await w.caches.open('unrelated-app');await w.lifecycle('activate');
 assert.deepEqual(await w.caches.keys(),['apsr-offline-v1','unrelated-app']);assert.equal(await(await w.request('/services',{mode:'navigate'})).text(),'network https://apsr.example/services');
});
test('install manifest points to correctly sized PNGs and a standalone root scope',()=>{
 const manifest=JSON.parse(readFileSync('public/manifest.webmanifest','utf8'));assert.equal(manifest.start_url,'/');assert.equal(manifest.scope,'/');assert.equal(manifest.display,'standalone');
 for(const icon of manifest.icons){const png=readFileSync('public'+icon.src);assert.equal(png.readUInt32BE(16),Number(icon.sizes.split('x')[0]));assert.equal(png.readUInt32BE(20),Number(icon.sizes.split('x')[1]));}
 assert.ok(manifest.icons.some(i=>i.purpose==='maskable'));
});
