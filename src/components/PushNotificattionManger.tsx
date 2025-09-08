"use client";

import React, { useState, useEffect, Fragment } from "react";
import {
  subscribeUser,
  unsubscribeUser,
  sendNotification,
} from "@/app/actions";
import { urlBase64ToUint8Array } from "@/lib/utils";

const PushNotificattionManager = () => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [subscription, setSubscriptiion] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState<string>("");
  const [intervalId, setIntervalId] = useState<any>();

  useEffect(() => {
    Notification.requestPermission()
      .then((permission) => console.log(permission))
      .catch((error) => console.log(error));

    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  useEffect(() => {
    const subscribe = async () => {
      if (!subscription) {
        await subscribeToPush();
      }
    };
    subscribe();
  }, []);

  const registerServiceWorker = async () => {
    const registration = await navigator.serviceWorker.register("sw.js", {
      scope: "/",
      updateViaCache: "none",
    });

    const sub = await registration.pushManager.getSubscription();
    setSubscriptiion(sub);
  };

  const subscribeToPush = async () => {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });

    setSubscriptiion(sub);
    const serializedSub = JSON.parse(JSON.stringify(sub));
    await subscribeUser(serializedSub);
    console.log(serializedSub, 1);
  };

  const unsubscribeFromPush = async () => {
    await subscription?.unsubscribe();
    setSubscriptiion(null);
    await unsubscribeUser();
  };

  const sendPushNotification = async () => {
    if (subscription) {
      await sendNotification(message);
      setMessage("");
    }
  };

  const sendNotificationAtInterval = (interval: number, func: () => void) => {
    const id = setInterval(() => {
      func();
    }, interval);

    setIntervalId(id);
  };

  const stopNotificationAtInterval = () => {
    clearInterval(intervalId);
  };

  if (!isSupported) {
    return <p>notification not suppoted on this browser.</p>;
  }

  return (
    <div>
      <h3>Push Notifications</h3>
      {subscription ? (
        <Fragment>
          <p>You are subscribed to push notifications.</p>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button
            onClick={() =>
              sendNotificationAtInterval(30000, sendPushNotification)
            }
          >
            Send Notification
          </button>
          <button onClick={stopNotificationAtInterval}>
            Stop Notification
          </button>
        </Fragment>
      ) : (
        <Fragment>
          <p>You are not subscribed to push notifications.</p>
        </Fragment>
      )}
    </div>
  );
};

export default PushNotificattionManager;
