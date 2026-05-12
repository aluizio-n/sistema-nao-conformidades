import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as ncController from "../controllers/nc.controller.js";

const router = Router();

router.get("/ncs", authMiddleware, ncController.listar);
router.get("/ncs/:id", authMiddleware, ncController.buscarPorId);
router.post("/ncs", authMiddleware, ncController.criar);
router.patch("/ncs/:id", authMiddleware, ncController.atualizar);
router.get("/minha-fila", authMiddleware, ncController.minhaFila);

export default router;
