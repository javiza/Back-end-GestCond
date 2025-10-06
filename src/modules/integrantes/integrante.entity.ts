import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from '../usuarios/usuarios.entity';
import { Casa } from '../casas/casa.entity';
import { Vehiculo } from '../vehiculos/vehiculo.entity';

@Entity('integrantes')
export class Integrante {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 50 })
  parentesco: string;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_locatario' })
  locatario: Usuario;

  @ManyToOne(() => Casa, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_casa' })
  casa: Casa;

  @OneToMany(() => Vehiculo, v => v.integrante)
  vehiculos: Vehiculo[];
}
