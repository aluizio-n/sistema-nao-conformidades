import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity("usuario")
export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "text" })
    nome!: string;

    @Column({ type: "text", unique: true })
    email!: string;

    @Column({ type: "text" })
    senha_hash!: string;

    @Column({ type: "text", default: "inspetor" })
    perfil!: string;

    @Column({ type: "boolean", default: true })
    ativo!: boolean;

    @CreateDateColumn({ name: "created_at" })
    created_at!: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updated_at!: Date;
}
