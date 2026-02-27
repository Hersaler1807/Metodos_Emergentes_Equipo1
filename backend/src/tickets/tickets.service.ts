import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketStatusDto } from './dto/update-ticket-status.dto';

@Injectable()
export class TicketsService {
    constructor(
        @InjectRepository(Ticket)
        private ticketsRepository: Repository<Ticket>,
    ) { }

    // Cualquier usuario puede crear un ticket y se le vincula por su ID
    async create(createTicketDto: CreateTicketDto, userId: number): Promise<Ticket> {
        const ticket = this.ticketsRepository.create({
            ...createTicketDto,
            reportedById: userId,
        });
        return this.ticketsRepository.save(ticket);
    }

    // Admin ve todos
    async findAll(): Promise<Ticket[]> {
        return this.ticketsRepository.find({
            relations: ['reportedBy', 'assignedTo', 'equipment'],
            order: { createdAt: 'DESC' }
        });
    }

    // Usuario Final ve sólo los suyos
    async findMyTickets(userId: number): Promise<Ticket[]> {
        return this.ticketsRepository.find({
            where: { reportedById: userId },
            relations: ['assignedTo', 'equipment'],
            order: { createdAt: 'DESC' }
        });
    }

    // Técnico ve sólo los asignados a él
    async findAssignedToMe(technicianId: number): Promise<Ticket[]> {
        return this.ticketsRepository.find({
            where: { assignedToId: technicianId },
            relations: ['reportedBy', 'equipment'],
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: number): Promise<Ticket> {
        const ticket = await this.ticketsRepository.findOne({
            where: { id },
            relations: ['reportedBy', 'assignedTo', 'equipment'],
        });
        if (!ticket) {
            throw new NotFoundException(`Ticket #${id} no encontrado`);
        }
        return ticket;
    }

    // Admin asigna un ticket a un técnico
    async assignToTechnician(ticketId: number, technicianId: number): Promise<Ticket> {
        const ticket = await this.findOne(ticketId);
        ticket.assignedToId = technicianId;
        return this.ticketsRepository.save(ticket);
    }

    // Técnico actualiza el estado y sube la evidencia final
    async updateStatus(ticketId: number, dto: UpdateTicketStatusDto): Promise<Ticket> {
        const ticket = await this.findOne(ticketId);
        ticket.status = dto.status;
        if (dto.evidenceText) {
            ticket.evidenceText = dto.evidenceText;
        }
        return this.ticketsRepository.save(ticket);
    }
}
