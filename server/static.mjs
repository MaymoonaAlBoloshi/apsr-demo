import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
const mime={'.js':'text/javascript','.css':'text/css','.html':'text/html; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.woff2':'font/woff2','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8','.json':'application/json'};
export async function serveStatic(req,res,root=resolve('dist')){
 let path;try{path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);res.end('Invalid path');return;}
 const target=resolve(root,path==='/'?'index.html':'.'+path);
 if(!target.startsWith(root+'/')){res.writeHead(403);res.end('Forbidden');return;}
 try{const bytes=await readFile(target);res.setHeader('Content-Type',mime[extname(target)]||'application/octet-stream');res.setHeader('X-Content-Type-Options','nosniff');res.end(bytes);}
 catch{
 if(extname(path)){res.writeHead(404);res.end('Not found');return;}
 try{res.setHeader('Content-Type','text/html; charset=utf-8');res.end(await readFile(resolve(root,'index.html')));}
 catch{res.writeHead(503,{'Content-Type':'text/plain'});res.end('Build the demo first with npm run build.');}
 }
}
