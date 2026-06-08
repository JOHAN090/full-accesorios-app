import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => Usuario, (usuario) => usuario.rol)
  usuarios: Usuario[];
}
