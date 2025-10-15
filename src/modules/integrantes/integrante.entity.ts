import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuarios.entity';
import { Casa } from '../casas/casa.entity';
import { Vehiculo } from '../vehiculo/vehiculo.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('integrantes')
export class Integrante {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'María López' })
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @ApiProperty({ example: 'Hija' })
  @Column({ type: 'varchar', length: 50 })
  parentesco: string;

  @ManyToOne(() => Usuario, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_locatario' })
  locatario: Usuario;

  @ManyToOne(() => Casa, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_casa' })
  casa: Casa;

  @ManyToOne(() => Vehiculo, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'id_vehiculo' })
  vehiculo?: Vehiculo;
}
