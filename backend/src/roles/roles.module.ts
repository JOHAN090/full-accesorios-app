import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rol } from './entities/rol.entity';
import { RolesController } from './roles.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Rol])],
  controllers: [RolesController],
  exports: [TypeOrmModule],
})
export class RolesModule {}
