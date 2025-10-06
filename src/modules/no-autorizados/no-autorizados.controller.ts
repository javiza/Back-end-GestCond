import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { NoAutorizadosService } from './no-autorizados.service';
import { CreateNoAutorizadoDto } from './dto/create-no-autorizado.dto';
import { UpdateNoAutorizadoDto } from './dto/update-no-autorizado.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('no-autorizados')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NoAutorizadosController {
  constructor(private readonly service: NoAutorizadosService) {}

  @Roles('guardia','administrador')
  @Post()
  create(@Body() dto: CreateNoAutorizadoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateNoAutorizadoDto) {
    return this.service.update(+id, dto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
