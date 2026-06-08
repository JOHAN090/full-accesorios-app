import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Roles('admin')
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @Roles('admin')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Post()
  @Roles('admin')
  create(
    @Body()
    body: {
      rol_id: number;
      nombres: string;
      apellidos: string;
      correo: string;
      password: string;
    },
  ) {
    return this.usuariosService.create(body);
  }

  @Put(':id')
  @Roles('admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    body: Partial<{
      rol_id: number;
      nombres: string;
      apellidos: string;
      correo: string;
      password: string;
      estado: string;
    }>,
  ) {
    return this.usuariosService.update(id, body);
  }

  @Delete(':id')
  @Roles('admin')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.softDelete(id);
  }
}
