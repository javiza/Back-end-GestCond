import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Guardia } from '../guardias/guardia.entity';
import { Ronda } from '../ronda/ronda.entity';

@Entity('turnos')
export class Turno {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Turno nocturno sin novedades' })
  @Column({ type: 'text', name: 'observacion_turno', nullable: false })
  observacion_turno: string;

  @ApiProperty({ example: '2025-10-31T22:00:00.000Z' })
  @CreateDateColumn({ name: 'fecha_hora_inicio', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_hora_inicio: Date;

  @ApiProperty({ example: '2025-11-01T06:00:00.000Z' })
  @CreateDateColumn({ name: 'fecha_hora_termino', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_hora_termino: Date;

  @ManyToOne(() => Guardia, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_guardia' })
  @ApiProperty({ type: () => Guardia, required: false })
  guardia?: Guardia;

  @OneToMany(() => Ronda, (ronda) => ronda.id)
  rondas?: Ronda[];
}
