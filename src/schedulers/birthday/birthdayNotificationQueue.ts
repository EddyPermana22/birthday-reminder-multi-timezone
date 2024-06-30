import Queue from "bull";

// Delay for tomorrow at 9:00 AM in milliseconds
const delay = 33 * 60 * 60 * 1000;

const birthdayNotificationQueue = new Queue("Send Birthday Notification", {
  defaultJobOptions: {
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    attempts: 5,
    delay: delay,
  },
});

export default birthdayNotificationQueue;
