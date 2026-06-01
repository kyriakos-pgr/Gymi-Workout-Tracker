import * as Notifications from "expo-notifications";

export const scheduleWorkoutReminder = async () => {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== "granted") return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Time to lift 💪",
      body: "Your heavy *ss weights are waiting for you!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 18,
      minute: 0,
    },
  });
};

export const scheduleUpdateReminder = async () => {
  const { status } = await Notifications.requestPermissionsAsync();

  if (status !== "granted") return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "New updates may be waiting 👀",
      body: "Check for improvements and new app features.",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 12,
      minute: 0,
    },
  });
};
