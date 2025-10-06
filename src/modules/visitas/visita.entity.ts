import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Casa } from '../casas/casa.entity';
import { Usuario } from '../usuarios/usuarios.entity';

@Entity('visitas')
export class Visita {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 12 })
  rut: string;

  @ManyToOne(() => Casa, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_casa' })
  casa: Casa;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'autorizado_por' })
  autorizadoPor: Usuario;

  @Column({ name: 'codigo_qr', unique: true })
  codigo_qr: string;

  @CreateDateColumn({ name: 'fecha_autorizacion' })
  fecha_autorizacion: Date;
}
