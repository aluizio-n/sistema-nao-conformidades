import { appDataSource } from "../database/appDataSource.js";
import { Usuario } from "../entities/Usuario.js";

const usuarioRepo = () => appDataSource.getRepository(Usuario);

export async function listarUsuariosAtivos() {
    return usuarioRepo().find({
        where: { ativo: true },
        select: ["id", "nome", "email", "perfil"],
        order: { nome: "ASC" },
    });
}
