import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Rol } from '../../roles/entities/rol.entity';
import { LogAcceso } from '../../logs-acceso/entities/log-acceso.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'rol_id' })
  rol_id: number;

  @Column({ type: 'varchar', length: 100 })
  nombres: string;

  @Column({ type: 'varchar', length: 100 })
  apellidos: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  correo: string;

  @Column({ type: 'varchar', length: 255 })
  password_hash: string;

  @Column({ type: 'varchar', length: 20, default: 'activo' })
  estado: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  @ManyToOne(() => Rol, (rol) => rol.usuarios, { eager: true })
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @OneToMany(() => LogAcceso, (log) => log.usuario)
  logs_acceso: LogAcceso[];
}
