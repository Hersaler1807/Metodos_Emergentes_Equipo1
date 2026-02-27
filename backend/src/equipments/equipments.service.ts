import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Equipment } from './entities/equipment.entity';
import { CreateEquipmentDto } from './dto/create-equipment.dto';
import { UpdateEquipmentDto } from './dto/update-equipment.dto';

@Injectable()
export class EquipmentsService {
    constructor(
        @InjectRepository(Equipment)
        private equipmentsRepository: Repository<Equipment>,
    ) { }

    async create(createEquipmentDto: CreateEquipmentDto): Promise<Equipment> {
        const equipment = this.equipmentsRepository.create(createEquipmentDto);
        return this.equipmentsRepository.save(equipment);
    }

    async findAll(): Promise<Equipment[]> {
        return this.equipmentsRepository.find();
    }

    async findOne(id: number): Promise<Equipment> {
        const equipment = await this.equipmentsRepository.findOne({ where: { id } });
        if (!equipment) {
            throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
        }
        return equipment;
    }

    async update(id: number, updateEquipmentDto: UpdateEquipmentDto): Promise<Equipment> {
        const equipment = await this.findOne(id);
        const updatedEquipment = Object.assign(equipment, updateEquipmentDto);
        return this.equipmentsRepository.save(updatedEquipment);
    }

    async remove(id: number): Promise<void> {
        const result = await this.equipmentsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Equipo con ID ${id} no encontrado`);
        }
    }
}
