import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
    @IsEmail({}, { message: 'El formato de correo electrónico es inválido' })
    @IsOptional()
    email?: string;

    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @IsOptional()
    password?: string;

    @IsEnum(UserRole, { message: 'El rol debe ser Admin, Technician o User' })
    @IsOptional()
    role?: UserRole;

    @IsString({ message: 'El área debe ser una cadena de texto' })
    @IsOptional()
    area?: string;
}
