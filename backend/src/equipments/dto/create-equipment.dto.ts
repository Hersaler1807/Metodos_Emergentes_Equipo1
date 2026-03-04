import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EquipmentStatus } from '../entities/equipment.entity';
import { WorkArea } from '../../common/enums/area.enum';

export class CreateEquipmentDto {
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El nombre es requerido' })
    name: string;

    @IsString({ message: 'El número de serie debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El número de serie es requerido' })
    serialNumber: string;

    @IsEnum(EquipmentStatus, { message: 'Estado inválido' })
    @IsOptional()
    status?: EquipmentStatus;

    @IsEnum(WorkArea, { message: 'El área no es válida' })
    @IsNotEmpty({ message: 'El área es requerida' })
    area: WorkArea;

    @IsString({ message: 'Los detalles de hardware deben ser una cadena de texto' })
    @IsOptional()
    hardwareDetails?: string;
}
