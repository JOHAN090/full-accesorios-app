import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'categoria_id' })
  categoria_id: number;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  descripcion_corta: string;

  @Column({ type: 'text', nullable: true })
  detalles_tecnicos: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'smallint', default: 0 })
  en_oferta: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio_oferta: number;

  @Column({ type: 'varchar', length: 500, nullable: true })
  imagen_url: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos)
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;
}
