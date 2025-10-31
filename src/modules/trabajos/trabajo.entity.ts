import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PersonalInterno } from '../personal-interno/personal-interno.entity';

@Entity('trabajos')
export class Trabajo {
  @ApiProperty({ example: 1, description: 'Identificador único del trabajo' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Revisión de cámaras de seguridad',
    description: 'Descripción o tipo de trabajo realizado',
  })
  @Column({ type: 'varchar', length: 100, nullable: false })
  trabajo_realizado: string;

  @ApiPropertyOptional({
    example: '2025-10-31T09:00:00.000Z',
    description: 'Fecha y hora de inicio del trabajo',
  })
  @CreateDateColumn({
    name: 'fecha_inicio',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_inicio: Date;

  @ApiPropertyOptional({
    example: '2025-10-31T13:30:00.000Z',
    description: 'Fecha y hora de término del trabajo',
  })
  @Column({ name: 'fecha_termino', type: 'timestamp', nullable: true })
  fecha_termino?: Date;

  @ApiProperty({
    type: () => PersonalInterno,
    description: 'Personal interno que realizó el trabajo',
  })
  @ManyToOne(() => PersonalInterno, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'id_personal_interno' })
  personal_interno: PersonalInterno;
}
