import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  readonly value: string;
  readonly description: string;
}
