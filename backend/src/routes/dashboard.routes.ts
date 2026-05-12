import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import * as dashboardController from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/dashboard", authMiddleware, dashboardController.obter);

export default router;
