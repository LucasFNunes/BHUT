import { Request, Response } from "express";
import FindAllCarService from "../services/FindAllCarService";
import CreateCarService from "../services/CreateCarService";

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
      return response.status(201).json(createdCar);
    } catch (error) {
      response.status(500).json({ error: "Erro ao criar carro" });
    }
  },
};

export default CarController;
