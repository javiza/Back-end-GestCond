import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('turnos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TurnosController {
  constructor(private readonly service: TurnosService) {}

  @Roles('administrador')
  @Post()
  create(@Body() dto: CreateTurnoDto) { return this.service.create(dto); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTurnoDto) { return this.service.update(+id, dto); }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
