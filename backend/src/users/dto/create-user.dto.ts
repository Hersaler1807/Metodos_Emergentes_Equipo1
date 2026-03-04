import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { WorkArea } from '../../common/enums/area.enum';

export class CreateUserDto {
    @IsEmail({}, { message: 'El formato de correo electrónico es inválido' })
    @IsNotEmpty({ message: 'El correo electrónico es requerido' })
    email: string;

    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'La contraseña es requerida' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    password: string;

    @IsEnum(UserRole, { message: 'El rol debe ser Admin, Technician o User' })
    @IsNotEmpty({ message: 'El rol es requerido' })
    role: UserRole;

    @IsEnum(WorkArea, { message: 'El área no es válida' })
    @IsNotEmpty({ message: 'El área es requerida' })
    area: WorkArea;
}
