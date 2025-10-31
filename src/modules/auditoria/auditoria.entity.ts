import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from '../usuarios/usuarios.entity';


 // Entidad: Auditoría
//Registra acciones realizadas sobre otras tablas del sistema.
 //Basada en los triggers definidos en PostgreSQL.
 
@Entity('auditoria')
export class Auditoria {
  @ApiProperty({ example: 1, description: 'Identificador único del registro de auditoría' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'INSERT', description: 'Tipo de acción realizada (INSERT, UPDATE, DELETE)' })
  @Column({ type: 'varchar', length: 50 })
  accion: string;

  @ApiProperty({ example: 'usuarios', description: 'Nombre de la tabla afectada por la acción' })
  @Column({ type: 'varchar', length: 50 })
  tabla_afectada: string;

  @ApiProperty({ example: 3, description: 'ID del usuario que realizó la acción', required: false })
  @Column({ type: 'int', nullable: true })
  id_usuario?: number;

  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_usuario' })
  usuario?: Usuario;

  @ApiProperty({ example: '2025-10-31T21:15:00Z', description: 'Fecha y hora de la acción' })
  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;
}
