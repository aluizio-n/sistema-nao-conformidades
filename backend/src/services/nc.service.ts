import { appDataSource } from "../database/appDataSource.js";
import { NaoConformidade } from "../entities/NaoConformidade.js";
import { AppError } from "../errors/AppError.js";

const ncRepo = () => appDataSource.getRepository(NaoConformidade);

const TIPOS_VALIDOS = ["produto", "processo", "material", "seguranca", "outro"];
const GRAVIDADES_VALIDAS = ["baixa", "media", "alta", "critica"];
const STATUS_VALIDOS = ["aberta", "em_tratamento", "aguardando_verificacao", "encerrada", "cancelada"];

const TRANSICOES: Record<string, string[]> = {
    aberta: ["em_tratamento"],
    em_tratamento: ["aguardando_verificacao", "cancelada"],
    aguardando_verificacao: ["encerrada", "em_tratamento"],
    encerrada: [],
    cancelada: [],
};

export { TIPOS_VALIDOS, GRAVIDADES_VALIDAS, STATUS_VALIDOS, TRANSICOES };

async function gerarNumero(): Promise<string> {
    const ano = new Date().getFullYear();
    const ultima = await ncRepo().find({
        where: {},
        order: { id: "DESC" },
        take: 1,
    });

    const seq = ultima.length > 0 ? ultima[0]!.id + 1 : 1;
    return `NC-${ano}-${String(seq).padStart(4, "0")}`;
}

export async function listarNcs(filtros: {
    status?: string | undefined;
    gravidade?: string | undefined;
    tipo?: string | undefined;
    busca?: string | undefined;
}) {
    let queryBuilder = ncRepo()
        .createQueryBuilder("nc")
        .leftJoinAndSelect("nc.abertoPor", "abertoPor")
        .leftJoinAndSelect("nc.responsavel", "responsavel")
        .orderBy("nc.abertura_em", "DESC");

    if (filtros.status && STATUS_VALIDOS.includes(filtros.status)) {
        queryBuilder = queryBuilder.andWhere("nc.status = :status", { status: filtros.status });
    }
    if (filtros.gravidade && GRAVIDADES_VALIDAS.includes(filtros.gravidade)) {
        queryBuilder = queryBuilder.andWhere("nc.gravidade = :gravidade", { gravidade: filtros.gravidade });
    }
    if (filtros.tipo && TIPOS_VALIDOS.includes(filtros.tipo)) {
        queryBuilder = queryBuilder.andWhere("nc.tipo = :tipo", { tipo: filtros.tipo });
    }
    if (filtros.busca && filtros.busca.trim()) {
        queryBuilder = queryBuilder.andWhere(
            "(nc.numero ILIKE :busca OR nc.titulo ILIKE :busca)",
            { busca: `%${filtros.busca.trim()}%` },
        );
    }

    return queryBuilder.getMany();
}

export async function buscarNcPorId(id: number) {
    const nc = await ncRepo().findOne({
        where: { id },
        relations: ["abertoPor", "responsavel", "acoes", "acoes.responsavel"],
    });

    if (!nc) throw new AppError("NC nao encontrada", 404);
    return nc;
}

export async function criarNc(data: {
    titulo: string;
    descricao: string;
    tipo: string;
    gravidade: string;
    linha_processo: string;
    setor: string;
}, userId: number) {
    const numero = await gerarNumero();

    const nc = ncRepo().create({
        ...data,
        numero,
        aberto_por: userId,
        status: "aberta",
    });

    await ncRepo().save(nc);
    return nc;
}

export async function atualizarNc(id: number, data: {
    responsavel_id?: number | undefined;
    prazo_em?: string | undefined;
    status?: string | undefined;
    causa_raiz?: string | undefined;
}) {
    const nc = await ncRepo().findOneBy({ id });
    if (!nc) throw new AppError("NC nao encontrada", 404);

    if (data.status) {
        const permitidas = TRANSICOES[nc.status];
        if (!permitidas || !permitidas.includes(data.status)) {
            throw new AppError(
                `Transicao de '${nc.status}' para '${data.status}' nao permitida`,
                400,
            );
        }
    }

    if (data.responsavel_id && nc.status === "aberta") {
        nc.responsavel_id = data.responsavel_id;
        nc.status = "em_tratamento";
    } else if (data.responsavel_id) {
        nc.responsavel_id = data.responsavel_id;
    }

    if (data.prazo_em) {
        nc.prazo_em = new Date(data.prazo_em);
    }

    if (data.status) {
        nc.status = data.status;
        if (data.status === "encerrada") {
            nc.encerramento_em = new Date();
        }
    }

    if (data.causa_raiz !== undefined) {
        nc.causa_raiz = data.causa_raiz;
    }

    await ncRepo().save(nc);

    return ncRepo().findOne({
        where: { id },
        relations: ["abertoPor", "responsavel", "acoes", "acoes.responsavel"],
    });
}

export async function listarMinhaFila(userId: number) {
    return ncRepo()
        .createQueryBuilder("nc")
        .leftJoinAndSelect("nc.abertoPor", "abertoPor")
        .where("nc.responsavel_id = :userId", { userId })
        .andWhere("nc.status NOT IN (:...finais)", { finais: ["encerrada", "cancelada"] })
        .orderBy(
            `CASE WHEN nc.prazo_em IS NOT NULL AND nc.prazo_em < NOW() THEN 0 ELSE 1 END`,
            "ASC",
        )
        .addOrderBy("nc.prazo_em", "ASC", "NULLS LAST")
        .getMany();
}
