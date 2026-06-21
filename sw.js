const CACHE='kakeibo-v11';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(clients.claim());});
self.addEventListener('fetch',e=>{
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
