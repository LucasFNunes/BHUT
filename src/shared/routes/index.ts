import { Router } from "express";
import routesUrlShortener from "../../modules/urlshortener/routes/car.routes";

const routes = Router();

routes.use("/api", routesUrlShortener);

export default routes;
