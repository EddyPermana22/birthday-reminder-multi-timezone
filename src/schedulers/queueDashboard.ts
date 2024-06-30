import dotenv from "dotenv";
import express from "express";
import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { ExpressAdapter } from "@bull-board/express";

import birthdayNotificationQueue from "./birthday/birthdayNotificationQueue";

dotenv.config();

const queueDashboardPort = process.env.QUEUE_DASHBOARD_PORT || 3030;

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/admin/queues");

createBullBoard({
  queues: [new BullAdapter(birthdayNotificationQueue)],
  serverAdapter: serverAdapter,
});

const app = express();

app.use("/admin/queues", serverAdapter.getRouter());

app.listen(queueDashboardPort, () => {
  console.log(`Running on ${queueDashboardPort}...`);
});
