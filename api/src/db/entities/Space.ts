import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn } from "typeorm";
import { User } from "./User";
import { Transaction } from "./Transaction";
import { Comment } from './Comment';

@Entity('spaces')
export class Space {
  @PrimaryGeneratedColumn()
  space_id!: number;

  @Column()
  space_name!: string;

  @ManyToOne(() => User, user => user.spaces)
  @JoinColumn()
  admin!: User;

  @ManyToMany(() => User, user => user.spaces)
  @JoinTable()
  users!: User[];

  @OneToMany(() => Comment, comment=> comment.space)
  comments!: Comment[];

  @OneToMany(() => Transaction, transaction => transaction.space)
  transactions!: Transaction[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  last_updated!: Date;
}
