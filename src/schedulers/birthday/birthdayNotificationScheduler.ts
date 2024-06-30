import cron from "node-cron";
import dayjs from "dayjs";
import dotenv from "dotenv";

dotenv.config();

import mongoDBConnection from "../../configs/mongoDBConnection";
import UserService from "../../services/userService";
import birthdayNotificationQueue from "./birthdayNotificationQueue";

const mongoDBURI = process.env.MONGODB_URI as string;

if (!mongoDBURI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

async function handleBirthdayNotification(): Promise<void> {
  try {
    await mongoDBConnection(mongoDBURI);
    console.log("Start scheduling birthday notification - ", dayjs().format());

    const users = await UserService.findUsersAtNextMidnightWithBirthday();
    const bulkOps = [];

    for (const user of users) {
      console.log("Send birthday notification to", user.email);

      const job = await birthdayNotificationQueue.add(
        "sendBirthdayNotification",
        {
          userId: user.userId,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          birthdate: user.birthdate,
          timezone: user.location?.timezone,
        }
      );

      bulkOps.push({
        updateOne: {
          filter: { userId: user.userId },
          update: {
            $set: {
              thisYearBirthdayNotificationStatus: "scheduled",
              thisYearBirthdayNotificationJobId: job.id,
            },
          },
        },
      });
    }

    if (bulkOps.length > 0) {
      await UserService.batchUpdateUser(bulkOps);
    }

    console.log(
      "Complete scheduling birthday notification - ",
      dayjs().format()
    );
  } catch (error) {
    console.error(
      "Error scheduling birthday notification:",
      error instanceof Error ? error.message : error
    );
  }
}

async function handleClearingNotification(): Promise<void> {
  try {
    await mongoDBConnection(mongoDBURI);
    console.log("Start clearing notification schedule - ", dayjs().format());

    const users =
      await UserService.findUsersAlreadyNotified7DaysAfterBirthday();

    console.log("Clearing notification schedule for", users.length, "users");
    const bulkOps = [];

    for (const user of users) {
      bulkOps.push({
        updateOne: {
          filter: { userId: user.userId },
          update: {
            $set: {
              thisYearBirthdayNotificationStatus: "not_schedule",
              thisYearBirthdayNotificationJobId: null,
            },
          },
        },
      });
    }

    if (bulkOps.length > 0) {
      await UserService.batchUpdateUser(bulkOps);
    }

    console.log("Complete clearing notification schedule - ", dayjs().format());
  } catch (error) {
    console.error(
      "Error clearing notification schedule:",
      error instanceof Error ? error.message : error
    );
  }
}

// Cron job to schedule birthday notification every 15 minutes
cron.schedule("*/15 * * * *", handleBirthdayNotification);

// Cron job to clear notification schedule every day at 1 AM
cron.schedule("0 1 * * *", handleClearingNotification);
