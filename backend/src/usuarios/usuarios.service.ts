import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async create(data: {
    rol_id: number;
    nombres: string;
    apellidos: string;
    correo: string;
    password: string;
  }): Promise<Usuario> {
    const existingUser = await this.usuariosRepository.findOne({
      where: { correo: data.correo },
    });

    if (existingUser) {
      throw new ConflictException('El correo ya está registrado');
    }

    const password_hash = await bcrypt.hash(data.password, 10);

    const usuario = this.usuariosRepository.create({
      rol_id: data.rol_id,
      nombres: data.nombres,
      apellidos: data.apellidos,
      correo: data.correo,
      password_hash,
    });

    const savedUser = await this.usuariosRepository.save(usuario);
    const { password_hash: _, ...result } = savedUser as any;
    return result;
  }

  async findByEmail(correo: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({
      where: { correo },
      relations: { rol: true },
    });
  }

  async findAll(): Promise<Usuario[]> {
    const users = await this.usuariosRepository.find({
      relations: { rol: true },
    });
    return users.map((user) => {
      const { password_hash, ...result } = user as any;
      return result;
    });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      relations: { rol: true },
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async update(
    id: number,
    data: Partial<{
      rol_id: number;
      nombres: string;
      apellidos: string;
      correo: string;
      password: string;
      estado: string;
    }>,
  ): Promise<Usuario> {
    const usuario = await this.findOne(id);

    if (data.password) {
      (data as any).password_hash = await bcrypt.hash(data.password, 10);
      delete data.password;
    }

    Object.assign(usuario, data);
    const savedUser = await this.usuariosRepository.save(usuario);
    const { password_hash, ...result } = savedUser as any;
    return result;
  }

  async softDelete(id: number): Promise<void> {
    const usuario = await this.findOne(id);
    await this.usuariosRepository.softRemove(usuario);
  }
}
