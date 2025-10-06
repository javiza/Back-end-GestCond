import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuarios.entity';

@Entity('casas')
export class Casa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  direccion: string;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_locatario' })
  locatario: Usuario;
}
