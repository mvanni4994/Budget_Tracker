const cacheFiles= ["./", "./index.html", "./index.js", "./styles.css", "./icons/icon-192x192.png","./icons/icon-512x512.png"];
const cacheName = "Static Cache"
const dataCache = "Data Cache"

self.addEventListener("install", function(e){
    e.waitUntil(
        catches.open(cacheName).then(cache => {
            console.log("saved successfully");
            return cache.addAll(cacheFiles);
        })
    
);

self.skipWaiting();
    });

// fetch data
self.addEventListener("fetch", function(e){
    if(e.request.url.include("/api/")){
        e.respondWith(
            caches.open(dataCache).then(cache => {
                return fetch(e.request)
                .then(response => {
                    // store response
                    if (response.status === 200) {
                        cache.put(e.request.url, response.clone());
                    }
                    return response;
                })
                .catch(err => {
                    // fetch from cache if no connection is available
                    return cache.match(e.request);
                });
            })
            .cache(err => console.log(err))
        );
        return;
    }
    e.respondWith(
        fetch(e.request).catch(function(){
            return caches.match(e.request).then(function(response){
                if(response){
                    return response;
                }
                else if (e.request.headers.get("accept").includes("text/html")) {
                    return caches.match("/");
                }
            });
        })
    );
});
