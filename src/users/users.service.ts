import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './DTOs/createUser.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User)
  private userRepository:Repository<User>){}

  async createUser(dto: CreateUserDto):Promise<User>{
    const user = await this.userRepository.create(dto);
    return await this.userRepository.save(user)
  }

  async getByUsername(username:string):Promise<User>{

    return await this.userRepository.findOne({username})
  }

  async getAllUsers():Promise<User[]>{
    return await this.userRepository.find();
  }

}
