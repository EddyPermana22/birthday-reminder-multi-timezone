import dotenv from "dotenv";
import IORedis from "ioredis";

dotenv.config();

const redisHost: string = process.env.REDIS_HOST || "127.0.0.1";
const redisPort: number = parseInt(process.env.REDIS_PORT || "6379", 10);

const connection = new IORedis({
  host: redisHost,
  port: redisPort,
  maxRetriesPerRequest: null,
});

export default connection;
