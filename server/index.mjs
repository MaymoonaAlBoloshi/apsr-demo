import http from 'node:http';
import {existsSync} from 'node:fs';
import {loadEnvFile} from 'node:process';
import {serveStatic} from './static.mjs';
import {openStore} from './store.mjs';
import {api} from './api.mjs';
if(existsSync('.env.local'))loadEnvFile('.env.local');
const production=process.env.NODE_ENV==='production';
const store=openStore(process.env.DEMO_DB||'data/demo.sqlite');
const handle=api(store);
const vite=production?null:await (await import('vite')).createServer({server:{middlewareMode:true},appType:'spa'});
const server=http.createServer(async(req,res)=>{
 if(await handle(req,res))return;
 if(vite){vite.middlewares(req,res);return;}
 await serveStatic(req,res);
});
server.on('error',error=>{console.error('Unable to start the local demo:',error.message);process.exitCode=1;vite?.close();store.db.close();});
server.listen(Number(process.env.PORT||5188),process.env.HOST||'127.0.0.1',()=>console.log(`APSR demo: http://${process.env.HOST||'127.0.0.1'}:${process.env.PORT||5188}`));
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,async()=>{await vite?.close();server.close();store.db.close();process.exit(0);});
