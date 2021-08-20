const staticPromiViz = "promiviz"
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
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
      caches.match(fetchEvent.request).then(res => {
        return res || fetch(fetchEvent.request)
      })
    )
  })