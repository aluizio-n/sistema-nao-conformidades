import type { Request, Response } from "express";
import { z } from "zod";
import * as acaoService from "../services/acao.service.js";

const criarAcaoSchema = z.object({
    descricao: z.string().min(1),
    responsavel_id: z.number(),
    prazo_em: z.string(),
});

const patchAcaoSchema = z.object({
    status: z.enum(["pendente", "em_andamento", "concluida"]).optional(),
    evidencia: z.string().optional(),
});

export async function listarPorNc(req: Request, res: Response) {
    const ncId = Number(req.params.ncId);
    const acoes = await acaoService.listarAcoesPorNc(ncId);
    res.json(acoes);
}

export async function criar(req: Request, res: Response) {
    const ncId = Number(req.params.ncId);
    const data = criarAcaoSchema.parse(req.body);
    const acao = await acaoService.criarAcao(ncId, data);
    res.status(201).json(acao);
}

export async function atualizar(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = patchAcaoSchema.parse(req.body);
    const acao = await acaoService.atualizarAcao(id, data);
    res.json(acao);
}
