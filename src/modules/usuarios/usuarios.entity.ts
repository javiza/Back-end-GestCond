import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum RolUsuario {
  ADMINISTRADOR = 'administrador',
  GUARDIA = 'guardia',
  LOCATARIO = 'locatario',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Juan Pérez' })
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @ApiProperty({ example: '12345678-9' })
  @Column({
    unique: true,
    type: 'varchar',
    length: 12,
    comment: 'RUT chileno con guion, ej: 12345678-9',
  })
  rut: string;

  @ApiProperty({ example: 'juan@correo.cl' })
  @Column({ unique: true, type: 'varchar', length: 100 })
  email: string;

  @ApiProperty({ example: 'Password123!' })
  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @ApiProperty({ example: 'guardia', enum: RolUsuario })
  @Column({
    type: 'enum',
    enum: RolUsuario,
  })
  rol: RolUsuario;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fecha_creacion: Date;
}
