import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Guardia } from '../guardias/guardia.entity';
import { AutorizacionQR } from '../autorizacion_qr/autorizacion_qr.entity';

@Entity('registros_ingreso')
export class RegistroIngreso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre?: string | null;

  @Column({ type: 'varchar', length: 12, nullable: true })
  rut?: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  patente?: string | null;

  @Column({ name: 'tipo_vehiculo', type: 'varchar', length: 20, nullable: true })
  tipoVehiculo?: string | null;

  @Column({ name: 'autorizado_por', type: 'varchar', length: 100, nullable: false })
  autorizadoPor: string;

  @Column({ name: 'lugar_destino', type: 'varchar', length: 100, nullable: false })
  lugarDestino: string;

  @Column({
    name: 'tipo_visita',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  tipoVisita: 'visita' | 'delivery' | 'trabajador';

  @CreateDateColumn({
    name: 'fecha_hora_ingreso',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaHoraIngreso: Date;

  @Column({ name: 'fecha_hora_salida', type: 'timestamp', nullable: true })
  fechaHoraSalida?: Date | null;

  // 🔹 FK hacia guardias (como en tu tabla)
  @ManyToOne(() => Guardia, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_guardia' })
  guardia: Guardia;

  @ManyToOne(() => AutorizacionQR, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_autorizacion_qr' })
  autorizacionQR?: AutorizacionQR | null;
}
