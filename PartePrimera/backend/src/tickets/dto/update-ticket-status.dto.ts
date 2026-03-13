import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TicketStatus } from '../entities/ticket.entity';

export class UpdateTicketStatusDto {
    @IsEnum(TicketStatus, { message: 'El estado del ticket es inválido' })
    @IsNotEmpty()
    status: TicketStatus;

    @IsString()
    @IsOptional()
    evidenceText?: string;
}
