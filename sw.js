const CACHE='kakeibo-v14';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
);});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  // API / cross-origin data must always be fresh — never cache
  if(url.hostname!==self.location.hostname || url.hostname.indexOf('fugle')>=0){
    e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
    return;
  }
  // same-origin static assets: cache-first with background refresh
  e.respondWith(
    caches.match(e.request).then(cached=>{
      const fp=fetch(e.request).then(resp=>{
        if(e.request.method==='GET' && resp.status===200){
          const rc=resp.clone();
          caches.open(CACHE).then(c=>c.put(e.request,rc));
        }
        return resp;
      }).catch(()=>cached);
      return cached||fp;
    })
  );
});
