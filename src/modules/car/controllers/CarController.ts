import { Request, Response } from "express";
import JWTDecrypt from "../../../shared/middlewares/JWTDecrypt";
import FindAllCarService from "../services/FindAllCarService";
import CreateCarService from "../services/CreateCarService";
import { addCarToQueue } from "../services/QueueService";

const CarController = {
  async findAll(request: Request, response: Response) {
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
      await addCarToQueue(createdCar.id, new Date());
      return response.status(201).json(createdCar);
    } catch (error) {
      response.status(500).json({ error: "Erro ao criar carro" });
    }
  },
};

export default CarController;
