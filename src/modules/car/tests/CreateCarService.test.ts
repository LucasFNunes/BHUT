import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import CreateCarService from "../services/CreateCarService";
import Authentication from "../../../shared/auth/Authentication";
import { addCarToQueue } from "../services/QueueService";

jest.mock("../../../shared/auth/Authentication");
jest.mock("../services/QueueService");

describe("CreateCarService", () => {
  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset(); // Reseta os mocks antes de cada teste
    jest.clearAllMocks(); // Limpa os mocks das dependências
  });

  it("deve criar um carro com sucesso e adicioná-lo à fila", async () => {
    // Configuração inicial
    const mockCarData = {
      nome: "Etios",
      marca: "Toyota",
      preco: 49999.99,
      anoFabricacao: 2014,
    };
    const mockResponseData = {
      id: "861565ca-cbde-4da7-8804-79c2088652fb",
      ...mockCarData,
    };
    const apiLink = "https://api.example.com";
    const mockToken = "mocked-token";

    // Mock das variáveis de ambiente
    process.env.API_LINK = apiLink;

    // Mock da função de autenticação
    (Authentication.execute as jest.Mock).mockResolvedValue(mockToken);

    // Mock da requisição POST
    mock
      .onPost(`${apiLink}/v1/carro`, mockCarData)
      .reply(201, mockResponseData);

    // Mock da função addCarToQueue
    (addCarToQueue as jest.Mock).mockResolvedValue(undefined);

    // Execução do serviço
    const response = await CreateCarService.create(mockCarData);

    // Validações
    expect(response).toEqual(mockResponseData);
    expect(mock.history.post.length).toBe(1);
    expect(mock.history.post[0].url).toBe(`${apiLink}/v1/carro`);
    expect(mock.history.post[0].data).toBe(JSON.stringify(mockCarData));
    expect(mock.history.post[0].headers?.Authorization).toBe(
      `Bearer ${mockToken}`
    );
    expect(addCarToQueue).toHaveBeenCalledWith(
      mockResponseData.id,
      expect.any(Date)
    );
  });

  it("deve lançar erro se o token não for gerado", async () => {
    // Mock das variáveis de ambiente
    process.env.API_LINK = "https://api.example.com";

    // Mock da função de autenticação para retornar null
    (Authentication.execute as jest.Mock).mockResolvedValue(null);

    // Execução e validação
    await expect(CreateCarService.create({})).rejects.toThrow();
    expect(addCarToQueue).not.toHaveBeenCalled();
  });

  it("deve lançar erro se a requisição POST falhar", async () => {
    // Configuração inicial
    const mockCarData = {
      nome: "Etios",
      marca: "Toyota",
      preco: 49999.99,
      anoFabricacao: 2014,
    };
    const apiLink = "https://api.example.com";
    const mockToken = "mocked-token";

    // Mock das variáveis de ambiente
    process.env.API_LINK = apiLink;

    // Mock da função de autenticação
    (Authentication.execute as jest.Mock).mockResolvedValue(mockToken);

    // Mock da requisição POST com erro
    mock.onPost(`${apiLink}/v1/carro`, mockCarData).reply(500);

    // Execução e validação
    await expect(CreateCarService.create(mockCarData)).rejects.toThrow();
    expect(addCarToQueue).not.toHaveBeenCalled();
  });
});
