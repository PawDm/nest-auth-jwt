import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/tokens.entity';
import { jwtConstants } from './constants';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class TokensService {

  constructor(
    private jwtService: JwtService,
    @InjectRepository(Token)
  private tokenRepository:Repository<Token>
    ) {}

  generateTokens(payload){
    const accessToken = this.jwtService.sign(payload, {
      secret: jwtConstants.access.secret,
      expiresIn: jwtConstants.access.expiresIn
    })
    const refreshToken = this.jwtService.sign(payload, {
      secret: jwtConstants.refresh.secret,
      expiresIn: jwtConstants.refresh.expiresIn
    })
    return{
      accessToken,
      refreshToken,
    }
  }

  async saveToken(userId, refreshToken){
    const tokenData = await this.tokenRepository.findOne({userId})
    if(tokenData){
      tokenData.refreshToken = refreshToken;
      return await this.tokenRepository.save(tokenData)
    }
    const token = await this.tokenRepository.create({userId: userId, refreshToken: refreshToken})
    await this.tokenRepository.save(token)
    return token;
  }

  async removeToken(refreshToken: string) {
    if(refreshToken){
    const tokenData = await this.tokenRepository.delete({refreshToken});
    if(!tokenData){
      throw new HttpException(
        'Такого токена нет в базе',
        HttpStatus.BAD_REQUEST,
      );
    }
    return tokenData;
  }
  throw new HttpException(
    'Пустой токен',
    HttpStatus.BAD_REQUEST,
  );

  }

  async validateAccessToken(token){
    try{
    const userData = this.jwtService.verify(token, {secret : jwtConstants.access.secret} )

    return userData;
    }catch(e){
      return null;
    }
  }
  async validateRefreshToken(token){
    try{
      const userData = this.jwtService.verify(token, {secret : jwtConstants.refresh.secret} )

      return userData;
      }catch(e){
        if (e instanceof TokenExpiredError) {
          throw new UnauthorizedException('Срок действия токена истёк');}
        return null;
      }
  }

  async findToken(refreshToken: string) {
    if(refreshToken){
    const tokenData = await this.tokenRepository.findOne({refreshToken});
    if(!tokenData){
      throw new HttpException(
        'Такого токена нет в базе',
        HttpStatus.BAD_REQUEST,
      );
    }
    return tokenData;
  }
  throw new HttpException(
    'Пустой токен',
    HttpStatus.BAD_REQUEST,
  );

  }




}
