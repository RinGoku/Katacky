"use client";
import { MessagePayload, getToken, onMessage } from "firebase/messaging";
import { messaging } from "~/lib/firebase/browser";
import { trpc } from "~/lib/trpc/connectNext";

export const requestForToken = async () => {
  const updateDeviceToken = trpc.user.updateDeviceToken.useMutation();
  const tokenInLocalForage = localStorage.getItem("fcm_token");
  if (tokenInLocalForage) {
    return tokenInLocalForage;
  }
  const status = await Notification.requestPermission();
  if (!status || status !== "granted") {
    return null;
  }
  const token = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FCM_TOKEN,
  }).catch((err) => {
    console.error("An error occurred while retrieving token. ", err);
    return null;
  });
  if (!token) {
    console.log(
      "No registration token available. Request permission to generate one."
    );
    return null;
  }
  console.log("current token for client: ", token);
  localStorage.setItem("fcm_token", token);
  await updateDeviceToken.mutateAsync({ deviceToken: token });
  return token;
};

export const onMessageListener: () => Promise<MessagePayload> = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload);
      resolve(payload);
    });
  });