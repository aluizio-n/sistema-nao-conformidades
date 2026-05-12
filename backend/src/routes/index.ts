import { Router } from "express";
<<<<<<< HEAD
import authRoutes from "../modules/auth/auth.routes.js";

const routes = Router();

routes.use('/auth', authRoutes);

export default routes;
=======
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
>>>>>>> 9782cdc (feat: front e back)
