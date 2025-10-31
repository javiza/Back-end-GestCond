import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuarios.entity';
import { AutorizacionQR } from '../autorizacion_qr/autorizacion_qr.entity';

@Entity('registros_ingreso')
export class RegistroIngreso {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación con autorización QR (puede ser null)
  @ManyToOne(() => AutorizacionQR, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_autorizacion_qr' })
  autorizacionQR: AutorizacionQR | null;

  // Guardia responsable
  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_guardia' })
  guardia: Usuario;

  // Fechas
  @CreateDateColumn({
    name: 'fecha_hora_ingreso',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaHoraIngreso: Date;

  @Column({
    name: 'fecha_hora_salida',
    type: 'timestamp',
    nullable: true,
  })
  fechaHoraSalida: Date | null;

  // Datos de visitante / vehículo
  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre: string | null;

  @Column({ type: 'varchar', length: 12, nullable: true })
  rut: string | null;

  @Column({ type: 'varchar', length: 10, nullable: true })
  patente: string | null;

  @Column({
    name: 'tipo_vehiculo',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  tipoVehiculo: 'moto' | 'auto' | null;

  // Persona que autorizó el ingreso
  @Column({
    name: 'autorizado_por',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  autorizadoPor: string;

  // Tipo de visita
  @Column({
    name: 'tipo_visita',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  tipoVisita: 'visita' | 'delivery' | 'trabajador';
}
