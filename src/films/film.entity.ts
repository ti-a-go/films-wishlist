import { WishEntity } from '../wishlist/wish.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @OneToMany(() => WishEntity, (wish) => wish.wishlist)
  wishes: WishEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
