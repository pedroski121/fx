import { User } from 'src/users/user.entity';
import {
  Entity,
  ManyToOne,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Currency } from '../types';

@Entity('wallets')
@Unique(['user', 'currency']) // one wallet per user per currency
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.wallets)
  user: User;

  @Column({ type: 'enum', enum: Currency, default: 'NGN' })
  currency: Currency;

  @Column({ type: 'bigint', default: 0 })
  balance: bigint;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
