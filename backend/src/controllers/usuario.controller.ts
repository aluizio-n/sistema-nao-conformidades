import type { Request, Response } from "express";
import * as usuarioService from "../services/usuario.service.js";

export async function listar(_req: Request, res: Response) {
    const usuarios = await usuarioService.listarUsuariosAtivos();
    res.json(usuarios);
}
