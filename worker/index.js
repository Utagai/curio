// Custom service worker code, bundled into the generated `sw.js` by next-pwa.
// Handles incoming Web Push notifications and taps on them.

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    // Fall back to plain text if the payload wasn't JSON.
    data = { title: "Curio", body: event.data ? event.data.text() : "" };
  }

  const title = data.title || "Curio";
  const options = {
    body: data.body || "",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    data: { url: data.url || "/" },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const url = (event.notification.data && event.notification.data.url) || "/";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // If Curio is already open, focus it and navigate to the target page.
        for (const client of clientList) {
          if ("focus" in client) {
            if ("navigate" in client) {
              client.navigate(url);
            }
            return client.focus();
          }
        }
        // Otherwise open a fresh window at the target page.
        if (self.clients.openWindow) {
          return self.clients.openWindow(url);
        }
      }),
  );
});
