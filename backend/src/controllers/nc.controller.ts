import type { Request, Response } from "express";
import { z } from "zod";
import * as ncService from "../services/nc.service.js";

const { TIPOS_VALIDOS, GRAVIDADES_VALIDAS, STATUS_VALIDOS } = ncService;

const criarNcSchema = z.object({
    titulo: z.string().min(1),
    descricao: z.string().min(1),
    tipo: z.enum(TIPOS_VALIDOS as [string, ...string[]]),
    gravidade: z.enum(GRAVIDADES_VALIDAS as [string, ...string[]]),
    linha_processo: z.string().min(1),
    setor: z.string().min(1),
});

const patchNcSchema = z.object({
    responsavel_id: z.number().optional(),
    prazo_em: z.string().optional(),
    status: z.enum(STATUS_VALIDOS as [string, ...string[]]).optional(),
    causa_raiz: z.string().optional(),
}).refine(data => Object.keys(data).length > 0, "Nenhum campo para atualizar");

export async function listar(req: Request, res: Response) {
    const { status, gravidade, tipo, busca } = req.query;
    const ncs = await ncService.listarNcs({
        status: status as string | undefined,
        gravidade: gravidade as string | undefined,
        tipo: tipo as string | undefined,
        busca: busca as string | undefined,
    });
    res.json(ncs);
}

export async function buscarPorId(req: Request, res: Response) {
    const id = Number(req.params.id);
    const nc = await ncService.buscarNcPorId(id);
    res.json(nc);
}

export async function criar(req: Request, res: Response) {
    const data = criarNcSchema.parse(req.body);
    const nc = await ncService.criarNc(data, req.user!.id);
    res.status(201).json(nc);
}

export async function atualizar(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data = patchNcSchema.parse(req.body);
    const nc = await ncService.atualizarNc(id, data);
    res.json(nc);
}

export async function minhaFila(req: Request, res: Response) {
    const ncs = await ncService.listarMinhaFila(req.user!.id);
    res.json(ncs);
}
