import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EquipmentStatus } from '../entities/equipment.entity';

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

    @IsString()
    @IsOptional()
    area?: string;

    @IsString()
    @IsOptional()
    hardwareDetails?: string;
}
