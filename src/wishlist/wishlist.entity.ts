import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WishEntity } from './wish.entity';

@Entity({ name: 'wishlists' })
export class WishlistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => WishEntity, (wish) => wish.wishlist, { cascade: true })
  wishes: WishEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
