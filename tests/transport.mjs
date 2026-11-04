import {Readable} from 'node:stream';
// Invoke the HTTP handler directly. This transport exercises actual routing,
// cookies, validation and persistence without requiring a listening socket.
export async function invoke(handler,path,{method='GET',headers={},body}={}) {
 const req=Readable.from(body===undefined?[]:[Buffer.from(typeof body==='string'?body:JSON.stringify(body))]);
 req.url=path;req.method=method;req.headers={host:'demo.local','content-type':'application/json',...headers};
 let status=200;const responseHeaders={};let bytes;
 const res={setHeader(k,v){responseHeaders[k.toLowerCase()]=v;},writeHead(code,h={}){status=code;for(const [k,v] of Object.entries(h))responseHeaders[k.toLowerCase()]=v;},end(value){bytes=Buffer.isBuffer(value)?value:Buffer.from(value||'');}};
 await handler(req,res);
 return {status,headers:responseHeaders,text:()=>bytes.toString(),json:()=>JSON.parse(bytes.toString()),bytes};
}
