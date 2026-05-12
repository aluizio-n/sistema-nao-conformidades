import type { Request, Response } from "express";
import { z } from "zod";
import * as authService from "../services/auth.service.js";

const loginSchema = z.object({
    email: z.string().email(),
    senha: z.string().min(1),
});

export async function login(req: Request, res: Response) {
    const { email, senha } = loginSchema.parse(req.body);
    const result = await authService.login(email, senha);
    res.json(result);
}
