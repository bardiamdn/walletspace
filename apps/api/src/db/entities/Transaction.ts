import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Category } from "./Category";
import { Account } from "./Account";
import { Comment } from './Comment';
import { Space } from './Space';
import { Scan } from './Scan';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  transaction_id!: number;

  @ManyToOne(() => User, user => user.transactions, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  // { type: 'enum', enum: ['income', 'expense', 'transfer'] }
  @Column({ type: 'enum', enum: ['income', 'expense', 'transfer'] }) // type is not recognized on test database
  type!: 'income' | 'expense' | 'transfer';

  @ManyToOne(() => Category, category => category.transactions)
  category!: Category;

  @ManyToOne(() => Account, account => account.transactions)
  account!: Account;

  // { type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) // type is not recognized on test database
  date!: Date;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @ManyToOne(() => Space, space => space.transactions)
  space!: Space;

  @OneToMany(() => Comment, comment => comment.transaction)
  comments!: Comment;

  @OneToOne(() => Scan, scan => scan.scan_id)
  @JoinColumn()
  scan!: Scan

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  last_updated!: Date;
}
