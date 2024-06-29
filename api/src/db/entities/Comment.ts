import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Transaction } from "./Transaction";
import { Space } from './Space';

@Entity('comments')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  comment_id!: number;

  @ManyToOne(() => User, user => user.commets)
  user!: User

  @ManyToOne(() => Space, space => space.comments)
  space!: Space

  @Column({ type: 'text' })
  content!: string;

  @OneToMany(() => Comment, comment => comment.parentComment)
  replies!: Comment[];

  @ManyToOne(() => Comment, comment => comment.replies)
  parentComment!: Comment;

  @ManyToOne(() => Transaction, transaction => transaction.comments)
  transaction!: Transaction;
  
  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  last_updated!: Date;
}