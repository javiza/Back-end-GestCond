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
import { Guardia } from '../guardias/guardia.entity';

@Entity('turnos')
export class Turno {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Inicio de turno sin novedades' })
  @Column({ type: 'text', name: 'observacion_inicio', nullable: false })
  observacion_inicio: string;

  @ApiProperty({ example: 'Finalizo turno sin novedades' })
  @Column({ type: 'text', name: 'observacion_termino', nullable: true })
  observacion_termino?: string;

 @Column({
  name: 'fecha_hora_inicio',
  type: 'timestamp',
  default: () => 'CURRENT_TIMESTAMP',
})
fecha_hora_inicio: Date;

  @Column({
  name: 'fecha_hora_termino',
  type: 'timestamp',
  nullable: true
})
fecha_hora_termino: Date | null;


 @Column({ name: 'id_guardia', type: 'int', nullable: true })
  id_guardia?: number;

  /** relación ManyToOne */
  @ManyToOne(() => Guardia, { nullable: true, onDelete: 'SET NULL', eager: true })
  @JoinColumn({ name: 'id_guardia' })
  guardia?: Guardia;
}
