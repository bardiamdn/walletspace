import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany, JoinColumn, ManyToMany } from "typeorm";
import { Account } from './Account';
import { Category } from './Category';
import { Profile } from './Profile';
import { Transaction } from './Transaction';
import { Space } from './Space';
import { Comment } from './Comment';
import { Scan } from './Scan';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash!: string;

  @Column({ type: 'varchar', length: 100 })
  password_salt!: string;

  @Column({ type: 'boolean' })
  email_confirmed!: boolean;

  @OneToMany(() => Category, category => category.user)
  categories!: Category[];

  @OneToMany(() => Account, account => account.user)
  accounts!: Account[];
  
  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions!: Transaction[];
  
  @ManyToMany(() => Space, space => space.users)
  spaces!: Space[];
  
  @OneToMany(() => Comment, comment => comment.user)
  commets!: Comment[];
  
  @OneToMany(() => Scan, scan => scan.user)
  scans!: Scan[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  last_updated!: Date;
}
