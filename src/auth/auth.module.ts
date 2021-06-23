import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt-strategy';
import { jwtConstants } from './constants';
import { TokensService } from './token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/tokens.entity';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.access.secret,
      signOptions: {
        expiresIn: jwtConstants.access.expiresIn,
      },
    }),
    UsersModule,
    TypeOrmModule.forFeature([Token]),
    PassportModule],
    providers: [AuthService, JwtStrategy,TokensService],
    exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
