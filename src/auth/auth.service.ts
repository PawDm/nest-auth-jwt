import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/DTOs/createUser.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { TokensService } from './token.service';
import { ResetPassDto } from 'src/users/DTOs/reset-pass.dto';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private tokenService: TokensService
    ) {}

  async validateUser(userDto: CreateUserDto): Promise<any> {
    const user = await this.usersService.getByUsername(userDto.username);

    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Некорректный username или password',
    });
  }

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto)

    const payload = { username: user.username, userId: user.id, roles: user.roles };

      const tokens = this.tokenService.generateTokens(payload)
      const result = await this.tokenService.saveToken(payload.userId, tokens.refreshToken);
      return{
        ...tokens,
        user: payload
      }
  }

  async registration(userDto: CreateUserDto) {
      const candidate = await this.usersService.getByUsername(userDto.username);
      if (candidate) {
        throw new HttpException(
          'Пользователь с таким email уже существует',
          HttpStatus.BAD_REQUEST,
        );
      }
      const hashPassword = await bcrypt.hash(userDto.password, 5);
      const user = await this.usersService.createUser({
        ...userDto,
        password: hashPassword,
      });

      const payload = { username: user.username, userId: user.id, roles: user.roles };

      const tokens = this.tokenService.generateTokens(payload)
      const result = await this.tokenService.saveToken(payload.userId, tokens.refreshToken);
      return{
        ...tokens,
        user: payload
      }
  }

  async logout(refreshToken: string) {
    const token = await this.tokenService.removeToken(refreshToken);
    return token;

  }

  async refresh(refreshToken: string) {
    if(!refreshToken){
      throw new UnauthorizedException({
        message: 'Некорректный токен',
      });
    }
    const userData = await this.tokenService.validateRefreshToken(refreshToken)

    const tokenFromDb = await this.tokenService.findToken(refreshToken)
    if(!userData || !tokenFromDb){
      throw new UnauthorizedException({
        message: 'Некорректный токен',
      });
    }

    const user = await this.usersService.getByUsername(userData.username);

    const payload = { username: user.username, userId: user.id };

      const tokens = this.tokenService.generateTokens(payload)
      const result = await this.tokenService.saveToken(payload.userId, tokens.refreshToken);
      return{
        ...tokens,
        user: payload
      }
  }


  async generateKeyForPassword(username: string) {
   const user = await this.usersService.getByUsername(username)
   if (!user) {
    throw new HttpException(
      `Пользователя ${username} не существует`,
      HttpStatus.NOT_FOUND,
    );
   }
   const secretCode = this.generateRandomDigits(5)
    await this.usersService.setResetCode(secretCode,user)

   // этот код будем записывать в поле новый столбец у юзера и выдавать юзеру по почте. если все совпало когда он сделает следующий запрос то все ОК и заводим ему новый пассворд
   return secretCode;
  }

  async resetPassword(dto: ResetPassDto) {
    const user = await this.usersService.getByUsername(dto.username)
   if (!user) {
    throw new HttpException(
      `Пользователя ${dto.username} не существует`,
      HttpStatus.NOT_FOUND,
    );
   }
   if(user.resetPasswordCode === dto.resetCode){

      const newHashedPass = await bcrypt.hash(dto.newPassword, 5)
      await this.usersService.setNewPassword(newHashedPass,user)
      return "success"

   }
   else{
    throw new HttpException(
      `Неверно введен секретный код`,
      HttpStatus.NOT_FOUND,
    );
   }


  }


  private generateRandomDigits(length: number): string {
    return Array.from({ length }, () =>
      Math.floor(Math.random() * 10).toString(),
    ).join('');
  }

}
