const CACHE_NAME = "version-1"
const urlsToCache = ['index.html', 'offline.html']

const self = this

// Install the service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache)
            })
    )
})

// Listen for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        // when there is a request, we match all the requests that our page is saving
        caches.match(event.request)
            .then(()=>{
                // we then fetch those requests again since we always want to get new data
                return fetch(event.request)
                    // if we cannot fetch new data then we return the cached file i.e, offline ( no internet )
                    .catch(()=> caches.match('offline.html'))
            })
    )
})

// Activate the service worker
self.addEventListener('activate', (event) => {
    const cacheWhiteList = []
    cacheWhiteList.push(CACHE_NAME)

    event.waitUntil(
        caches.keys()
            .then(cacheNames => Promise.all(
                cacheNames.map(cacheName => {
                    //if cache is not present in the white list array then delete the cache.
                    // we only want to keep a specefic cache version
                    if(!cacheWhiteList.includes(cacheName)){
                        return caches.delete(cacheName)
                    }
                })
            ))
    )
})