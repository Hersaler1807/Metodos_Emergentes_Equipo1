import { Controller, Get, Post, Body, Param, Put, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('tickets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    // Cualquier usuario (Normal, Técnico o Admin) puede crear un ticket
    @Post()
    create(@Body() createTicketDto: CreateTicketDto, @Request() req: any) {
        // req.user viene del token decodificado por el JwtStrategy
        return this.ticketsService.create(createTicketDto, req.user.userId);
    }

    // SOLO Admin puede ver todos los tickets
    @Get()
    @Roles(UserRole.ADMIN)
    findAll() {
        return this.ticketsService.findAll();
    }

    // SOLO Usuarios Normales ven los de ellos
    @Get('my-tickets')
    @Roles(UserRole.USER)
    findMyTickets(@Request() req: any) {
        return this.ticketsService.findMyTickets(req.user.userId);
    }

    // SOLO Técnicos ven sus pendientes
    @Get('assigned')
    @Roles(UserRole.TECHNICIAN)
    findAssignedToMe(@Request() req: any) {
        return this.ticketsService.findAssignedToMe(req.user.userId);
    }

    // Todos (Admin para inspeccionar, Tech para reparar, User para ver status)
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.ticketsService.findOne(id);
    }

    // ADMIN asigna el ticket a un técnico pasando { technicianId: ID } en el Body
    @Put(':id/assign')
    @Roles(UserRole.ADMIN)
    assign(
        @Param('id', ParseIntPipe) id: number,
        @Body('technicianId', ParseIntPipe) technicianId: number,
    ) {
        return this.ticketsService.assignToTechnician(id, technicianId);
    }

    // TÉCNICO marca como resuelto y añade evidencia
    @Put(':id/status')
    @Roles(UserRole.TECHNICIAN)
    updateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTicketStatusDto: UpdateTicketStatusDto,
    ) {
        return this.ticketsService.updateStatus(id, updateTicketStatusDto);
    }
}
