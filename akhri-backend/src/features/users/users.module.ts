import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Country } from './entities/country.entity';
import { RoleController } from './controllers/role.controller';
import { CountryController } from './controllers/country.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, Role, Country])],
  controllers: [UsersController, RoleController,CountryController],
  providers: [UsersService],
})
export class UsersModule {}
