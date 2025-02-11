import { Router } from "express";
import routesCar from "../../modules/car/routes/car.routes";

const routes = Router();

routes.use("/api", routesCar);

export default routes;
