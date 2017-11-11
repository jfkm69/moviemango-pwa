var cacheName = 'moviemango';
var filesToCache = [
	'/moviemango/index.html',
	'/moviemango/scripts/app.js',
	'/moviemango/css/style.css',
];

self.addEventListener('install', function(e){
	console.log('[ServiceWorker] Install');
	e.waitUntil(
		caches.open(cacheName).then(function(cache){
			console.log('[ServiceWorker] caching app shell');
			return cache.addAll(filesToCache);
		})
	);
});

self.addEventListener('activate', function(e) {

  console.log('[ServiceWorker] Activate');

  e.waitUntil(
  	caches.keys().then(function(keyList) {
  		return Promise.all(keyList.map(function(key) {
  			if (key !== cacheName) {
  				console.log('[ServiceWorker] Removing old cache', key);
  				return caches.delete(key);
  			}
  		}));
  	})
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
	console.log('[ServiceWorker] Fetch', e.request.url);
	e.respondWith(
		caches.match(e.request).then(function(response) {
			return response || fetch(e.request);
		})
	);
});