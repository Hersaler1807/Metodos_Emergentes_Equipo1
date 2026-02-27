import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
    @IsString({ message: 'El título es requerido y debe ser texto' })
    @IsNotEmpty()
    title: string;

    @IsString({ message: 'La descripción es requerida' })
    @IsNotEmpty()
    description: string;

    @IsInt({ message: 'El ID del equipo debe ser un número entero' })
    @IsOptional()
    equipmentId?: number;
}
