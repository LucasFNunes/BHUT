import { createClient } from "redis";

// Cria uma instância do cliente Redis
const redisClient = createClient({
  url: "redis://localhost:6379", // URL de conexão com o Redis
});

// Conecta ao Redis
redisClient
  .connect()
  .then(() => {
    console.log("Conectado ao Redis!");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao Redis:", err);
  });

export default redisClient;
