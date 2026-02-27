import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from '../tickets/entities/ticket.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Ticket)
        private ticketsRepository: Repository<Ticket>,
    ) { }

    // Genera los contadores para visualización rápida del Dashboard
    async getDashboardStats() {
        const total = await this.ticketsRepository.count();

        const pending = await this.ticketsRepository.count({
            where: { status: TicketStatus.PENDING }
        });

        const inProgress = await this.ticketsRepository.count({
            where: { status: TicketStatus.IN_PROGRESS }
        });

        const resolved = await this.ticketsRepository.count({
            where: { status: TicketStatus.RESOLVED }
        });

        const closed = await this.ticketsRepository.count({
            where: { status: TicketStatus.CLOSED }
        });

        return {
            total,
            pending,
            inProgress,
            resolved,
            closed
        };
    }

    // Desempeño por Técnico (Tickets asiganados a cada quien y su desglose)
    async getTechnicianPerformance() {
        // Para simplificar, obtenemos todos los tickets que tienen un técnico asignado
        // Agrupamos en JS para devolver una vista limpia
        const assignedTickets = await this.ticketsRepository.find({
            relations: ['assignedTo'],
            where: { assignedTo: { id: undefined } } // TypeORM hack: excluye los manuales, traeremos todos y filtramos
        });

        // Filtramos para asegurar que no vienen null (no asignados)
        const validTickets = assignedTickets.filter(t => t.assignedTo != null);

        const performanceMap = {};

        validTickets.forEach(t => {
            const techName = t.assignedTo.email; // o name/area dependiendo del diseño
            if (!performanceMap[techName]) {
                performanceMap[techName] = { totalAssigned: 0, resolved: 0, pending: 0 };
            }

            performanceMap[techName].totalAssigned++;

            if (t.status === TicketStatus.RESOLVED || t.status === TicketStatus.CLOSED) {
                performanceMap[techName].resolved++;
            } else {
                performanceMap[techName].pending++;
            }
        });

        return Object.keys(performanceMap).map(key => ({
            technician: key,
            ...performanceMap[key]
        }));
    }
}
