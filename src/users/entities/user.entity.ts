/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Roles } from 'src/roles/entities/roles.entity';
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

  @ApiProperty({ example: '123456', description: 'Код восстановления паролья'})
  @Column({nullable:true})
  resetPasswordCode: string;


  @ApiProperty({ example: 'false', description: 'Забанен пользователь или нет'})
  @Column({default:false})
  banned: boolean;

  @ApiProperty({ example: 'За хулиганство', description: 'Причина бана'})
  @Column({nullable: true})
  banReason: string;

  @CreateDateColumn()
   created_at: Date;

   @UpdateDateColumn()
   updated_at: Date;

   @ManyToMany(()=>Roles, role=>role.users)
   @JoinTable()
   roles: Roles[]

}
