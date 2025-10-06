import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { IntegrantesService } from './integrantes.service';
import { CreateIntegranteDto } from './dto/create-integrante.dto';
import { UpdateIntegranteDto } from './dto/update-integrante.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('integrantes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IntegrantesController {
  constructor(private readonly service: IntegrantesService) {}

  @Roles('administrador','locatario')
  @Post()
  create(@Body() dto: CreateIntegranteDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateIntegranteDto) {
    return this.service.update(+id, dto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
