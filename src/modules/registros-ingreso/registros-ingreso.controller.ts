import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { RegistrosIngresoService } from './registros-ingreso.service';
import { CreateRegistroIngresoDto } from './dto/create-registro-ingreso.dto';
import { UpdateRegistroIngresoDto } from './dto/update-registro-ingreso.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('registros-ingreso')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RegistrosIngresoController {
  constructor(private readonly service: RegistrosIngresoService) {}

  @Roles('guardia','administrador')
  @Post()
  create(@Body() dto: CreateRegistroIngresoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @Roles('guardia','administrador')
  @Patch(':id/salida')
  marcarSalida(@Param('id') id: string, @Body() dto: UpdateRegistroIngresoDto) {
    return this.service.marcarSalida(+id, dto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
