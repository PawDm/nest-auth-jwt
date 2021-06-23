import { forwardRef, Module } from '@nestjs/common';
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
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: jwtConstants.access.secret,
      signOptions: {
        expiresIn: jwtConstants.access.expiresIn,
      },
    }),
    TypeOrmModule.forFeature([Token]),
    PassportModule],
    providers: [AuthService, JwtStrategy,TokensService],
    exports: [AuthService,JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
