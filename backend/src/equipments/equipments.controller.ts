import { Controller, Get, Post, Body, Put, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { EquipmentsService } from './equipments.service';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('equipments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EquipmentsController {
    constructor(private readonly equipmentsService: EquipmentsService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    create(@Body() createEquipmentDto: CreateEquipmentDto) {
        return this.equipmentsService.create(createEquipmentDto);
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
    findAll() {
        return this.equipmentsService.findAll();
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.TECHNICIAN)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.equipmentsService.findOne(id);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateEquipmentDto: UpdateEquipmentDto,
    ) {
        return this.equipmentsService.update(id, updateEquipmentDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.equipmentsService.remove(id);
    }
}
