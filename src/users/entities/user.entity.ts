/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'pawdim', description: 'никнейм'})
  @Column({unique: true})
  username: string;

  @ApiProperty({ example: '123456', description: 'Пароль'})
  @Column()
  password: string;

}
