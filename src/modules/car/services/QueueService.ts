import Queue from "bull";
import redisConfig from "../../../shared/config/redis";

// Configuração correta do Bull
const carQueue = new Queue("carQueue", { redis: redisConfig });

export const addCarToQueue = async (carId: string, createdAt: Date) => {
  await carQueue.add({
    carId,
    createdAt,
  });
};
