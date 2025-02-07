import { Router } from "express";
import { Request, Response } from "express";
import CarController from "../controllers/CarController";

const routesCar = Router();

const requestHandler = (_req: Request, res: Response) => {};

routesCar.post("/car", CarController.create as typeof requestHandler);

routesCar.get("/car", CarController.findAll as typeof requestHandler);

routesCar.get("/logs", CarController.redirectUrl as typeof requestHandler);

export default routesCar;
