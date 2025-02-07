import AppDataSource from "../../../ormconfig";
import { UrlShortener } from "../schemas/schema";

export default class FindAllUrlService {
  static async findAllUrl(): Promise<UrlShortener[] | null> {
    try {
      const urlLogin = process.env.API_LOGIN_LINK;
      const token = "seu-token-jwt-aqui"; 
      
      const data = {
        login: process.env.API_LOGIN_USER,
        senha: process.env.API_LOGIN_PASSWORD,
        token: token,
      };
  
      const response = await axios.post(urlLogin, data); // Faz a requisição POST
  
      console.log("Resposta do POST:", response.data); // Exibe a resposta
    try {
      const items = await urlShortenerRepository.find({
        where: { userId, isTrashed: false }, // Filtro pelo userId
      });

      return items;
    } catch (error) {
      console.error("Erro ao buscar itens por userId:", error);
      throw new Error("Erro ao buscar itens.");
    }
  }
}
