const C='carflip-shell-v1';
const SHELL=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Network first so updates show up as soon as you open the app online.
// If the network is slow (3s) or offline, fall back to the saved copy.
self.addEventListener('fetch',e=>{
const r=e.request;
if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
e.respondWith((async()=>{
const c=await caches.open(C);
const net=fetch(r).then(x=>{if(x.ok)c.put(r,x.clone());return x});
try{return await Promise.race([net,new Promise((_,j)=>setTimeout(j,3000))])}
catch(err){const hit=await c.match(r,{ignoreSearch:true});return hit||net}
})())});
