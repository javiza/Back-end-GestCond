import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Usuario } from '../usuarios/usuarios.entity';
import { Vehiculo } from '../vehiculo/vehiculo.entity';
import { Integrante } from '../integrantes/integrante.entity';
import { Visita } from '../visitas/visita.entity';

@Entity('casas')
export class Casa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 6, unique: true })
  numero: string;

  @Column({ type: 'varchar', length: 150 })
  direccion: string;

  @OneToMany(() => Usuario, (usuario) => usuario.id)
  usuarios: Usuario[];

  @OneToMany(() => Vehiculo, (vehiculo) => vehiculo.id)
  vehiculos: Vehiculo[];

  @OneToMany(() => Integrante, (integrante) => integrante.id)
  integrantes: Integrante[];

  @OneToMany(() => Visita, (visita) => visita.id)
  visitas: Visita[];
}
