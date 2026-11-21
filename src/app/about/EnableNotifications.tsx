"use client";

import { useEffect, useState } from "react";
import SubmitButton from "@/app/posts/new/SubmitButton";
import { subscribeToPush, unsubscribeFromPush } from "@/app/actions";

type Status =
  | "checking"
  | "unsupported"
  | "idle"
  | "working"
  | "subscribed"
  | "denied"
  | "error";

// Converts the URL-safe base64 VAPID public key into the byte array that
// pushManager.subscribe expects.
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function EnableNotifications() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }

    let cancelled = false;
    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => {
        if (!cancelled) {
          setStatus(subscription ? "subscribed" : "idle");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("idle");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const enable = async () => {
    setStatus("working");
    try {
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        throw new Error("NEXT_PUBLIC_VAPID_PUBLIC_KEY is not set");
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const json = subscription.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
        throw new Error("incomplete push subscription");
      }

      await subscribeToPush({
        endpoint: json.endpoint,
        keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
      });

      setStatus("subscribed");
    } catch (error) {
      console.error("Failed to enable notifications:", error);
      setStatus("error");
    }
  };

  const disable = async () => {
    setStatus("working");
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await unsubscribeFromPush(subscription.endpoint);
        await subscription.unsubscribe();
      }
      setStatus("idle");
    } catch (error) {
      console.error("Failed to disable notifications:", error);
      setStatus("error");
    }
  };

  let body: React.ReactNode;
  switch (status) {
    case "checking":
      body = <p className="text-gray-400">Checking&hellip;</p>;
      break;
    case "unsupported":
      body = (
        <p className="text-gray-400">
          Notifications aren&apos;t supported on this device.
        </p>
      );
      break;
    case "working":
      body = (
        <SubmitButton onClick={() => {}} disabled isLoading>
          Working&hellip;
        </SubmitButton>
      );
      break;
    case "subscribed":
      body = (
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-300">Notifications are on for this device.</p>
          <SubmitButton onClick={disable}>Turn off</SubmitButton>
        </div>
      );
      break;
    case "denied":
      body = (
        <p className="text-gray-400">
          Notifications are blocked. Enable them for Curio in your
          browser/device settings, then try again.
        </p>
      );
      break;
    case "error":
      body = (
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-400">Something went wrong. Try again.</p>
          <SubmitButton onClick={enable}>Enable notifications</SubmitButton>
        </div>
      );
      break;
    case "idle":
    default:
      body = (
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-300">
            Get notified about new curios and finds.
          </p>
          <SubmitButton onClick={enable}>Enable notifications</SubmitButton>
        </div>
      );
      break;
  }

  return (
    <div className="font-baloo2 bg-gray-700 rounded-lg shadow-xl border border-pink-200 m-4 p-4 flex flex-col items-center text-center gap-2">
      <p className="text-2xl text-pink-400">Notifications</p>
      {body}
    </div>
  );
}
