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

  // Entidad: Guardia
@Index('idx_guardias_rut', ['rut'])
@Index('idx_guardias_email', ['email'])
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
    comment: 'RUT chileno, validado con expresión regular en DTO',
  })
  rut: string;

  @ApiProperty({ example: 'carlos.perez@correo.cl', description: 'Correo del guardia' })
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  email: string;

  @ApiProperty({ example: true, description: 'Indica si el guardia está activo en el sistema' })
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @ApiProperty({ example: '2025-10-30T22:00:00.000Z', description: 'Fecha de creación automática' })
  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fecha_creacion: Date;

 
  @ApiPropertyOptional({
    type: () => Usuario,
    description: 'Usuario del sistema asociado al guardia (FK opcional)',
  })
  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_usuario' })
  usuario?: Usuario;

  @ApiPropertyOptional({
    type: () => EmpresaContratista,
    description: 'Empresa contratista a la que pertenece el guardia (FK opcional)',
  })
  @ManyToOne(() => EmpresaContratista, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_empresa_contratista' })
  empresaContratista?: EmpresaContratista;
}
