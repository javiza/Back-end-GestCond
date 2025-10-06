import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Casa } from '../casas/casa.entity';
import { Usuario } from '../usuarios/usuarios.entity';
import { Integrante } from '../integrantes/integrante.entity';

@Entity('vehiculos')
export class Vehiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 10, unique: true })
  patente: string;

  @Column({ length: 50, nullable: true })
  marca?: string;

  @Column({ length: 50, nullable: true })
  modelo?: string;

  @Column({ length: 30, nullable: true })
  color?: string;

  @Column({ type: 'varchar', default: 'locatario' })
  tipo_propietario: 'locatario' | 'integrante';

  @ManyToOne(() => Casa, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_casa' })
  casa: Casa;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_locatario' })
  locatario: Usuario;

  @ManyToOne(() => Integrante, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_integrante' })
  integrante?: Integrante;
}
