import dotenv from "dotenv";
import os from "os";
import cluster from "cluster";

dotenv.config();

import birthdayNotificationQueue from "./birthdayNotificationQueue";
import BirthdayNotificationService from "../../services/birthdayNotificationService";
import mongoDBConnection from "../../configs/mongoDBConnection";
import UserService from "../../services/userService";

const numWorkers = process.env.NUM_WORKERS
  ? parseInt(process.env.NUM_WORKERS)
  : os.cpus().length;
const mongoDBURI = process.env.MONGODB_URI;

if (!mongoDBURI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

if (cluster.isPrimary) {
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on("exit", function (worker) {
    console.error("worker " + worker.process.pid + " died");
  });
} else {
  birthdayNotificationQueue.process("sendBirthdayNotification", async (job) => {
    try {
      console.info(`Processing job ${job.id} with data:`, job.data);

      await mongoDBConnection(mongoDBURI);

      const response =
        await BirthdayNotificationService.sendBirthdayNotification(job.data);

      await UserService.updateUserByUserId(job.data.userId, {
        thisYearBirthdayNotificationStatus: "sent",
      });

      console.info(`Job ${job.id} has been processed successfully`);

      return response;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to process job:", error.message);
      } else {
        console.error("Failed to process job:", error);
      }
      throw error;
    }
  });
}
