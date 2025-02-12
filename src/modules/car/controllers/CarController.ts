import { Request, Response } from "express";
import FindAllCarService from "../services/FindAllCarService";
import CreateCarService from "../services/CreateCarService";
import FindAllLogsService from "../services/FindAllLogsService";
import DeleteCarService from "../services/DeleteCarService";

const CarController = {
  async findAllCar(request: Request, response: Response) {
    try {
      const allCar = await FindAllCarService.findAllCar();

      return response.status(200).json(allCar);
    } catch (error: any) {
      return response.status(500).send({ error: error.message });
    }
  },
  async create(request: Request, response: Response) {
    const carData = request.body;
    try {
      const createdCar = await CreateCarService.create(carData);
      return response.status(201).json(createdCar);
    } catch (error) {
      response.status(500).json({ error: "Erro ao criar carro" });
    }
  },
  async delete(request: Request, response: Response) {
    const { id } = request.params;
    try {
      const returned = await DeleteCarService.delete(id);
      return response.status(201).json({ message: returned });
    } catch (error) {
      response.status(500).json({ error: "Erro ao criar carro" });
    }
  },
  async findAllLogs(request: Request, response: Response) {
    try {
      const allLogs = await FindAllLogsService.findAllLogs();

      return response.status(200).json(allLogs);
    } catch (error: any) {
      return response.status(500).send({ error: error.message });
    }
  },
};

export default CarController;
