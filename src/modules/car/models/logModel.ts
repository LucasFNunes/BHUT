import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

export const saveLog = async (logData: any) => {
  await redisClient.connect();
  await redisClient.set(`log:${logData.id}`, JSON.stringify(logData));
  await redisClient.disconnect();
};
