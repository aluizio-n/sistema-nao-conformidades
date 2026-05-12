import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { appDataSource } from "../database/appDataSource.js";
import { Usuario } from "../entities/Usuario.js";
import { AppError } from "../errors/AppError.js";

const usuarioRepo = () => appDataSource.getRepository(Usuario);

export async function login(email: string, senha: string) {
    const usuario = await usuarioRepo().findOneBy({ email });
    if (!usuario || !usuario.ativo) {
        throw new AppError("Credenciais invalidas", 401);
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
        throw new AppError("Credenciais invalidas", 401);
    }

    const token = jwt.sign(
        { id: usuario.id, nome: usuario.nome, perfil: usuario.perfil },
        process.env.JWT_SECRET as string,
        { expiresIn: "8h" },
    );

    return {
        token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            perfil: usuario.perfil,
        },
    };
}
