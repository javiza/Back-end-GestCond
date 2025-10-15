import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuarios.entity';
import { Visita } from '../visitas/visita.entity';
import { PersonalInterno } from '../personal-interno/personal-interno.entity';
import { EmpresaContratista } from '../empresas-contratistas/empresa-contratista.entity';
import { Casa } from '../casas/casa.entity';

@Entity('registros_ingreso')
export class RegistroIngreso {
  @PrimaryGeneratedColumn()
  id: number;

  // 🔹 Relación con casa
  @ManyToOne(() => Casa, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_casa' })
  casa: Casa;

  // 🔹 Relación con visita
  @ManyToOne(() => Visita, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_visita' })
  visita: Visita;

  // 🔹 Relación con personal interno
  @ManyToOne(() => PersonalInterno, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_personal_interno' })
  personalInterno: PersonalInterno;

  // 🔹 Relación con empresa contratista (personal externo)
  @ManyToOne(() => EmpresaContratista, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_personal_externo' })
  personalExterno: EmpresaContratista;

  // 🔹 Guardia responsable
  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_guardia' })
  guardia: Usuario;

  // 🔹 Fechas
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_hora_ingreso: Date;

  @Column({ type: 'timestamp', nullable: true })
  fecha_hora_salida: Date;

  // 🔹 Tipo de registro
  @Column({
    type: 'varchar',
    length: 20,
  })
  tipo_registro: 'visita' | 'interno' | 'externo';

  // 🔹 Datos adicionales
  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre: string;

  @Column({ type: 'varchar', length: 12, nullable: true })
  rut: string;

  @Column({ type: 'text' })
  observacion: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  patente: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  tipo_vehiculo: 'moto' | 'auto';
}
