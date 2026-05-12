import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as usuarioController from "../controllers/usuario.controller.js";

const router = Router();

router.get("/usuarios", authMiddleware, usuarioController.listar);

export default router;
