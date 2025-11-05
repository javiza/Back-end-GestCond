import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { EmpresaContratista } from '../empresas-contratistas/empresa-contratista.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('personal_interno')
export class PersonalInterno {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 12, unique: true })
  rut: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  cargo: string;

  // 🔹 FK explícita
  @ApiProperty({ example: 1, description: 'ID de la empresa contratista asociada' })
  @Column({ type: 'int', name: 'id_empresa_contratista', nullable: true })
  id_empresa_contratista?: number | null;

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp', name: 'fecha_ingreso' })
  fecha_ingreso: Date;

  @ApiProperty()
  @Column({ type: 'timestamp', name: 'fecha_termino', nullable: true })
  fecha_termino: Date | null;

  // 🔹 Relación con la empresa contratista
  @ManyToOne(() => EmpresaContratista, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_empresa_contratista' })
  empresa_contratista?: EmpresaContratista | null;
}
