import dotenv from "dotenv";
import { createClient } from "redis";

const redisClient = createClient({
  url: "redis://localhost:6379",
});

dotenv.config();

export default class FindAllLogsService {
  static async findAllLogs(): Promise<any> {
    await redisClient.connect();

    // Busca todas as chaves que começam com "log:"
    const keys = await redisClient.keys("log:*");

    // Busca os valores associados a cada chave
    const logs = await Promise.all(
      keys.map(async (key) => {
        const value = await redisClient.get(key);
        return JSON.parse(value || "{}");
      })
    );

    await redisClient.disconnect();
    return logs;
  }
}
