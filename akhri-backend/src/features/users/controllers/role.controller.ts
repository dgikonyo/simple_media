import { Controller, Get } from "@nestjs/common";
import { Repository } from "typeorm";
import { Role } from "../entities/role.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Controller('roles')
export class RoleController {
    constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) { }

    @Get()
    async findAll() {
        return this.roleRepository.find();
    }
}