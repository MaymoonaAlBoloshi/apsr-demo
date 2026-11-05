import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
// Change the worker whenever the offline experience changes. An open form is
// never reloaded automatically; the new worker activates after old tabs close.
const files=['sw.js','offline.html','icons/icon-192.png','fonts/Tajawal-Regular.ttf','fonts/Tajawal-Bold.ttf'];
const hash=createHash('sha256');
for(const file of files)hash.update(readFileSync('public/'+file));
const version=hash.digest('hex').slice(0,12);
writeFileSync('dist/sw.js',readFileSync('public/sw.js','utf8').replace('apsr-offline-v1','apsr-offline-'+version));
console.log('Offline assets version: '+version);
