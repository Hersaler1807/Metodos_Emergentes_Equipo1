import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../users/entities/user.entity';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Si la ruta no especifica roles, permite el acceso a todos los autenticados.
        if (!requiredRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        // Validar que el rol extraido del JWT del usuario exista entre los roles permitidos
        return requiredRoles.some((role) => user?.role === role);
    }
}
