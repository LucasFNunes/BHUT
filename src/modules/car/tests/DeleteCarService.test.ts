import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import DeleteCarService from "../services/DeleteCarService";
import Authentication from "../../../shared/auth/Authentication";

describe("DeleteCarService", () => {
  const mock = new MockAdapter(axios);

  beforeEach(() => {
    mock.reset(); // Reseta os mocks antes de cada teste
  });

  it("deve deletar o carro com sucesso", async () => {
    // Configuração inicial
    const mockId = "861565ca-cbde-4da7-8804-79c2088652fb";
    const apiLink = "https://api.example.com";
    const mockToken = "mocked-token";

    // Mock das variáveis de ambiente
    process.env.API_LINK = apiLink;

    // Mock da função de autenticação
    jest.spyOn(Authentication, "execute").mockResolvedValue(mockToken);

    // Mock da requisição DELETE
    mock.onDelete(`${apiLink}/v1/carro/${mockId}`).reply(200);

    // Execução do serviço
    const response = await DeleteCarService.delete(mockId);

    // Validações
    expect(response).toBe(" Carro deletado com sucesso !");
    expect(mock.history.delete.length).toBe(1);
    expect(mock.history.delete[0].url).toBe(`${apiLink}/v1/carro/${mockId}`);
    expect(mock.history.delete[0].headers?.Authorization).toBe(
      `Bearer ${mockToken}`
    );
  });

  it("deve lançar erro se o token não for gerado", async () => {
    // Mock das variáveis de ambiente
    process.env.API_LINK = "https://api.example.com";

    // Mock da função de autenticação para retornar null
    jest.spyOn(Authentication, "execute").mockResolvedValue(null);

    // Execução e validação
    await expect(DeleteCarService.delete("any-id")).rejects.toThrow(
      "Erro ao realizar o login."
    );
  });

  it("deve lançar erro se a API_LINK não estiver configurada", async () => {
    // Mock das variáveis de ambiente
    process.env.API_LINK = "";

    // Mock da função de autenticação
    jest.spyOn(Authentication, "execute").mockResolvedValue("mocked-token");

    // Execução e validação
    await expect(DeleteCarService.delete("any-id")).rejects.toThrow(
      "Erro ao realizar o login."
    );
  });

  it("deve lançar erro se a requisição DELETE falhar", async () => {
    // Configuração inicial
    const mockId = "861565ca-cbde-4da7-8804-79c2088652fb";
    const apiLink = "https://api.example.com";
    const mockToken = "mocked-token";

    // Mock das variáveis de ambiente
    process.env.API_LINK = apiLink;

    // Mock da função de autenticação
    jest.spyOn(Authentication, "execute").mockResolvedValue(mockToken);

    // Mock da requisição DELETE com erro
    mock.onDelete(`${apiLink}/v1/carro/${mockId}`).reply(500);

    // Execução e validação
    await expect(DeleteCarService.delete(mockId)).rejects.toThrow(
      "Erro ao deletar carro."
    );
  });
});
