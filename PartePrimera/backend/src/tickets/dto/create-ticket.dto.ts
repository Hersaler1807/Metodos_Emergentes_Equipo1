import { IsInt, IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { TicketCategory, TicketPriority } from '../../common/enums';

export class CreateTicketDto {
    @IsString({ message: 'El título es requerido y debe ser texto' })
    @IsNotEmpty({ message: 'El título es requerido' })
    title: string;

    @IsString({ message: 'La descripción es requerida' })
    @IsNotEmpty({ message: 'La descripción es requerida' })
    description: string;

    @IsEnum(TicketCategory, { message: 'La categoría no es válida' })
    @IsNotEmpty({ message: 'La categoría es requerida' })
    category: TicketCategory;

    @IsEnum(TicketPriority, { message: 'La prioridad no es válida' })
    @IsOptional()
    priority?: TicketPriority;

    @IsInt({ message: 'El ID del equipo debe ser un número entero' })
    @IsOptional()
    equipmentId?: number;
}
