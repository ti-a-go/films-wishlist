import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'


@Entity({ name: 'logs' })
export class LogEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'method', length: 10 })
    method: string;

    @Column({ name: 'status' })
    status: number;

    @Column({ name: 'url', length: 100 })
    url: string;

    @Column({ name: 'timestamp', length: 20 })
    timestamp: string;

    @Column({ name: 'film_ids', length: 255, nullable: true })
    filmIds: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;
}