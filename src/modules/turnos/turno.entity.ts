import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { PersonalInterno } from '../personal-interno/personal-interno.entity';

@Entity('turnos')
export class Turno {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PersonalInterno, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_personal' })
  personal: PersonalInterno;

  @Column({ type: 'timestamp' })
  fecha_inicio: Date;

  @Column({ type: 'timestamp' })
  fecha_fin: Date;

  @Column({ type: 'varchar' })
  tipo_turno: 'mañana' | 'tarde' | 'noche' | 'especial';
}
