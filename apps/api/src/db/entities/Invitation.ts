import 'reflect-metadata'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from "./User";
import { Space } from "./Space";

@Entity('invitations')
export class Invitation {
	@PrimaryGeneratedColumn()
  invitation_id!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'inviter_id'})
  inviter!: User;

  @ManyToOne(() => User)
  @JoinColumn({name: 'invitee_id'})
  invitee!: User;

  @ManyToOne(() => Space)
  @JoinColumn({ name: 'space_id' })
  space!: Space;

  @Column({ type: 'enum', enum: ['pending', 'accepted', 'rejected'], default: 'pending' })
  status!: 'pending' | 'accepted' | 'rejected';
}