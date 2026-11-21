export type PushSubscriptionKeys = {
  p256dh: string;
  auth: string;
};

// A browser push subscription, stored server-side so we can send notifications
// to a user even when the app is closed. Keyed by username to match how the
// rest of Curio identifies users.
export type PushSubscriptionRecord = {
  username: string;
  endpoint: string;
  keys: PushSubscriptionKeys;
};
