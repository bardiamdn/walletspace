import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { User } from "./User";
import { Transaction } from "./Transaction";

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  account_id!: number;

  @ManyToOne(() => User, user => user.accounts, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;

  @Column({ type: 'varchar', length: 50 })
  account_name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  balance!: number;

  @OneToMany(() => Transaction, transaction => transaction.account)
  transactions!: Transaction[];
  
  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  last_updated!: Date;
}
