import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as acaoController from "../controllers/acao.controller.js";

const router = Router();

router.get("/ncs/:ncId/acoes", authMiddleware, acaoController.listarPorNc);
router.post("/ncs/:ncId/acoes", authMiddleware, acaoController.criar);
router.patch("/acoes/:id", authMiddleware, acaoController.atualizar);

export default router;
