import { Module } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { ReportesController } from './reportes.controller';
import { ProductosModule } from '../productos/productos.module';

@Module({
  imports: [ProductosModule],
  controllers: [ReportesController],
  providers: [ReportesService],
})
export class ReportesModule {}
