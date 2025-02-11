import axios from "axios";
import Authentication from "../../../shared/auth/Authentication";
import { addCarToQueue } from "./QueueService";

export default class CreateCarService {
  static async create(carData: any): Promise<any> {
    try {
      const apiLink = process.env.API_LINK;
      const token = await Authentication.execute();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
        },
      };

      const response = await axios.post(`${apiLink}/v1/carro`, carData, config);

      await addCarToQueue(response.data.id, new Date());

      return response.data;
    } catch (error) {
      console.error("Erro ao criar carro na API externa:", error);
      throw error;
    }
  }
}
