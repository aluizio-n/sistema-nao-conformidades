import type { Request, Response } from "express";
import * as dashboardService from "../services/dashboard.service.js";

export async function obter(_req: Request, res: Response) {
    const dashboard = await dashboardService.obterDashboard();
    res.json(dashboard);
}
