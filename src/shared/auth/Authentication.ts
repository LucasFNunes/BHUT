import axios from "axios";
import redisClient from "./RedisClient";
import { storeTokens, refreshAccessToken } from "./TokenUtils";

export default class Authentication {
  static async execute(): Promise<string | null> {
    const apiLink = process.env.API_LINK;
    const loginData = {
      login: process.env.API_LOGIN_USER,
      senha: process.env.API_LOGIN_PASSWORD,
    };

    if (!apiLink || !loginData.login || !loginData.senha) {
      throw new Error("Variáveis de ambiente para login não configuradas.");
    }

    try {
      // Verifica se já existe um accessToken válido no Redis
      let accessToken = await redisClient.get("accessToken");

      if (!accessToken) {
        // Se o accessToken não existir ou tiver expirado, será necessario logar novamente

        const response = await axios.post(
          `${apiLink}/v1/autenticacao/token`,
          loginData
        );

        // Armazena os novos tokens no Redis
        await storeTokens(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.expiresIn
        );

        accessToken = response.data.accessToken;
      } else {
        const refreshToken = await redisClient.get("refreshToken");
        if (refreshToken) {
          // Usa o refreshToken para obter um novo accessToken
          const newTokens = await refreshAccessToken(apiLink, refreshToken);
          accessToken = newTokens.accessToken;

          // Armazena os novos tokens no Redis
          await storeTokens(
            newTokens.accessToken,
            newTokens.refreshToken,
            newTokens.expiresIn
          );
        }
      }

      return accessToken;
    } catch (error) {
      console.error("Erro ao tentar obter o token:", error);
      throw new Error("Erro ao realizar a autenticação.");
    }
  }
}
