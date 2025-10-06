import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany, OneToMany } from 'typeorm';
import { EmpresaContratista } from '../empresas-contratistas/empresa-contratista.entity';
import { Usuario } from '../usuarios/usuarios.entity';

@Entity('personal_interno')
export class PersonalInterno {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 12, unique: true })
  rut: string;

  @Column({ length: 100 })
  cargo: string;

  @Column({ default: false })
  empresa_externa: boolean;

  @ManyToOne(() => EmpresaContratista, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_empresa' })
  empresa?: EmpresaContratista;

  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_usuario' })
  usuario?: Usuario;

  @Column({ default: true })
  activo: boolean;
}
