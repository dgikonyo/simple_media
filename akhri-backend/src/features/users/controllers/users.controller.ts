import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { UsersService } from '../users.service';
import { RegisterUserDto } from '../dto/registerUser.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { UserEntity } from '../entities/user.entity';
import { CompleteProfileDto } from '../dto/completeProfile.dto';
// import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('me')
  async getCurrentUser(@Req() req) {
    const { id, email, user_metadata } = req.user;
    const fullName = user_metadata?.full_name || '';
    const firstName = fullName.split(' ')[0] || '';
    const lastName = fullName.split(' ').slice(1).join(' ') || '';

    const user = await this.usersService.getUserByEmail(email, { id, firstName, lastName });
    if (!user.dob) {
      return false;
    }

    const dob = new Date(user.dob);
    const isPlaceholder = dob.toISOString().startsWith('1900-01-01');
    const profileCompleted = !isPlaceholder && !!user.role;

    return { ...user, profileCompleted };
  }

  @Post('register')
  async register(@Req() req, @Body() registerDto: RegisterUserDto) {
    const userId = req.user.id;
    console.log('user ID during registration', userId)
    return this.usersService.create(userId, registerDto);
  }

  @Post('/find-by-email')
  findByEmail(@Request() request) {
    return this.usersService.getUserByEmail(request.email);
  }

  @Post('complete-profile')
  async completeProfile(@Req() req, @Body() dto: RegisterUserDto) {
    const email = req.user.email;
    const user = await this.usersService.getUserByEmail(email);
    const userId = req.user.id;
    return this.usersService.completeProfile(userId, dto);
  }
}
