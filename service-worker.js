const SHELL='bouldering-shell-v7-daily-plan';
const SHELL_ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(SHELL).then(c=>c.addAll(SHELL_ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(names=>Promise.all(
  names.filter(n=>n.startsWith('bouldering-shell-')&&n!==SHELL).map(n=>caches.delete(n))
 )).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 if(req.mode==='navigate'){
  event.respondWith(fetch(req).then(response=>{
   if(response.ok){const copy=response.clone();caches.open(SHELL).then(c=>c.put('./index.html',copy)).catch(()=>{});}
   return response;
  }).catch(()=>caches.match('./index.html')));
  return;
 }
 event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(response=>{
  if(response.ok){const copy=response.clone();caches.open(SHELL).then(c=>c.put(req,copy)).catch(()=>{});}
  return response;
 })));
});