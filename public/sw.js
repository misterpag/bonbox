// Service worker minimal : rend l'app installable et prépare les notifications Web Push.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", () => {});
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { title: "Bonbox", body: "Tu as reçu une boîte !" };
  event.waitUntil(self.registration.showNotification(data.title, { body: data.body, icon: "/icon.svg" }));
});
