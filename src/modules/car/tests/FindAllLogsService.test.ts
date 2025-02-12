import FindAllLogsService from "../services/FindAllLogsService";
import { createClient } from "redis";

jest.mock("redis");

describe("FindAllLogsService", () => {
  const mockRedisClient = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    keys: jest.fn(),
    get: jest.fn(),
  };

  beforeAll(() => {
    // Simula o cliente Redis com redis-mock
    (createClient as jest.Mock).mockReturnValue(mockRedisClient);
  });

  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it("deve retornar todos os logs do Redis", async () => {
    // Mock das chaves e valores do Redis
    const mockKeys = ["log:1", "log:2"];
    const mockValues = [
      JSON.stringify({ id: "1", mensagem: "Primeiro log" }),
      JSON.stringify({ id: "2", mensagem: "Segundo log" }),
    ];

    mockRedisClient.keys.mockResolvedValue(mockKeys); // Simula as chaves
    mockRedisClient.get.mockImplementation((key: string) =>
      Promise.resolve(mockValues[mockKeys.indexOf(key)])
    ); // Simula os valores

    // Execução do serviço
    const logs = await FindAllLogsService.findAllLogs();

    // Validações
    expect(mockRedisClient.connect).toHaveBeenCalled();
    expect(mockRedisClient.keys).toHaveBeenCalledWith("log:*");
    expect(mockRedisClient.get).toHaveBeenCalledTimes(mockKeys.length);
    expect(mockRedisClient.get).toHaveBeenCalledWith("log:1");
    expect(mockRedisClient.get).toHaveBeenCalledWith("log:2");
    expect(mockRedisClient.disconnect).toHaveBeenCalled();
    expect(logs).toEqual([
      { id: "1", mensagem: "Primeiro log" },
      { id: "2", mensagem: "Segundo log" },
    ]);
  });

  it("deve retornar uma lista vazia se não houver logs no Redis", async () => {
    // Mock para chaves vazias
    mockRedisClient.keys.mockResolvedValue([]);

    // Execução do serviço
    const logs = await FindAllLogsService.findAllLogs();

    // Validações
    expect(mockRedisClient.connect).toHaveBeenCalled();
    expect(mockRedisClient.keys).toHaveBeenCalledWith("log:*");
    expect(mockRedisClient.get).not.toHaveBeenCalled();
    expect(mockRedisClient.disconnect).toHaveBeenCalled();
    expect(logs).toEqual([]);
  });

  it("deve lançar erro se a conexão com o Redis falhar", async () => {
    // Mock para falha na conexão
    mockRedisClient.connect.mockRejectedValue(new Error("Falha na conexão"));

    // Execução e validação
    await expect(FindAllLogsService.findAllLogs()).rejects.toThrow(
      "Falha na conexão"
    );

    expect(mockRedisClient.connect).toHaveBeenCalled();
    expect(mockRedisClient.disconnect).not.toHaveBeenCalled();
  });
});
