import { In } from "typeorm";
import { appDataSource } from "../database/appDataSource.js";
import { Usuario } from "../entities/Usuario.js";

const usuarioRepo = () => appDataSource.getRepository(Usuario);

export const PERFIS_RESPONSAVEIS = ["gestor", "responsavel"];

export async function listarUsuariosAtivos() {
    return usuarioRepo().find({
        where: { ativo: true, perfil: In(PERFIS_RESPONSAVEIS) },
        select: ["id", "nome", "email", "perfil"],
        order: { nome: "ASC" },
    });
}
