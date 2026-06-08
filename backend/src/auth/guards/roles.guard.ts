import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No roles required = allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      console.log('❌ RolesGuard: No hay usuario en la petición (JWT no procesado)');
      throw new ForbiddenException('No se pudo verificar la identidad del usuario');
    }

    const userRol = (user.rol || '').toString().toLowerCase();
    console.log(`🔐 RolesGuard: usuario=${user.correo || user.userId}, rol='${user.rol}', roles_requeridos=[${requiredRoles.join(', ')}]`);

    const hasRole = requiredRoles.some((role) => userRol === role.toLowerCase());

    if (!hasRole) {
      console.log(`❌ RolesGuard: rol '${userRol}' no tiene permiso. Se requiere: [${requiredRoles.join(', ')}]`);
      throw new ForbiddenException('No tienes permisos para realizar esta acción');
    }

    return true;
  }
}
