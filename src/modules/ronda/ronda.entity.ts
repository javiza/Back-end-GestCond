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
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Identificador único de la ronda' })
  id: number;

  @Column({ name: 'observacion_ronda', type: 'text', nullable: false })
  @ApiProperty({ example: 'Ronda completa sin novedades' })
  observacion_ronda: string;

  @CreateDateColumn({
    name: 'fecha_hora_inicio',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_hora_inicio: Date;

  @UpdateDateColumn({
    name: 'fecha_hora_termino',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_hora_termino: Date;

  @ManyToOne(() => Turno, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'id_turno' })
  turno?: Turno;
}
