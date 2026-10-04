const V="sleep-v1";
const SHELL=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","https://cdn.jsdelivr.net/npm/hls.js@1","https://cdn.jsdelivr.net/npm/mpegts.js@1"];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(V).then(c=>Promise.allSettled(SHELL.map(u=>c.add(u)))).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET")return;
  if(u.origin!==location.origin&&u.hostname!=="cdn.jsdelivr.net")return;
  e.respondWith(
    fetch(r).then(res=>{
      if(res.status===200||res.type==="opaque"){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}
      return res;
    }).catch(()=>caches.match(r).then(m=>m||caches.match("./index.html")))
  );
});
