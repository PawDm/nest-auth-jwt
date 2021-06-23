import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateRoleDto } from './DTOs/create-role.dto';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Post()
  create(@Body() role: CreateRoleDto) {
    return this.roleService.createRole(role);
  }

  @Get()
  getAllRoles(){
    return this.roleService.getAllRoles();
  }

  @Get('/:value')
  getByValue(@Param('value') value: string) {
    return this.roleService.getRoleByValue(value);
  }
}
