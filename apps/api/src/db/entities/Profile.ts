import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn()
  profile_id!: number;

  @OneToOne(() => User, user => user.user_id, { onDelete: 'CASCADE' })
  @JoinColumn()
  user!: User;

  @Column({ type: 'varchar', length: 50, unique: true })
  username!: string;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  last_updated!: Date;
}
