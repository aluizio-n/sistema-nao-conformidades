import { appDataSource } from "../database/appDataSource.js";
import { AcaoCorretiva } from "../entities/AcaoCorretiva.js";
import { NaoConformidade } from "../entities/NaoConformidade.js";
import { AppError } from "../errors/AppError.js";

const acaoRepo = () => appDataSource.getRepository(AcaoCorretiva);
const ncRepo = () => appDataSource.getRepository(NaoConformidade);

export async function listarAcoesPorNc(ncId: number) {
    return acaoRepo().find({
        where: { nc_id: ncId },
        relations: ["responsavel"],
        order: { prazo_em: "ASC" },
    });
}

export async function criarAcao(ncId: number, data: {
    descricao: string;
    responsavel_id: number;
    prazo_em: string;
}, user: { id: number; perfil: string }) {
    const nc = await ncRepo().findOneBy({ id: ncId });
    if (!nc) throw new AppError("NC nao encontrada", 404);

    if (user.perfil === "responsavel" && nc.responsavel_id !== user.id) {
        throw new AppError("Voce so pode criar acoes em NCs atribuidas a voce", 403);
    }

    const acao = acaoRepo().create({
        nc_id: ncId,
        descricao: data.descricao,
        responsavel_id: data.responsavel_id,
        prazo_em: new Date(data.prazo_em),
        status: "pendente",
    });

    await acaoRepo().save(acao);
    return acao;
}

export async function atualizarAcao(id: number, data: {
    status?: "pendente" | "em_andamento" | "concluida" | undefined;
    evidencia?: string | undefined;
}) {
    const acao = await acaoRepo().findOneBy({ id });
    if (!acao) throw new AppError("Acao nao encontrada", 404);

    if (data.status === "concluida" && !data.evidencia && !acao.evidencia) {
        throw new AppError("Evidencia e obrigatoria para concluir a acao", 400);
    }

    if (data.status) {
        acao.status = data.status;
        if (data.status === "concluida") {
            acao.conclusao_em = new Date();
        }
    }

    if (data.evidencia !== undefined) {
        acao.evidencia = data.evidencia;
    }

    await acaoRepo().save(acao);
    return acao;
}
