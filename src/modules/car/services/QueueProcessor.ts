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
  const apiLink = process.env.API_LINK;

  // Enviar webhook
  await sendWebhook(
    `https://webhook.site/86c72498-3495-4fc9-aa6b-6a9e8f569b93`,
    {
      carId,
      createdAt,
    }
  );
});
