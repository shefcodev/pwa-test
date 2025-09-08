"use server";

import webpush from "web-push";

interface PushSubscriptionType extends PushSubscription {
  keys: any;
}

webpush.setVapidDetails(
  "mailto:sherif.jimoh@vitestack.com",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

let subscription: PushSubscriptionType | null = null;

export async function subscribeUser(sub: PushSubscriptionType) {
  subscription = sub;
  console.log(subscription);
  return { success: true };
}

export async function unsubscribeUser() {
  subscription = null;
  console.log(subscription);
  return { success: true };
}

export async function sendNotification(message: string) {
  console.log(subscription, message);
  if (!subscription) {
    throw new Error("no subscription available.");
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title: "Title", body: message, icon: "/icon.png" })
    );

    return { success: true };
  } catch (error) {
    console.log("error sending push notification", error);
    return { success: false, error: "failed to send notification" };
  }
}
