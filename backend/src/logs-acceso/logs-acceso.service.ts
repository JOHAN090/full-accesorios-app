import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogAcceso } from './entities/log-acceso.entity';

@Injectable()
export class LogsAccesoService {
  constructor(
    @InjectRepository(LogAcceso)
    private logsAccesoRepository: Repository<LogAcceso>,
  ) {}

  async create(
    usuario_id: number,
    ip: string,
    evento: 'INGRESO' | 'SALIDA',
    navegador: string,
  ): Promise<LogAcceso> {
    const log = this.logsAccesoRepository.create({
      usuario_id,
      ip,
      evento,
      navegador,
    });
    return this.logsAccesoRepository.save(log);
  }

  async findByUsuario(usuario_id: number): Promise<LogAcceso[]> {
    return this.logsAccesoRepository.find({
      where: { usuario_id },
      order: { fecha_hora: 'DESC' },
      relations: { usuario: true },
    });
  }

  async findAll(): Promise<LogAcceso[]> {
    return this.logsAccesoRepository.find({
      order: { fecha_hora: 'DESC' },
      relations: { usuario: true },
    });
  }
}
