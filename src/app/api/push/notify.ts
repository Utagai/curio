import { PushSubscriptionRecord } from "@/app/model/pushSubscription";
import { dbFactory } from "../factory";
import { PushPayload, sendPush } from "./send";

async function sendToSubscriptions(
  subscriptions: PushSubscriptionRecord[],
  payload: PushPayload,
): Promise<void> {
  if (subscriptions.length === 0) {
    return;
  }

  const db = dbFactory();
  await Promise.allSettled(
    subscriptions.map(async (subscription) => {
      try {
        await sendPush(subscription, payload);
      } catch (error: any) {
        // 404 / 410 mean the subscription is gone (uninstalled, revoked, etc.),
        // so prune it instead of retrying forever.
        if (error?.statusCode === 404 || error?.statusCode === 410) {
          await db.deletePushSubscription(subscription.endpoint);
        } else {
          console.error("Failed to send push notification:", error);
        }
      }
    }),
  );
}

// Notify everyone except `excludedUsername` (used when a new post is created).
export async function notifyEveryoneExcept(
  excludedUsername: string,
  payload: PushPayload,
): Promise<void> {
  const db = dbFactory();
  const subscriptions = await db.allPushSubscriptions();
  await sendToSubscriptions(
    subscriptions.filter((s) => s.username !== excludedUsername),
    payload,
  );
}

// Notify a single user (used when someone submits a find to their post).
export async function notifyUser(
  username: string,
  payload: PushPayload,
): Promise<void> {
  const db = dbFactory();
  const subscriptions = await db.pushSubscriptionsFor(username);
  await sendToSubscriptions(subscriptions, payload);
}
