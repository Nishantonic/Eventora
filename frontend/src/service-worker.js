// src/service-worker.js - Basic service worker for PWA
// Learn more: https://developers.google.com/web/tools/workbox/modules/workbox-sw

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js'
);

workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.NetworkFirst()
);

// Add more caching strategies as needed