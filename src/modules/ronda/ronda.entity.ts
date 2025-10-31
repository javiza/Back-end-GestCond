import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Turno } from '../turnos/turno.entity';

@Entity('rondas')
export class Ronda {
  @ApiProperty({ example: 1, description: 'Identificador único de la ronda' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Ronda completa sin novedades',
    description: 'Observaciones registradas durante la ronda',
  })
  @Column({ name: 'observacion_ronda', type: 'text', nullable: false })
  observacion_ronda: string;

  @ApiProperty({
    example: '2025-10-31T22:15:00Z',
    description: 'Fecha y hora de inicio de la ronda',
  })
  @CreateDateColumn({
    name: 'fecha_hora_inicio',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_hora_inicio: Date;

  @ApiProperty({
    example: '2025-10-31T22:45:00Z',
    description: 'Fecha y hora de término de la ronda',
  })
  @UpdateDateColumn({
    name: 'fecha_hora_termino',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_hora_termino: Date;

 
  @ManyToOne(() => Turno, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_turno' })
  turno?: Turno;
}
