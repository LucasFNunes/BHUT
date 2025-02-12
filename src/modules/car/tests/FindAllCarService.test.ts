import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import FindAllCarService from "../services/FindAllCarService";
import Authentication from "../../../shared/auth/Authentication";

jest.mock("../../../shared/auth/Authentication");

describe("FindAllCarService", () => {
  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset(); // Reseta os mocks antes de cada teste
    jest.clearAllMocks(); // Limpa os mocks das dependências
  });

  it("deve retornar todos os carros com sucesso", async () => {
    // Configuração inicial
    const mockResponseData = [
      {
        id: "1",
        nome: "Etios",
        marca: "Toyota",
        preco: 49999.99,
        anoFabricacao: 2014,
      },
      {
        id: "2",
        nome: "Civic",
        marca: "Honda",
        preco: 69999.99,
        anoFabricacao: 2020,
      },
    ];
    const apiLink = "https://api.example.com";
    const mockToken = "mocked-token";

    // Mock das variáveis de ambiente
    process.env.API_LINK = apiLink;

    // Mock da função de autenticação
    (Authentication.execute as jest.Mock).mockResolvedValue(mockToken);

    // Mock da requisição GET
    mock.onGet(`${apiLink}/v1/carro`).reply(200, mockResponseData);

    // Execução do serviço
    const response = await FindAllCarService.findAllCar();

    // Validações
    expect(response).toEqual(mockResponseData);
    expect(mock.history.get.length).toBe(1);
    expect(mock.history.get[0].url).toBe(`${apiLink}/v1/carro`);
    expect(mock.history.get[0].headers?.Authorization).toBe(
      `Bearer ${mockToken}`
    );
  });

  it("deve lançar erro se o token não for gerado", async () => {
    // Mock das variáveis de ambiente
    process.env.API_LINK = "https://api.example.com";

    // Mock da função de autenticação para retornar null
    (Authentication.execute as jest.Mock).mockResolvedValue(null);

    // Execução e validação
    await expect(FindAllCarService.findAllCar()).rejects.toThrow(
      "Erro ao realizar o login."
    );
    expect(mock.history.get.length).toBe(0); // Nenhuma requisição GET deve ser feita
  });

  it("deve lançar erro se a API retornar erro", async () => {
    // Configuração inicial
    const apiLink = "https://api.example.com";
    const mockToken = "mocked-token";

    // Mock das variáveis de ambiente
    process.env.API_LINK = apiLink;

    // Mock da função de autenticação
    (Authentication.execute as jest.Mock).mockResolvedValue(mockToken);

    // Mock da requisição GET com erro
    mock.onGet(`${apiLink}/v1/carro`).reply(500);

    // Execução e validação
    await expect(FindAllCarService.findAllCar()).rejects.toThrow(
      "Erro ao buscar carros."
    );
    expect(mock.history.get.length).toBe(1);
  });
});
