import { Controller, Post, UseGuards, Body,Res, Get, Request, Req} from '@nestjs/common';
import { CreateUserDto } from 'src/users/DTOs/createUser.dto';
import { ForgotPassDto } from 'src/users/DTOs/forgot-pass.dto';
import { ResetPassDto } from 'src/users/DTOs/reset-pass.dto';
import { UserAuthenticated } from 'src/users/user-authed.decorator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/registration')
  async registration(@Body() userDto: CreateUserDto,
  @Res({ passthrough: true }) response
    ) {
      const userDate = await this.authService.registration(userDto);
      response.cookie('refreshToken', userDate.refreshToken, {
        // domain: null,
        maxAge: 30*24*60**60*1000,
        httpOnly: true,
        secure: true,
      });
      return userDate;
  }


  @Post('/login')
  async login(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) response
    ) {
      const userDate = await this.authService.login(userDto);
      response.cookie('refreshToken', userDate.refreshToken, {
        maxAge: 30*24*60**60*1000, // тут подумай над временем жизни, потом может всплыть косяк
        httpOnly: true,
        secure: true,
      });
      return userDate;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(
    @Req()
    request: {
    cookies: {
      refreshToken: string;
    };
  },
  @Res({ passthrough: true }) response,
  // @Body() body
  ){

    const result = await this.authService.logout(request.cookies.refreshToken)
    // const result = await this.authService.logout(body.refreshToken) Это я так... проверяю
    response.cookie('refreshToken', '')
    return result;
    // пока логаут не делаем, так как из за параметра в куках secure мы не можем парсить , соответсвенно токен мы удалить из базы не сможем, а поэтому нужно придумать другую логику удаления токенов из базы
  }
  @UseGuards(JwtAuthGuard)
  @Get('/refresh')
  async refresh(
    @Req()
    request: {
    cookies: {
      refreshToken: string;
    };
  },
    @Res({ passthrough: true }) response
  ){

    const userDate = await this.authService.refresh(request.cookies.refreshToken);
      response.cookie('refreshToken', userDate.refreshToken, {
        maxAge: 30*24*60**60*1000, // тут подумай над временем жизни, потом может всплыть косяк
        httpOnly: true,
        secure: true,
      });
      return userDate;
  }


  @Post('forgot-pass')
  async forgotPassword(
    @Body() dto : ForgotPassDto
  ){
    const keyForNewPassword = await this.authService.generateKeyForPassword(dto.username);
    return keyForNewPassword;
  }

  @Post('confrim-reset-pass')
  async resetPassword(
    @Body() dto : ResetPassDto
  ){
    const result = await this.authService.resetPassword(dto);
    return result ;
  }
}
