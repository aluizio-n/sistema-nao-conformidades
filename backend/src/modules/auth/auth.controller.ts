import type { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { appDataSource } from '../../database/appDataSource.js';
import { User } from '../../entities/User.js';
import { AppError } from '../../errors/AppError.js';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password } = registerSchema.parse(req.body);

        const userRepository = appDataSource.getRepository(User);

        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            throw new AppError('E-mail já cadastrado', 409);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = userRepository.create({ name, email, password: hashedPassword });
        await userRepository.save(user);

        return res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        next(err);
    }
}

export async function me(req: Request, res: Response, next: NextFunction) {
    try {
        const userRepository = appDataSource.getRepository(User);

        const user = await userRepository.findOneBy({ id: req.userId });
        if (!user) {
            throw new AppError('Usuário não encontrado', 404);
        }

        return res.json({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = loginSchema.parse(req.body);

        const userRepository = appDataSource.getRepository(User);

        const user = await userRepository.findOneBy({ email });
        if (!user) {
            throw new AppError('Credenciais inválidas', 401);
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new AppError('Credenciais inválidas', 401);
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new AppError('Configuração de autenticação inválida', 500);
        }

        const token = jwt.sign({ sub: user.id }, secret, {
            expiresIn: (process.env.JWT_EXPIRES_IN ?? '1d') as jwt.SignOptions['expiresIn'],
        });

        return res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        next(err);
    }
}
