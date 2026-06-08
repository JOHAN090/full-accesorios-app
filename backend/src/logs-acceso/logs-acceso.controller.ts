import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogsAccesoService } from './logs-acceso.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('logs-acceso')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LogsAccesoController {
  constructor(private readonly logsAccesoService: LogsAccesoService) {}

  @Get()
  @Roles('admin') // Solo los administradores pueden ver los logs generales
  async findAll() {
    return this.logsAccesoService.findAll();
  }
}
