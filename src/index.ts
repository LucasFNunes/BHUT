import express from "express";
import routes from "./shared/routes";
import swaggerUi from "swagger-ui-express";
import * as fs from "fs";
import * as yaml from "js-yaml";
import redis from "redis"; // Importa o cliente Redis

// Carregar o arquivo Swagger YAML
const swaggerDocument = yaml.load(
  fs.readFileSync("./swagger.yaml", "utf8")
) as object;

const app = express();
const PORT = 3000; // Porta onde o servidor será executado

// Configuração do Redis
const redisClient = redis.createClient(); // Cria uma instância do cliente Redis

// Middleware para parsear JSON no corpo da requisição
app.use(express.json());
app.use(routes);

// Rota principal para verificar o funcionamento do servidor
app.get("/", (req, res) => {
  res.send("Olá, mundo! Servidor Express com Redis está funcionando!");
});

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware para verificar a conexão com o Redis
redisClient.on("connect", () => {
  console.log("Conexão com o Redis foi bem-sucedida!");

  // Inicia o servidor
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
  });
});

// Tratamento de erros do Redis
redisClient.on("error", (error) => {
  console.error("Erro ao conectar ao Redis:", error);
});
