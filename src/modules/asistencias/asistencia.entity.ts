import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PersonalInterno } from '../personal-interno/personal-interno.entity';

@Entity('asistencias')
export class Asistencia {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PersonalInterno, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_personal' })
  personal: PersonalInterno;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha: string;

  @Column({ type: 'time', nullable: true })
  hora_entrada?: string;

  @Column({ type: 'time', nullable: true })
  hora_salida?: string;

  @Column({ type: 'text', nullable: true })
  observacion?: string;

  @Column({ default: true })
  presente: boolean;
}
