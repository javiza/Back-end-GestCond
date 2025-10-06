import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('empresas_contratistas')
export class EmpresaContratista {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_empresa', length: 100 })
  nombre_empresa: string;

  @Column({ length: 100, nullable: true })
  rubro?: string;

  @Column({ length: 20, nullable: true })
  telefono?: string;

  @Column({ length: 100, nullable: true })
  email?: string;

  @Column({ default: true })
  activa: boolean;
}
