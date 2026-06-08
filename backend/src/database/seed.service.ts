import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Rol } from '../roles/entities/rol.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Rol)
    private rolesRepository: Repository<Rol>,
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async onModuleInit() {
    await this.seedRoles();
    await this.seedAdminUser();
  }

  private async seedRoles() {
    const roles = [
      { nombre: 'admin', descripcion: 'Administrador del sistema con acceso total' },
      { nombre: 'editor', descripcion: 'Editor que puede agregar y editar productos, ver reportes' },
    ];

    for (const rolData of roles) {
      const existingRol = await this.rolesRepository.findOne({
        where: { nombre: rolData.nombre },
      });

      if (!existingRol) {
        const rol = this.rolesRepository.create(rolData);
        await this.rolesRepository.save(rol);
        console.log(`✅ Rol '${rolData.nombre}' creado`);
      }
    }
  }

  private async seedAdminUser() {
    const adminRol = await this.rolesRepository.findOne({
      where: { nombre: 'admin' },
    });

    if (!adminRol) {
      console.log('❌ No se encontró el rol admin para crear el usuario seed');
      return;
    }

    const existingAdmin = await this.usuariosRepository.findOne({
      where: { correo: 'admin@fullaccesorios.com' },
    });

    const password_hash = await bcrypt.hash('Admin123!', 10);

    if (!existingAdmin) {
      // Create new admin
      const admin = this.usuariosRepository.create({
        rol_id: adminRol.id,
        nombres: 'Admin',
        apellidos: 'Sistema',
        correo: 'admin@fullaccesorios.com',
        password_hash,
        estado: 'activo',
      });
      await this.usuariosRepository.save(admin);
      console.log('✅ Usuario admin creado: admin@fullaccesorios.com / Admin123!');
    } else {
      // ALWAYS fix existing admin: update password, estado, and rol
      existingAdmin.password_hash = password_hash;
      existingAdmin.estado = 'activo';
      existingAdmin.rol_id = adminRol.id;
      await this.usuariosRepository.save(existingAdmin);
      console.log('✅ Usuario admin actualizado: contraseña, estado=activo, rol=admin');
    }
  }
}
