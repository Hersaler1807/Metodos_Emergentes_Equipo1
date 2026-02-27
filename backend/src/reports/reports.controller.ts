import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
    constructor(private readonly reportsService: ReportsService) { }

    @Get('dashboard-stats')
    @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
    getDashboardStats() {
        // Permite que Admin y Técnicos vean el resumen general
        return this.reportsService.getDashboardStats();
    }

    @Get('technician-performance')
    @Roles(UserRole.ADMIN)
    getTechnicianPerformance() {
        // Sólo el Admin puede ver estadísticas desglosadas por empleado
        return this.reportsService.getTechnicianPerformance();
    }
}
