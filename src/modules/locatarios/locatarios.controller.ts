// src/modules/locatarios/locatarios.controller.ts
import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards, HttpCode, HttpStatus, ParseIntPipe, Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LocatariosService } from './locatarios.service';
import { CreateLocatarioDto } from './dto/create-locatario.dto';
import { UpdateLocatarioDto } from './dto/update-locatario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('locatarios')
@ApiBearerAuth()
@Controller('locatarios')
@UseGuards(JwtAuthGuard)
export class LocatariosController {
  constructor(private readonly service: LocatariosService) {}

  @Post()
  @UseGuards(RolesGuard) @Roles('administrador')
  @ApiOperation({ summary: 'Crear locatario (admin)' })
  create(@Body() dto: CreateLocatarioDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard) @Roles('administrador', 'guardia')
  @ApiOperation({ summary: 'Listar locatarios (admin/guardia)' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard) @Roles('administrador', 'guardia')
  @ApiOperation({ summary: 'Obtener locatario por ID (admin/guardia)' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard) @Roles('administrador','locatario')
  @ApiOperation({ summary: 'Actualizar locatario (admin)' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLocatarioDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard) @Roles('administrador')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Baja lógica de locatario (admin)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }

  // ---- Locatario: cambiar su propia contraseña (PWA) ----
  @Put(':id/password')
   @UseGuards(RolesGuard) @Roles('administrador','locatario')
  @ApiOperation({ summary: 'Locatario cambia su contraseña (PWA)' })
  async changeOwnPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body('newPassword') newPassword: string,
    @Req() req: any,
  ) {
    return this.service.changeOwnPassword(id, newPassword, req.user.id);
  }
}
