import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from './entities/rol.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(
    @InjectRepository(Rol)
    private rolesRepository: Repository<Rol>,
  ) {}

  @Get()
  @Roles('admin')
  findAll() {
    return this.rolesRepository.find({ order: { nombre: 'ASC' } });
  }
}
