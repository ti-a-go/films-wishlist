import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { WishlistEntity } from './wishlist.entity';
import { FilmEntity } from '../films/film.entity';


export enum Status {
    TO_WATCH = 'A assistir',
    WATCHED = 'Assistido',
    RATED = 'Avaliado',
    RECOMMANDED = 'Recomendado'
}

@Entity({ name: 'wishes' })
export class WishEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ 
        type: 'enum',
        enum: Status,
        default: Status.TO_WATCH
    })
    status: Status;

    @Column({ name: 'recommanded', nullable: true })
    recommanded: boolean | null;

    @ManyToOne(() => WishlistEntity, (wishlist) => wishlist.wishes)
    wishlist: WishlistEntity

    @ManyToOne(() => FilmEntity, (film) => film.wishes)
    film: FilmEntity

    @CreateDateColumn({ name: 'created_at' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: string;
}