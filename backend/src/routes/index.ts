import { Router } from "express";
import authRoutes from "./auth.routes.js";
import usuarioRoutes from "./usuario.routes.js";
import ncRoutes from "./nc.routes.js";
import acaoRoutes from "./acao.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const routes = Router();

routes.use(authRoutes);
routes.use(usuarioRoutes);
routes.use(ncRoutes);
routes.use(acaoRoutes);
routes.use(dashboardRoutes);

export default routes;
