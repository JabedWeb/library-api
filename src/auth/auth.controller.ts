import { Body, Controller, Post, UseGuards, Get, Req } from '@nestjs/common';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Register user',
  })
  register(
    @Body()
    registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'Login user',
  })
  login(
    @Body()
    loginDto: LoginDto,
  ) {
    return this.authService.login(loginDto);
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req: any) {
    return req.user;
  }
}
