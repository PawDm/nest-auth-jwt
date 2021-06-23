import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Roles {

  @ApiProperty({ example: '1', description: 'Уникальный идентификатор'})
  @PrimaryGeneratedColumn()
  id:number;

  @ApiProperty({ example: 'ADMIN', description: 'Название роли'})
  @Column({ unique: true })
  value: string;

  @ApiProperty({ example: 'Администратор', description: 'Описание роли'})
  @Column()
  description: string;

  @ManyToMany(() => User, user => user.roles)
  users: User[];

}
