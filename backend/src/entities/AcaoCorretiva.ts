import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { NaoConformidade } from "./NaoConformidade.js";
import { Usuario } from "./Usuario.js";

@Entity("acao_corretiva")
export class AcaoCorretiva {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => NaoConformidade, (nc) => nc.acoes, { nullable: false })
    @JoinColumn({ name: "nc_id" })
    naoConformidade!: NaoConformidade;

    @Column({ name: "nc_id", type: "int" })
    nc_id!: number;

    @Column({ type: "text" })
    descricao!: string;

    @ManyToOne(() => Usuario, { nullable: false })
    @JoinColumn({ name: "responsavel_id" })
    responsavel!: Usuario;

    @Column({ name: "responsavel_id", type: "int" })
    responsavel_id!: number;

    @Column({ type: "timestamptz" })
    prazo_em!: Date;

    @Column({ type: "text", default: "pendente" })
    status!: string;

    @Column({ type: "timestamptz", nullable: true })
    conclusao_em!: Date | null;

    @Column({ type: "text", nullable: true })
    evidencia!: string | null;
}
