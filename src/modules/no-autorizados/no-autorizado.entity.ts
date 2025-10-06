import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Casa } from '../casas/casa.entity';
import { Usuario } from '../usuarios/usuarios.entity';

@Entity('no_autorizados')
export class NoAutorizado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 12, nullable: true })
  rut?: string;

  @ManyToOne(() => Casa, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'id_casa' })
  casa?: Casa;

  @Column({ type: 'text', nullable: true })
  motivo?: string;

  @CreateDateColumn({ name: 'fecha_hora' })
  fecha_hora: Date;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_guardia' })
  guardia: Usuario;
}
