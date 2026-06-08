import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const producto = this.productosRepository.create(createProductoDto);
    return this.productosRepository.save(producto);
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    categoria_id?: number;
    search?: string;
    en_oferta?: number;
  }): Promise<{
    data: Producto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const whereConditions: any = {};

    if (query.categoria_id) {
      whereConditions.categoria_id = query.categoria_id;
    }

    if (query.search) {
      whereConditions.nombre = ILike(`%${query.search}%`);
    }

    if (query.en_oferta !== undefined) {
      whereConditions.en_oferta = query.en_oferta;
    }

    const [data, total] = await this.productosRepository.findAndCount({
      where: whereConditions,
      relations: { categoria: true },
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productosRepository.findOne({
      where: { id },
      relations: { categoria: true },
    });

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return producto;
  }

  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    const producto = await this.findOne(id);
    Object.assign(producto, updateProductoDto);
    return this.productosRepository.save(producto);
  }

  async softDelete(id: number): Promise<void> {
    const producto = await this.findOne(id);
    await this.productosRepository.softRemove(producto);
  }

  async restore(id: number): Promise<Producto> {
    const result = await this.productosRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return this.findOne(id);
  }

  async findAllForReport(): Promise<Producto[]> {
    return this.productosRepository.find({
      relations: { categoria: true },
      order: { categoria_id: 'ASC', nombre: 'ASC' },
    });
  }
}
