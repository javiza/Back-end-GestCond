import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from 'src/modules/usuarios/usuarios.entity';
import { Casa } from '../casas/casa.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('vehiculos')
export class Vehiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'ABCD12' })
  @Column({ type: 'varchar', length: 10, unique: true })
  patente: string;

  @ApiProperty({ example: 'Toyota' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  marca?: string;

  @ApiProperty({ example: 'Corolla' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  modelo?: string;

  @ApiProperty({ example: 'Rojo' })
  @Column({ type: 'varchar', length: 30, nullable: true })
  color?: string;

  @ApiProperty({ example: 'auto', enum: ['auto', 'moto'] })
  @Column({ type: 'varchar', length: 20 })
  tipo_vehiculo: 'auto' | 'moto';

  @ApiProperty({ example: 'locatario', enum: ['locatario', 'integrante'] })
  @Column({ type: 'varchar', length: 20, default: 'locatario' })
  tipo_propietario: 'locatario' | 'integrante';

  @ManyToOne(() => Casa, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_casa' })
  casa: Casa;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_locatario' })
  locatario: Usuario;

  @ManyToOne(() => Usuario, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'id_integrante' })
  integrante?: Usuario;
}
