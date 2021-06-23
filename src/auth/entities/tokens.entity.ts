/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Token {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '1', description: 'АйдиЮзера'})
  @Column()
  userId: number;

  @ApiProperty({ example: '123456', description: 'Токен'})
  @Column()
  refreshToken: string;

}
