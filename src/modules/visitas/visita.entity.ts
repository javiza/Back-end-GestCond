import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Usuario } from '../usuarios/usuarios.entity';
import { Casa } from '../casas/casa.entity';

@Entity('visitas')
export class Visita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({
    type: 'varchar',
    length: 12,
  })
  rut: string;

  @ManyToOne(() => Casa, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_casa' })
  casa: Casa;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'autorizado_por' })
  autorizadoPor: Usuario;

  @Column({ type: 'varchar', length: 255, unique: true })
  codigo_qr: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha_autorizacion: Date;
}
