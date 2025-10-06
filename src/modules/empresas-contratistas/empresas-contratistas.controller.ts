import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { EmpresasContratistasService } from './empresas-contratistas.service';
import { CreateEmpresaContratistaDto } from './dto/create-empresa-contratista.dto';
import { UpdateEmpresaContratistaDto } from './dto/update-empresa-contratista.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('empresas-contratistas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmpresasContratistasController {
  constructor(private readonly service: EmpresasContratistasService) {}

  @Roles('administrador')
  @Post()
  create(@Body() dto: CreateEmpresaContratistaDto) { return this.service.create(dto); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(+id); }

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmpresaContratistaDto) { return this.service.update(+id, dto); }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) { return this.service.remove(+id); }
}
