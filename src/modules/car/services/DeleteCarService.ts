import axios from "axios";
import Authentication from "../../../shared/auth/Authentication";
import dotenv from "dotenv";
dotenv.config();

export default class DeleteCarService {
  static async delete(id: string): Promise<String> {
    const apiLink = process.env.API_LINK;

    const token = await Authentication.execute();

    if (apiLink && token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
        },
      };
      try {
        await axios.delete(`${apiLink}/v1/carro/${id}`, config); // Faz a requisição DELETE

        return " Carro deletado com sucesso !";
      } catch (error) {
        console.error("Erro ao tentar deletar carro:", error);
        throw new Error("Erro ao deletar carro.");
      }
    } else {
      throw new Error("Erro ao realizar o login.");
    }
  }
}
