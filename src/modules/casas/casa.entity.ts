import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Residente } from '../residentes/residente.entity';
import { Vehiculo } from '../vehiculo/vehiculo.entity';

  // Entidad: Casa
@Entity('casas')
export class Casa {
  @ApiProperty({ example: 1, description: 'Identificador único de la casa' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'A-102', description: 'Número único de la casa (ej. A-102)' })
  @Column({ type: 'varchar', length: 6, unique: true })
  numero: string;

  @ApiProperty({ example: 'Av. Central 456, Condominio Los Álamos', description: 'Dirección completa de la casa' })
  @Column({ type: 'varchar', length: 150 })
  direccion: string;



  @OneToMany(() => Residente, (residente) => residente.casa)
  residentes: Residente[];

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.casa)
  vehiculos: Vehiculo[];
}
