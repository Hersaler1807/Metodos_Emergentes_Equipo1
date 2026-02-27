import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum EquipmentStatus {
    ACTIVE = 'Activo',
    IN_REPAIR = 'En reparación',
    OUT_OF_SERVICE = 'Baja',
}

@Entity('equipments')
export class Equipment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    serialNumber: string;

    @Column({
        type: 'enum',
        enum: EquipmentStatus,
        default: EquipmentStatus.ACTIVE,
    })
    status: EquipmentStatus;

    @Column()
    area: string;

    @Column({ type: 'text', nullable: true })
    hardwareDetails: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
