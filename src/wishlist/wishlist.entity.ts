import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WishEntity } from './wish.entity';
import { UserEntity } from 'src/users/user.entity';

@Entity({ name: 'wishlists' })
export class WishlistEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => WishEntity, (wish) => wish.wishlist, { cascade: true })
  wishes: WishEntity[];

  @OneToOne(() => UserEntity)
  user: UserEntity;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: string;
}
