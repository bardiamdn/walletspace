import 'reflect-metadata'
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Transaction } from "./Transaction";
import { Space } from './Space';

@Entity('scans')
export class Scan {
  @PrimaryGeneratedColumn()
  scan_id!: number;

  @ManyToOne(() => User, user => user.scans, {nullable: false})
  user!: User;

  @Column({ type: 'varchar' })
  field_name!: string;

  @Column({ type: 'jsonb', nullable: true })
  document_data!: any;
 
  @Column({ type: 'varchar', nullable: false })
  original_name!: string;

  @Column({ type: 'varchar', nullable: false })
  encoding!: string;

  @Column({ type: 'varchar', nullable: false })
  mimetype!: string;

  @Column({ type: 'varchar', nullable: false })
  destination!: string;

  @Column({ type: 'varchar', nullable: false })
  file_name!: string;

  @Column({ type: 'varchar', nullable: false })
  path!: string;

  @Column({ type: 'int' })
  size!: number;
  
  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  last_updated!: Date;
}