import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { CasasService } from './casas.service';
import { CreateCasaDto } from './dto/create-casa.dto';
import { UpdateCasaDto } from './dto/update-casa.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('casas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CasasController {
  constructor(private readonly service: CasasService) {}

  @Roles('administrador')
  @Post()
  create(@Body() dto: CreateCasaDto) {
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

  @Roles('administrador')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCasaDto) {
    return this.service.update(+id, dto);
  }

  @Roles('administrador')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
