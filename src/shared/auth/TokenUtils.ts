import redisClient from "./RedisClient";
import axios from "axios";

// Função para armazenar os tokens no Redis
export async function storeTokens(
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) {
  await redisClient.set("accessToken", accessToken, {
    EX: expiresIn, // Expira em 'expiresIn' segundos
  });
  await redisClient.set("refreshToken", refreshToken); // RefreshToken não expira (ou pode ter um tempo maior)
}

// Função para obter um novo accessToken usando o refreshToken
export async function refreshAccessToken(
  apiLink: string,
  refreshToken: string
) {
  try {
    const response = await axios.post(
      `${apiLink}/v1/autenticacao/renova-token`,
      {
        tokenRenovado: refreshToken,
      }
    );

    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
    };
  } catch (error) {
    throw new Error("Erro ao realizar a autenticação.");
  }
}
