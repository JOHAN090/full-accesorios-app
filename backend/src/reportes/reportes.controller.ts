import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { ReportesService } from './reportes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reportes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('inventario')
  @Roles('admin', 'editor')
  async getInventoryReport(@Res() res: Response) {
    const pdfBuffer = await this.reportesService.generateInventoryReport();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition':
        'attachment; filename=reporte-inventario.pdf',
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }
}
