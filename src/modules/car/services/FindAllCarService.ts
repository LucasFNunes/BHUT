import axios from "axios";
import Authentication from "../../../shared/auth/Authentication";
import dotenv from "dotenv";
dotenv.config();

export default class FindAllCarService {
  static async findAllCar(): Promise<any> {
    const apiLink = process.env.API_LINK;

    const token = await Authentication.execute();

    if (apiLink && token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
        },
      };
      try {
        const response = await axios.get(`${apiLink}/v1/carro`, config); // Faz a requisição POST

        return response.data;
      } catch (error) {
        console.error("Erro ao tentar logar:", error);
        throw new Error("Erro ao realizar o login.");
      }
    }
  }
}
