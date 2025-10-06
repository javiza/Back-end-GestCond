import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { VehiculosService } from './vehiculos.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('vehiculos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehiculosController {
  constructor(private readonly service: VehiculosService) {}

  @Roles('administrador','locatario')
  @Post()
  create(@Body() dto: CreateVehiculoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(+id);
  }

  @Roles('administrador','locatario')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVehiculoDto) {
    return this.service.update(+id, dto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
