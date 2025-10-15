import { IsNotEmpty, IsOptional, IsString, IsInt, Matches } from 'class-validator';

export class CreateRegistroIngresoDto {
  @IsOptional()
  @IsInt()
  id_casa?: number;

  @IsOptional()
  @IsInt()
  id_visita?: number;

  @IsOptional()
  @IsInt()
  id_personal_interno?: number;

  @IsOptional()
  @IsInt()
  id_personal_externo?: number;

  @IsNotEmpty()
  @IsInt()
  id_guardia: number;

  @IsNotEmpty()
  @IsString()
  tipo_registro: 'visita' | 'interno' | 'externo';   // ✅ cambia esto

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @Matches(/^[0-9]{7,8}-[0-9kK]$/, { message: 'RUT inválido' })
  rut?: string;

  @IsNotEmpty()
  @IsString()
  observacion: string;

  @IsOptional()
  @IsString()
  patente?: string;

  @IsOptional()
  @IsString()
  tipo_vehiculo?: 'moto' | 'auto';  // ✅ igual aquí
}
