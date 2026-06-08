import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from '../roles/entities/rol.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Rol, Usuario])],
  providers: [SeedService],
})
export class DatabaseModule {}
