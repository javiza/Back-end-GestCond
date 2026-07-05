import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { Casa } from '../casas/casa.entity';
import { Residente } from '../residentes/residente.entity';
import { Familiar } from '../familiares/entities/familiare.entity';

@Entity('vehiculos')
export class Vehiculo {

  @ApiProperty({
    example:1,
    description:'ID del vehículo'
  })
  @PrimaryGeneratedColumn()
  id!:number;

  @ApiProperty({
    example:'ABCD12',
    description:'Patente única'
  })
  @Column({
    type:'varchar',
    length:10,
    unique:true
  })
  patente!:string;

  @ApiProperty({
    example:'Toyota',
    required:false
  })
  @Column({
    type:'varchar',
    length:50,
    nullable:true
  })
  marca?:string;

  @ApiProperty({
    example:'Corolla',
    required:false
  })
  @Column({
    type:'varchar',
    length:50,
    nullable:true
  })
  modelo?:string;

  @ApiProperty({
    example:'Rojo',
    required:false
  })
  @Column({
    type:'varchar',
    length:30,
    nullable:true
  })
  color?:string;

  @ApiProperty({
    example:'camioneta'
  })
  @Column({
    type:'varchar',
    length:20,
    nullable:true
  })
  tipo_vehiculo!:string;

  // CASA

  @ManyToOne(
    ()=>Casa,
    casa=>casa.vehiculos,
    {
      nullable:false,
      onDelete:'CASCADE'
    }
  )
  @JoinColumn({
    name:'id_casa'
  })
  casa!:Casa;

  // RESIDENTE DUEÑO

  @ManyToOne(
    ()=>Residente,
    {
      nullable:true,
      onDelete:'SET NULL'
    }
  )
  @JoinColumn({
    name:'id_residente'
  })
  residente?:Residente | null;

  // FAMILIAR DUEÑO

  @ManyToOne(
    ()=>Familiar,
    {
      nullable:true,
      onDelete:'SET NULL'
    }
  )
  @JoinColumn({
    name:'id_familiar'
  })
  familiar?:Familiar | null;

}