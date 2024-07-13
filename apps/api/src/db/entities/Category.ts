import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Transaction } from "./Transaction";

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  category_id!: number;

  @ManyToOne(() => User, user => user.categories, { onDelete: 'CASCADE' })
  user!: User;

  @Column({ type: 'varchar', length: 50 })
  category_name!: string;

  @Column({ type: 'varchar', length: 50 })
  category_type!: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  category_color!: string;
  
  @OneToMany(() => Transaction, transaction => transaction.category)
  transactions!: Transaction[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  last_updated!: Date;
}
