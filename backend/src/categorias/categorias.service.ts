import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private categoriasRepository: Repository<Categoria>,
  ) {}

  async create(createCategoriaDto: CreateCategoriaDto): Promise<Categoria> {
    const categoria = this.categoriasRepository.create(createCategoriaDto);
    return this.categoriasRepository.save(categoria);
  }

  async findAll(): Promise<Categoria[]> {
    return this.categoriasRepository.find({
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Categoria> {
    const categoria = await this.categoriasRepository.findOne({
      where: { id },
      relations: { productos: true },
    });

    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }

    return categoria;
  }

  async update(
    id: number,
    updateCategoriaDto: UpdateCategoriaDto,
  ): Promise<Categoria> {
    const categoria = await this.findOne(id);
    Object.assign(categoria, updateCategoriaDto);
    return this.categoriasRepository.save(categoria);
  }

  async softDelete(id: number): Promise<void> {
    const categoria = await this.findOne(id);
    await this.categoriasRepository.softRemove(categoria);
  }

  async restore(id: number): Promise<Categoria> {
    const result = await this.categoriasRepository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return this.findOne(id);
  }
}
