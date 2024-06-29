import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { User } from "./User";
import { Category } from "./Category";
import { Account } from "./Account";
import { Comment } from './Comment';
import { Space } from './Space';

@Entity('transactions')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  transaction_id!: number;

  @ManyToOne(() => User, user => user.transactions, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'enum', enum: ['income', 'expense', 'transfer'] })
  type!: 'income' | 'expense' | 'transfer';

  @ManyToOne(() => Category, category => category.transactions)
  category!: Category;

  @ManyToOne(() => Account, account => account.transactions)
  account!: Account;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date!: Date;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @ManyToOne(() => Space, space => space.transactions)
  space!: Space;

  @OneToMany(() => Comment, comment => comment.transaction)
  comments!: Comment;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  last_updated!: Date;
}
