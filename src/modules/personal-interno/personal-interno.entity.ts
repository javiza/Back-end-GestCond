import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { EmpresaContratista } from './../empresas-contratistas/empresa-contratista.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('personal_interno')
export class PersonalInterno {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Juan Sepúlveda' })
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @ApiProperty({ example: '12345678-9' })
  @Column({ type: 'varchar', length: 12, unique: true })
  rut: string;

  @ApiProperty({ example: 'Técnico de mantenimiento' })
  @Column({ type: 'varchar', length: 100 })
  cargo: string;

  @ApiProperty({ example: true })
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @ApiProperty({ example: '2025-10-31T20:00:00Z' })
  @CreateDateColumn({ type: 'timestamp', name: 'fecha_ingreso', default: () => 'CURRENT_TIMESTAMP' })
  fecha_ingreso: Date;

  @ApiProperty({ example: null })
  @Column({ type: 'timestamp', name: 'fecha_termino', nullable: true })
  fecha_termino: Date | null;

  @ManyToOne(() => EmpresaContratista, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_empresa_contratista' })
  @ApiProperty({ type: () => EmpresaContratista, required: false })
  empresa_contratista?: EmpresaContratista | null;
}
