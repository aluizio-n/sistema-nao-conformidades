import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";

export interface AuthPayload {
    id: number;
    nome: string;
    perfil: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthPayload;
        }
    }
}

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const header = req.headers.authorization;
    if (!header) throw new AppError("Token nao fornecido", 401);

    const [, token] = header.split(" ");
    if (!token) throw new AppError("Token mal formatado", 401);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthPayload;
        req.user = decoded;
        next();
    } catch {
        throw new AppError("Token invalido ou expirado", 401);
    }
}
