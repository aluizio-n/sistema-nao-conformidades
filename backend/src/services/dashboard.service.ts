import { appDataSource } from "../database/appDataSource.js";

export async function obterDashboard() {
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
    const fimMes = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [indicadores] = await appDataSource.query(`
        SELECT
            COUNT(*) FILTER (WHERE status = 'aberta') AS total_abertas,
            COUNT(*) FILTER (WHERE gravidade IN ('critica', 'alta') AND status NOT IN ('encerrada', 'cancelada')) AS criticas_abertas,
            COUNT(*) FILTER (WHERE prazo_em IS NOT NULL AND prazo_em < NOW() AND encerramento_em IS NULL AND status NOT IN ('encerrada', 'cancelada')) AS prazo_vencido,
            COUNT(*) FILTER (WHERE status = 'encerrada' AND encerramento_em >= $1 AND encerramento_em <= $2) AS encerradas_mes
        FROM nao_conformidade
    `, [inicioMes, fimMes]);

    const recentes = await appDataSource.query(`
        SELECT nc.id, nc.numero, nc.titulo, nc.status, nc.gravidade, nc.tipo, nc.abertura_em, nc.prazo_em, nc.encerramento_em,
               u.nome as aberto_por_nome
        FROM nao_conformidade nc
        LEFT JOIN usuario u ON nc.aberto_por = u.id
        ORDER BY nc.abertura_em DESC
        LIMIT 10
    `);

    const ranking_tipos = await appDataSource.query(`
        SELECT tipo, COUNT(*) as total
        FROM nao_conformidade
        WHERE abertura_em >= $1 AND abertura_em <= $2
        GROUP BY tipo
        ORDER BY total DESC
        LIMIT 3
    `, [inicioMes, fimMes]);

    return {
        indicadores: {
            total_abertas: Number(indicadores.total_abertas),
            criticas_abertas: Number(indicadores.criticas_abertas),
            prazo_vencido: Number(indicadores.prazo_vencido),
            encerradas_mes: Number(indicadores.encerradas_mes),
        },
        recentes,
        ranking_tipos,
    };
}
