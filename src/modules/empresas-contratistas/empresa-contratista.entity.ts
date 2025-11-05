import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Guardia } from '../guardias/guardia.entity';
import { PersonalInterno } from '../personal-interno/personal-interno.entity';

  // Entidad: Empresa Contratista
@Entity('empresas_contratistas')
export class EmpresaContratista {
  @ApiProperty({ example: 1, description: 'Identificador único de la empresa contratista' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Juan Sepúlveda', description: 'Nombre del encargado principal' })
  @Column({ type: 'varchar', length: 100 })
  nombre_encargado: string;

  @ApiProperty({ example: 'Constructora Génesis', description: 'Nombre comercial de la empresa' })
  @Column({ type: 'varchar', length: 100 })
  nombre_empresa: string;

  @ApiProperty({ example: '76.543.210-9', description: 'RUT de la empresa', required: false })
@Column({ type: 'varchar', length: 12, nullable: true })
rut: string | null;
  @ApiProperty({ example: 'Construcción y mantenimiento', description: 'Rubro o giro de la empresa', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  rubro?: string;

  @ApiProperty({ example: '+56982736362', description: 'Teléfono de contacto de la empresa', required: false })
  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  @ApiProperty({ example: 'contacto@genesis.cl', description: 'Correo electrónico de contacto', required: false })
  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string;

  @ApiProperty({ description: 'Fecha de ingreso registrada automáticamente al crear la empresa' })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_ingreso: Date;

  @ApiProperty({ description: 'Fecha de término o baja (si aplica)', required: false })
  @Column({ type: 'timestamp', nullable: true })
  fecha_termino: Date | null;

  @ApiProperty({ example: true, description: 'Estado de actividad de la empresa contratista' })
  @Column({ type: 'boolean', default: true })
  activa: boolean;

 
  @OneToMany(() => Guardia, (guardia) => guardia.empresaContratista)
guardias: Guardia[];

@OneToMany(() => PersonalInterno, (personal) => personal.empresa_contratista)
personalInterno: PersonalInterno[];

}
