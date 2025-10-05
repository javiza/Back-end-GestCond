import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';


// Enum para reflejar el CHECK de la base de datos
export enum RolUsuario {
  ADMIN = 'administrador',
  USUARIO = 'usuario',
}

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_usuario', type: 'varchar', length: 100 })
  nombre_usuario: string;

  @Column({
    unique: true,
    type: 'varchar',
    length: 12,
    comment: 'RUT chileno con guion, ej: 12345678-9',
  })
  rut: string;

  @Column({ unique: true, type: 'varchar', length: 100 })
  email: string;

  // No se expone en queries normales (ej: find)
  @Column({ type: 'varchar', length: 255, select: false })
  password: string;

  @Column({ type: 'enum', enum: RolUsuario })
  rol: RolUsuario;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamp' })
  fecha_creacion: Date;

 
}
