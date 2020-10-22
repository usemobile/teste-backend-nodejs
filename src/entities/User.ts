import { Length } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

import { ApiModel, ApiModelProperty } from 'swagger-express-ts';

@Entity()
@ApiModel({
  description: 'The user of the API. can be a normal user or an admin.',
  name: 'User',
})
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiModelProperty({
    description: "the user's username",
  })
  @Column({ length: 50 })
  @Length(5, 100)
  username: string;

  @ApiModelProperty({
    description: "The user's password",
  })
  @Column({ length: 100 })
  @Length(4, 100)
  password: string;

  @ApiModelProperty({
    description: "The user's role",
  })
  @Column({ length: 50 })
  @Length(4, 50)
  role: string;

  @Column()
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt?: Date;

  @Column()
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt?: Date;

  @Column()
  @DeleteDateColumn({ type: 'timestamp with time zone' })
  deletedAt?: Date;

  constructor(username: string, password: string, role: string) {
    this.username = username;
    this.password = password;
    this.role = role;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
