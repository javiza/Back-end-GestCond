import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { VisitasService } from './visitas.service';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('visitas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VisitasController {
  constructor(private readonly service: VisitasService) {}

  @Roles('administrador','locatario')
  @Post()
  create(@Body() dto: CreateVisitaDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateVisitaDto) {
    return this.service.update(+id, dto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
  @Post(':id/generar-qr')
@Roles('locatario')
generateQR(@Param('id') id: number) {
  return this.service.generarCodigoQR(id);
}

}
