import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EquipmentStatus } from '../entities/equipment.entity';
import { WorkArea } from '../../common/enums/area.enum';

export class UpdateEquipmentDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    serialNumber?: string;

    @IsEnum(EquipmentStatus)
    @IsOptional()
    status?: EquipmentStatus;

    @IsEnum(WorkArea)
    @IsOptional()
    area?: WorkArea;

    @IsString()
    @IsOptional()
    hardwareDetails?: string;
}
