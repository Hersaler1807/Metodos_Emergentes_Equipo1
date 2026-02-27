import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Equipment } from '../../equipments/entities/equipment.entity';

export enum TicketStatus {
    PENDING = 'Pendiente',
    IN_PROGRESS = 'En proceso',
    RESOLVED = 'Resuelto',
    CLOSED = 'Cerrado',
}

@Entity('tickets')
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column('text')
    description: string;

    @Column({
        type: 'enum',
        enum: TicketStatus,
        default: TicketStatus.PENDING,
    })
    status: TicketStatus;

    // Evidencias o notas del técnico
    @Column('text', { nullable: true })
    evidenceText: string;

    // -- Relaciones --

    // Usuario que reporta el problema
    @ManyToOne(() => User)
    @JoinColumn({ name: 'reportedById' })
    reportedBy: User;

    @Column()
    reportedById: number;

    // Técnico asignado para solucionar
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'assignedToId' })
    assignedTo: User;

    @Column({ nullable: true })
    assignedToId: number;

    // Equipo que presenta la falla (opcional, en caso de un fallo genérico)
    @ManyToOne(() => Equipment, { nullable: true })
    @JoinColumn({ name: 'equipmentId' })
    equipment: Equipment;

    @Column({ nullable: true })
    equipmentId: number;

    // -----------------

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
