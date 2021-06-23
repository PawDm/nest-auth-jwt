import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './DTOs/create-role.dto';
import { Roles } from './entities/roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
  ) {}

  async createRole(dto: CreateRoleDto) {
    const role = await this.rolesRepository.create(dto);
    await this.rolesRepository.save(role);
    return role;
  }

  async getRoleByValue(value: string) {
    const role = await this.rolesRepository
      .createQueryBuilder('roles')
      .where({ value: value })
      .leftJoinAndSelect('roles.users', 'user')
      .getOne();

      // Хочу тут спред, чтоб хэшпароли не показывал
      // const {users , ...result} = role;
    return role;
  }

  async getRole(value: string) {
    const role = await this.rolesRepository.findOne({ value: value });
    return role;
  }

  // async getRolesByUserId(userId: number) {
  //   const roles = await this.
  //   return role;
  // }

  async getAllRoles() {
    const roles = await this.rolesRepository.find();
    return roles;
  }
}
