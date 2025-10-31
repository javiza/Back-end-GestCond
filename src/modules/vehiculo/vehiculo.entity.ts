import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Casa } from '../casas/casa.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('vehiculos')
export class Vehiculo {
  @ApiProperty({ example: 1, description: 'Identificador único del vehículo' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Carlos Pérez', description: 'Nombre del dueño del vehículo' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre_dueño: string;

  @ApiProperty({ example: 'ABCD12', description: 'Patente única del vehículo' })
  @Column({ type: 'varchar', length: 10, unique: true })
  patente: string;

  @ApiProperty({ example: 'Toyota', description: 'Marca del vehículo', required: false })
  @Column({ type: 'varchar', length: 50, nullable: true })
  marca?: string;

  @ApiProperty({ example: 'Corolla', description: 'Modelo del vehículo', required: false })
  @Column({ type: 'varchar', length: 50, nullable: true })
  modelo?: string;

  @ApiProperty({ example: 'Rojo', description: 'Color del vehículo', required: false })
  @Column({ type: 'varchar', length: 30, nullable: true })
  color?: string;

  @ApiProperty({ example: 'auto', enum: ['auto', 'moto'], description: 'Tipo de vehículo' })
  @Column({
    type: 'varchar',
    length: 20,
  })
  tipo_vehiculo: 'auto' | 'moto';

  // Relación con Casa
  @ApiProperty({ type: () => Casa, description: 'Casa a la que pertenece el vehículo' })
  @ManyToOne(() => Casa, (casa) => casa.vehiculos, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_casa' })
  casa: Casa;
}
