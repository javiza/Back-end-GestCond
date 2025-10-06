import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Visita } from '../visitas/visita.entity';
import { Usuario } from '../usuarios/usuarios.entity';

@Entity('registros_ingreso')
export class RegistroIngreso {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Visita, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_visita' })
  visita?: Visita;

  @CreateDateColumn({ name: 'fecha_hora_ingreso' })
  fecha_hora_ingreso: Date;

  @Column({ name: 'fecha_hora_salida', type: 'timestamp', nullable: true })
  fecha_hora_salida?: Date;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_guardia' })
  guardia: Usuario;
}
