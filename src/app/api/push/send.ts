import * as webpush from "web-push";
import { PushSubscriptionRecord } from "@/app/model/pushSubscription";

export type PushPayload = {
  title: string;
  body: string;
  url: string;
};

let vapidConfigured = false;

function ensureVapidDetails(): void {
  if (vapidConfigured) {
    return;
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    throw new Error(
      "Missing VAPID configuration. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, and VAPID_SUBJECT.",
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  vapidConfigured = true;
}

// Sends a single push notification. Throws a WebPushError (with a `statusCode`)
// if the push service rejects it, so callers can prune dead subscriptions.
export async function sendPush(
  subscription: PushSubscriptionRecord,
  payload: PushPayload,
): Promise<void> {
  ensureVapidDetails();
  await webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: subscription.keys,
    },
    JSON.stringify(payload),
  );
}
