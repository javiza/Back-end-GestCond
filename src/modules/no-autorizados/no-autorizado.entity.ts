import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Casa } from '../casas/casa.entity';
import { Usuario } from '../usuarios/usuarios.entity';

@Entity('no_autorizados')
export class NoAutorizado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 12, nullable: true })
  rut: string;

  @ManyToOne(() => Casa, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_casa' })
  casa: Casa;

  @Column({ type: 'text', nullable: true })
  motivo: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_hora: Date;

  @ManyToOne(() => Usuario, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_administrador' })
  administrador: Usuario;
}
