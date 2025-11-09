import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Usuario } from '../usuarios/usuarios.entity';
import { EmpresaContratista } from '../empresas-contratistas/empresa-contratista.entity';

@Index('idx_guardias_rut', ['rut'])
@Entity('guardias')
export class Guardia {
  @ApiProperty({ example: 1, description: 'Identificador único del guardia' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Carlos Pérez', description: 'Nombre completo del guardia' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @ApiProperty({ example: '12345678-9', description: 'RUT chileno válido con guion' })
  @Column({
    type: 'varchar',
    length: 12,
    unique: true,
    nullable: false,
    comment: 'RUT chileno validado con expresión regular en DTO',
  })
  rut: string;

  @ApiPropertyOptional({
    example: '+56912345678',
    description: 'Teléfono del guardia (opcional)',
  })
  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string | null;

  @ApiPropertyOptional({
    example: 'carlos.perez@correo.cl',
    description: 'Correo electrónico del guardia (opcional)',
  })
  @Column({ type: 'varchar', length: 100, nullable: true })
  email?: string | null;

  @ApiProperty({ example: true, description: 'Indica si el guardia está activo en el sistema' })
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @ApiProperty({
    example: '2025-11-04T15:00:00.000Z',
    description: 'Fecha de creación automática del registro',
  })
  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fecha_creacion: Date;

  // FK opcional a usuarios (columna id_usuario NULLABLE en BD)
  @ApiPropertyOptional({ type: () => Usuario })
  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_usuario' })
  usuario?: Usuario | null;

  // FK opcional a empresas_contratistas (columna id_empresa_contratista NULLABLE en BD)
  @ApiPropertyOptional({ type: () => EmpresaContratista })
  @ManyToOne(() => EmpresaContratista, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_empresa_contratista' })
  empresaContratista?: EmpresaContratista | null;
}
