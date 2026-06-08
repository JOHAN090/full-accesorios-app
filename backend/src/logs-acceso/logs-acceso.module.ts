import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogAcceso } from './entities/log-acceso.entity';
import { LogsAccesoService } from './logs-acceso.service';
import { LogsAccesoController } from './logs-acceso.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LogAcceso])],
  controllers: [LogsAccesoController],
  providers: [LogsAccesoService],
  exports: [LogsAccesoService],
})
export class LogsAccesoModule {}
