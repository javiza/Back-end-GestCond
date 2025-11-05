import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Usuario } from '../usuarios/usuarios.entity';

@Entity('autorizacion_qr')
export class AutorizacionQR {
  @ApiProperty({ example: 1, description: 'Identificador único del registro de autorización QR.' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'QR-ABCD1234',
    description: 'Código QR único asociado a la autorización de acceso.',
  })
  @Column({ name: 'codigo_qr', type: 'varchar', length: 255, unique: true })
  codigo_qr: string;

  @ApiProperty({
    example: 'Juan Gómez',
    description: 'Nombre de la persona o visita autorizada.',
  })
  @Column({ name: 'nombre_visita', type: 'varchar', length: 100, nullable: false })
  nombre_visita: string;

  @ApiPropertyOptional({
    example: 'Ingreso autorizado para delivery',
    description: 'Motivo o contexto de la autorización (opcional).',
  })
  @Column({ type: 'text', nullable: true })
  motivo?: string | null;

  @ApiProperty({
    example: '2025-10-31T23:00:00.000Z',
    description: 'Fecha y hora en que se creó o validó el QR.',
  })
  @CreateDateColumn({
    name: 'fecha_hora',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha_hora: Date;

  @ApiPropertyOptional({
    type: () => Usuario,
    description: 'Usuario (administrador o locatario) que generó o validó el QR.',
  })
  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_usuario' })
  usuario?: Usuario | null;
}
