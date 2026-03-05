import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { RegisterUserDto } from './dto/registerUser.dto';
import { Role } from './entities/role.entity';
import { Country } from './entities/country.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) { }

  async findOne(id: string): Promise<UserEntity> {
    let user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(id: string, registerDto: RegisterUserDto): Promise<UserEntity> {
    this.logger.log(`User ID:${id}`)
    const startTime = Date.now();
    this.logger.log(
      `User registration started: email="${registerDto.email}", id="${id}"`
    );

    try {
      // Check if user exists
      this.logger.debug(`Checking existing user for email="${registerDto.email}"`);

      const existing = await this.usersRepository.findOne({
        where: { email: registerDto.email },
        relations: ['role', 'country'],
      });
      if (existing) {
        this.logger.warn(
          `Registration blocked: user already exists (email="${registerDto.email}")`
        );
        throw new ConflictException('User already exists in our records');
      }
      // Fetch default role
      this.logger.debug(`Fetching default role "author"`);

      const defaultRole = await this.roleRepository.findOne({ where: { name: 'author' } });
      if (!defaultRole) {
        this.logger.error(`Default role "author" not found in database`);
        throw new Error('Default role not found');
      }

      // Create user entity
      const user = this.usersRepository.create({
        id: id,
        ...registerDto,
        role: defaultRole,
      });
      this.logger.debug(
        `User entity created (not yet saved): email="${user.email}"`
      );

      // Save user
      const savedUser = await this.usersRepository.save(user);

      const duration = Date.now() - startTime;
      this.logger.log(
        `User registered successfully: id="${savedUser.id}", email="${savedUser.email}", duration=${duration}ms`
      );

      return savedUser;

    } catch (err: any) {
      if (err.code === '23505') {
        this.logger.warn(
          `Duplicate email detected during registration: email="${registerDto.email}"`
        );
        throw new ConflictException('Email already registered');
      }

      //  Unexpected error
      this.logger.error(
        `User registration failed: email="${registerDto.email}"`,
        err.stack,
      );
      throw new InternalServerErrorException('Failed to create user');
    }

  }

  async getUserByEmail(email: string, profile?: { id: string, firstName: string; lastName: string }): Promise<UserEntity> {
    this.logger.debug(`Finding user by email: ${email}`);
    let user = await this.usersRepository.findOne({
      where: { email },
      relations: ['role', 'country'],
    });

    if (!user) {
      if (!profile) {
        this.logger.warn(`User not found for email: ${email} and no profile provided`);
        throw new NotFoundException('User not found');
      }
      // Create user with placeholder data
      const defaultRole = await this.roleRepository.findOne({ where: { name: 'author' } });
      if (!defaultRole) {
        this.logger.error('Default role "author" not found in database');
        throw new Error('Default role not configured');
      }
      user = this.usersRepository.create({
        id: profile.id,
        email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: defaultRole,
        dob: new Date('1900-01-01'), // placeholder
      });
      await this.usersRepository.save(user);
      this.logger.log(`Created new user with placeholder for email: ${email}, id: ${user.id}`);
    }
    return user;
  }

  async completeProfile(userId: string, dto: RegisterUserDto): Promise<UserEntity> {
    this.logger.log(`Completing profile for user: ${userId}`);
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      this.logger.error(`User not found for id: ${userId}`);
      throw new NotFoundException('User not found');
    }

    const role = await this.roleRepository.findOne({ where: { id: dto.roleId } });
    if (!role) {
      this.logger.warn(`Invalid roleId: ${dto.roleId}`);
      throw new NotFoundException('Role not found');
    }

    let country: Country | null = null
    if (dto.countryId) {
      country = await this.countryRepository.findOne({ where: { id: dto.countryId } });
      if (!country) {
        this.logger.warn(`Invalid countryId: ${dto.countryId}`);
        throw new NotFoundException('Country not found');
      }
    }

    user.role = role;
    if (country) user.country = country;
    if (!dto.dob) {
      this.logger.error('Date of birth missing in completeProfile');
      throw new BadRequestException('Date of birth is required');
    }
    user.dob = new Date(dto.dob);

    await this.usersRepository.save(user);
    this.logger.log(`Profile completed for user: ${userId}`);
    return user;
  }
}
