import { Router } from "express";
import { authMiddleware, requirePerfil } from "../middlewares/authMiddleware.js";
import * as ncController from "../controllers/nc.controller.js";

const router = Router();

router.get("/ncs", authMiddleware, ncController.listar);
router.get("/ncs/:id", authMiddleware, ncController.buscarPorId);
router.post("/ncs", authMiddleware, requirePerfil("inspetor", "gestor"), ncController.criar);
router.patch("/ncs/:id", authMiddleware, requirePerfil("gestor"), ncController.atualizar);
router.get("/minha-fila", authMiddleware, requirePerfil("gestor", "responsavel"), ncController.minhaFila);

export default router;
