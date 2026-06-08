import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('logs_acceso')
export class LogAcceso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'usuario_id' })
  usuario_id: number;

  @Column({ type: 'varchar', length: 45 })
  ip: string;

  @Column({
    type: 'enum',
    enum: ['INGRESO', 'SALIDA'],
  })
  evento: string;

  @Column({ type: 'varchar', length: 500 })
  navegador: string;

  @CreateDateColumn({ name: 'fecha_hora' })
  fecha_hora: Date;

  @ManyToOne(() => Usuario, (usuario) => usuario.logs_acceso)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;
}
