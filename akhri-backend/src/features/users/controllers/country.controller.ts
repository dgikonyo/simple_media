import { Controller, Get } from "@nestjs/common";
import { Repository } from "typeorm";
import { Country } from "../entities/country.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Controller('countries')
export class CountryController {
    constructor(@InjectRepository(Country) private readonly countryRepository: Repository<Country>) { }

    @Get()
    async findAll() {
        return this.countryRepository.find();
    }

}