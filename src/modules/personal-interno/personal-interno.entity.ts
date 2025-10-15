import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { EmpresaContratista } from '../empresas-contratistas/empresa-contratista.entity';
import { Usuario } from '../usuarios/usuarios.entity';

@Entity('personal_interno')
export class PersonalInterno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 12,
    unique: true,
  })
  rut: string;

  @Column({ type: 'varchar', length: 100 })
  cargo: string;

  @Column({ type: 'boolean', default: false })
  empresa_externa: boolean;

  @ManyToOne(() => EmpresaContratista, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_empresa' })
  empresa: EmpresaContratista;

  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_administrador' })
  administrador: Usuario;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_ingreso: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_termino: Date;
}
