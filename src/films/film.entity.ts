import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'


@Entity({ name: 'films' })
export class FilmEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'title', length: 100 })
    title: string;

    @Column({ name: 'year', length: 4 })
    year: string;

    @Column({ name: 'language', length: 5 })
    language: string;

    @Column({ name: 'synopse', length: 511 })
    synopse: string;

    @Column({ name: 'status', default: 'À assistir'})
    status: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;


    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;


    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;
}