import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AddRoleDto } from 'src/roles/DTOs/add-role.dto';
import { RolesService } from 'src/roles/roles.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './DTOs/createUser.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {

  constructor(@InjectRepository(User)
  private userRepository:Repository<User>,
  private roleService: RolesService){}

  async createUser(dto: CreateUserDto):Promise<User>{
    const newUser = await this.userRepository.create(dto);
    const role = await this.roleService.getRole('ADMIN')
    newUser.roles=[role]
    const user = await this.userRepository.save(newUser)
    return user;
  }

  async getByUsername(username:string):Promise<User>{
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ username: username })
      .leftJoinAndSelect('user.roles', 'roles')
      .getOne();
    return user;
  }

  async getByUserId(userId:number):Promise<User>{
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ id: userId })
      .leftJoinAndSelect('user.roles', 'roles')
      .getOne();
    return user;
  }

  async getAllUsers():Promise<User[]>{
    return await this.userRepository.find();
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ id: dto.userId })
      .leftJoinAndSelect('user.roles', 'roles')
      .getOne();
      const role = await this.roleService.getRoleByValue(dto.value);

      if (role && user) {
        user.roles.push(role);
        await this.userRepository.save(user);
        return dto;
      }
      throw new HttpException('User or Role not found', HttpStatus.NOT_FOUND);
  }

  async setResetCode(resetCode: string, user: User){
    user.resetPasswordCode = resetCode;
    return await this.userRepository.save(user)
  }

  async setNewPassword(newPassword: string, user: User){
    user.password = newPassword;
    return await this.userRepository.save(user)
  }

}
