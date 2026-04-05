import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError.js';

interface JwtPayload {
    sub: string;
}

export function ensureAuthenticated(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        throw new AppError('Token não fornecido', 401);
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new AppError('Configuração de autenticação inválida', 500);
    }

    try {
        const payload = jwt.verify(token, secret) as JwtPayload;
        req.userId = payload.sub;
        next();
    } catch {
        throw new AppError('Token inválido ou expirado', 401);
    }
}
