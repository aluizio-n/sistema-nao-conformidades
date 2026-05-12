import "reflect-metadata";
import "dotenv/config";
import bcrypt from "bcryptjs";
import { appDataSource } from "./appDataSource.js";
import { Usuario } from "../entities/Usuario.js";
import { NaoConformidade } from "../entities/NaoConformidade.js";
import { AcaoCorretiva } from "../entities/AcaoCorretiva.js";

async function seed() {
    await appDataSource.initialize();
    console.log("Conectado ao banco. Iniciando seed...");

    const usuarioRepo = appDataSource.getRepository(Usuario);
    const ncRepo = appDataSource.getRepository(NaoConformidade);
    const acaoRepo = appDataSource.getRepository(AcaoCorretiva);

    await acaoRepo.query("DELETE FROM acao_corretiva");
    await ncRepo.query("DELETE FROM nao_conformidade");
    await usuarioRepo.query("DELETE FROM usuario");

    const senhaHash = await bcrypt.hash("123456", 10);

    const usuarios = await usuarioRepo.save([
        { nome: "Carlos Silva", email: "carlos@qualidade.com", senha_hash: senhaHash, perfil: "inspetor" },
        { nome: "Ana Gestora", email: "ana@qualidade.com", senha_hash: senhaHash, perfil: "gestor" },
        { nome: "Pedro Operador", email: "pedro@qualidade.com", senha_hash: senhaHash, perfil: "responsavel" },
        { nome: "Maria Inspetora", email: "maria@qualidade.com", senha_hash: senhaHash, perfil: "inspetor" },
    ]);

    const [carlos, ana, pedro, maria] = usuarios;

    const agora = new Date();
    const umaSemanaAtras = new Date(agora.getTime() - 7 * 24 * 60 * 60 * 1000);
    const duasSemanas = new Date(agora.getTime() - 14 * 24 * 60 * 60 * 1000);
    const prazoFuturo = new Date(agora.getTime() + 7 * 24 * 60 * 60 * 1000);
    const prazoVencido = new Date(agora.getTime() - 3 * 24 * 60 * 60 * 1000);

    const ncs = await ncRepo.save([
        {
            numero: `NC-${agora.getFullYear()}-0001`,
            titulo: "Peça fora de tolerância dimensional",
            descricao: "Lote 4521 apresentou peças com diâmetro 2mm acima do especificado na linha de montagem A3.",
            tipo: "produto",
            gravidade: "alta",
            status: "aberta",
            linha_processo: "Linha A3",
            setor: "Montagem",
            aberto_por: carlos!.id,
            abertura_em: umaSemanaAtras,
        },
        {
            numero: `NC-${agora.getFullYear()}-0002`,
            titulo: "Procedimento de limpeza não seguido",
            descricao: "Operador não realizou limpeza da esteira conforme POP-012 antes do início do turno.",
            tipo: "processo",
            gravidade: "media",
            status: "em_tratamento",
            linha_processo: "Linha B1",
            setor: "Produção",
            aberto_por: maria!.id,
            responsavel_id: pedro!.id,
            abertura_em: duasSemanas,
            prazo_em: prazoVencido,
        },
        {
            numero: `NC-${agora.getFullYear()}-0003`,
            titulo: "Material recebido com laudo vencido",
            descricao: "Fornecedor enviou resina epóxi com certificado de qualidade vencido há 30 dias.",
            tipo: "material",
            gravidade: "critica",
            status: "aguardando_verificacao",
            linha_processo: "Recebimento",
            setor: "Almoxarifado",
            aberto_por: carlos!.id,
            responsavel_id: ana!.id,
            abertura_em: duasSemanas,
            prazo_em: prazoFuturo,
            causa_raiz: "Falha no controle de validade de laudos pelo fornecedor. Ausência de verificação na entrada.",
        },
        {
            numero: `NC-${agora.getFullYear()}-0004`,
            titulo: "EPI sem certificado de aprovação",
            descricao: "Luvas de proteção química em uso sem CA válido. Detectado em auditoria interna.",
            tipo: "seguranca",
            gravidade: "critica",
            status: "em_tratamento",
            linha_processo: "Linha C2",
            setor: "Segurança",
            aberto_por: maria!.id,
            responsavel_id: pedro!.id,
            abertura_em: umaSemanaAtras,
            prazo_em: prazoFuturo,
        },
        {
            numero: `NC-${agora.getFullYear()}-0005`,
            titulo: "Temperatura do forno fora da faixa",
            descricao: "Forno de cura registrou 185°C quando o parâmetro exige 200°C ±5°C durante 2 horas.",
            tipo: "processo",
            gravidade: "alta",
            status: "encerrada",
            linha_processo: "Linha A1",
            setor: "Cura",
            aberto_por: carlos!.id,
            responsavel_id: pedro!.id,
            abertura_em: duasSemanas,
            prazo_em: umaSemanaAtras,
            encerramento_em: new Date(agora.getTime() - 2 * 24 * 60 * 60 * 1000),
            causa_raiz: "Sensor de temperatura descalibrado. Calibração atrasada em 15 dias.",
        },
        {
            numero: `NC-${agora.getFullYear()}-0006`,
            titulo: "Embalagem danificada no estoque",
            descricao: "20 unidades de produto acabado com embalagem amassada por empilhamento incorreto.",
            tipo: "produto",
            gravidade: "baixa",
            status: "aberta",
            linha_processo: "Estoque PA",
            setor: "Logística",
            aberto_por: maria!.id,
            abertura_em: agora,
        },
    ]);

    await acaoRepo.save([
        {
            nc_id: ncs[1]!.id,
            descricao: "Retreinar equipe no POP-012 de limpeza de esteiras",
            responsavel_id: pedro!.id,
            prazo_em: prazoFuturo,
            status: "em_andamento",
        },
        {
            nc_id: ncs[2]!.id,
            descricao: "Notificar fornecedor e solicitar novo laudo",
            responsavel_id: ana!.id,
            prazo_em: prazoVencido,
            status: "concluida",
            conclusao_em: umaSemanaAtras,
            evidencia: "E-mail enviado ao fornecedor em 10/04. Novo laudo recebido e validado.",
        },
        {
            nc_id: ncs[2]!.id,
            descricao: "Implementar checklist de verificação de laudos no recebimento",
            responsavel_id: ana!.id,
            prazo_em: prazoFuturo,
            status: "pendente",
        },
        {
            nc_id: ncs[3]!.id,
            descricao: "Substituir todas as luvas sem CA válido",
            responsavel_id: pedro!.id,
            prazo_em: new Date(agora.getTime() + 2 * 24 * 60 * 60 * 1000),
            status: "em_andamento",
        },
    ]);

    console.log("Seed concluído!");
    console.log(`  ${usuarios.length} usuários criados`);
    console.log(`  ${ncs.length} não conformidades criadas`);
    console.log(`  4 ações corretivas criadas`);
    console.log("\nCredenciais de acesso:");
    console.log("  Email: carlos@qualidade.com | Senha: 123456 (inspetor)");
    console.log("  Email: ana@qualidade.com    | Senha: 123456 (gestor)");
    console.log("  Email: pedro@qualidade.com  | Senha: 123456 (responsavel)");

    await appDataSource.destroy();
}

seed().catch(console.error);
