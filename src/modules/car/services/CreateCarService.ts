import axios from "axios";

export default class CreateCarService {
  static async create(carData: any): Promise<any> {
    try {
      const API_URL = "https://api.externa.com/v1/carro";
      const response = await axios.post(API_URL, carData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar carro na API externa:", error);
      throw error;
    }
  }
}
