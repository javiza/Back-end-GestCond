import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('empresas_contratistas')
export class EmpresaContratista {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre_encargado: string;

  @Column({ type: 'varchar', length: 100 })
  nombre_empresa: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  rubro: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_ingreso: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_termino: Date;

  @Column({ type: 'boolean', default: true })
  activa: boolean;
}
