const staticPromiViz = "promiviz"

const expectedCaches = [staticPromiViz];

const assets = [
  "/",
  "/index.html",
  "/main.css",
  "/app.js",
  "/images/blog.png",
  "/images/github.png",
  "/images/twitter.png",
  "/social/landing.png"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(staticPromiViz).then(cache => {
      cache.addAll(assets)
    })
  )
});

self.addEventListener('activate', event => {
  // delete any caches that aren't in expectedCaches
  // which will get rid of promiviz
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (!expectedCaches.includes(key)) {
          return caches.delete(key);
        }
      })
    )).then(() => {
      console.log('promiviz now ready to handle fetches!');
    })
  );
});

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
});