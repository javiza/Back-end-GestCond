import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Casa } from '../casas/casa.entity';
import { Usuario } from '../usuarios/usuarios.entity';


@Entity('residentes')
export class Residente {
 
  @ApiProperty({ example: 1, description: 'Identificador único del residente' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del residente' })
  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre!: string;

  @ApiProperty({ example: '12345678-9', description: 'RUT chileno válido con guion' })
  @Column({
    type: 'varchar',
    length: 12,
    unique: true,
    nullable: false,
    comment: 'Validado con expresión regular en DTO',
  })
  rut!: string;

  @ApiProperty({ example: 'juan.perez@correo.cl', description: 'Correo electrónico del residente' })
  @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
  email!: string;

  @ApiPropertyOptional({ example: '+56 9 9876 5432', description: 'Teléfono del residente' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono?: string;

  @ApiPropertyOptional({ example: true, description: 'Indica si el residente está activo' })
  @Column({ type: 'boolean', default: true })
  activo!: boolean;

  @ApiProperty({
    example: '2025-10-31T18:00:00.000Z',
    description: 'Fecha de creación automática del registro',
  })
  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fecha_creacion!: Date;

  @ApiPropertyOptional({
    type: () => Casa,
    description: 'Casa a la que pertenece el residente (FK opcional)',
  })
  @ManyToOne(() => Casa, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_casa' })
  casa?: Casa;

  @ApiPropertyOptional({
    type: () => Usuario,
    description: 'Usuario del sistema asociado al residente (FK opcional)',
  })
  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_usuario' })
  usuario?: Usuario;
}
