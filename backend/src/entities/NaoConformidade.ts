import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from "typeorm";
import { Usuario } from "./Usuario.js";
import { AcaoCorretiva } from "./AcaoCorretiva.js";

@Entity("nao_conformidade")
export class NaoConformidade {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "text", unique: true })
    numero!: string;

    @Column({ type: "text" })
    titulo!: string;

    @Column({ type: "text" })
    descricao!: string;

    @Column({ type: "text", default: "produto" })
    tipo!: string;

    @Column({ type: "text", default: "baixa" })
    gravidade!: string;

    @Column({ type: "text", default: "aberta" })
    status!: string;

    @Column({ type: "text" })
    linha_processo!: string;

    @Column({ type: "text" })
    setor!: string;

    @ManyToOne(() => Usuario, { nullable: false })
    @JoinColumn({ name: "aberto_por" })
    abertoPor!: Usuario;

    @Column({ name: "aberto_por", type: "int" })
    aberto_por!: number;

    @ManyToOne(() => Usuario, { nullable: true })
    @JoinColumn({ name: "responsavel_id" })
    responsavel!: Usuario | null;

    @Column({ name: "responsavel_id", type: "int", nullable: true })
    responsavel_id!: number | null;

    @Column({ type: "timestamptz", default: () => "now()" })
    abertura_em!: Date;

    @Column({ type: "timestamptz", nullable: true })
    prazo_em!: Date | null;

    @Column({ type: "timestamptz", nullable: true })
    encerramento_em!: Date | null;

    @Column({ type: "text", nullable: true })
    causa_raiz!: string | null;

    @OneToMany(() => AcaoCorretiva, (acao) => acao.naoConformidade)
    acoes!: AcaoCorretiva[];
}
