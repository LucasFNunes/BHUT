import { saveLog } from "../models/logModel";
import { sendWebhook } from "../services/WebhookService";
import Queue from "bull";
import redisConfig from "../../../shared/config/redis";

const carQueue = new Queue("carQueue", { redis: redisConfig });

carQueue.process(async (job) => {
  const { carId, createdAt } = job.data;

  // Salvar log no Redis
  await saveLog({
    id: job.id,
    car_id: carId,
    data_hora_criacao: createdAt,
    data_hora_processamento: new Date(),
  });

  // Enviar webhook
  await sendWebhook("https://webhook.site/your-webhook-url", {
    carId,
    createdAt,
  });
});
