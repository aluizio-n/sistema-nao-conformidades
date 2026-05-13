import { Router } from "express";
import { authMiddleware, requirePerfil } from "../middlewares/authMiddleware.js";
import * as usuarioController from "../controllers/usuario.controller.js";

const router = Router();

router.get("/usuarios", authMiddleware, requirePerfil("gestor"), usuarioController.listar);

export default router;
