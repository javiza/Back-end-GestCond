import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { Residente } from '../../residentes/residente.entity';

@Entity('familiares')
export class Familiar {
  @ApiProperty({
    example: 1,
    description: 'ID único del familiar',
  })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del familiar',
  })
  @Column({
    type: 'varchar',
    length: 100,
  })
  nombre!: string;

  @ApiProperty({
    example: '12345678-9',
    required: false,
    description: 'RUT del familiar',
  })
  @Column({
    type: 'varchar',
    length: 12,
    unique: true,
    nullable: true,
  })
  rut?: string | null;

  @ApiProperty({
    example: 'Hijo',
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  parentesco?: string | null;

  @ApiProperty({
    example: '+56912345678',
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  telefono?: string | null;

  @ApiProperty({
    example: 'juan@email.cl',
    required: false,
  })
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  email?: string | null;

  @ApiProperty({
    example: true,
  })
  @Column({
    default: true,
  })
  activo!: boolean;

  @ApiProperty({
    example: '2026-05-24T12:30:00',
  })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_creacion!: Date;

  // RELACIÓN RESIDENTE

  @ApiProperty({
    type: () => Residente,
    description: 'Residente propietario del familiar',
  })
  @ManyToOne(() => Residente, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'id_residente',
  })
  residente!: Residente;
}
