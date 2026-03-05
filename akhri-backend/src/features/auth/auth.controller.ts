import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Endpoint to exchange Supabase session (optional – frontend can directly use Supabase)
  // Here we simply return success if token is valid
  @Post('verify')
  async verify(@Body('access_token') token: string) {
    const user = await this.authService.verifyToken(token);
    return { user };
  }

  // Protected route example
  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }
}
