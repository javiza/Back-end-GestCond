import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RondasService } from './ronda.service';
import { CreateRondaDto } from './dto/create-ronda.dto';
import { UpdateRondaDto } from './dto/update-ronda.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../usuarios/usuarios.entity';

@ApiTags('Rondas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rondas')
export class RondasController {
  constructor(private readonly service: RondasService) {}

  @Get()
  @Roles(RolUsuario.GUARDIA, RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Listar todas las rondas registradas' })
  @ApiResponse({ status: 200, description: 'Listado de rondas obtenido con éxito.' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.GUARDIA, RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Obtener detalles de una ronda específica' })
  @ApiResponse({ status: 200, description: 'Ronda encontrada.' })
  @ApiResponse({ status: 404, description: 'Ronda no encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles(RolUsuario.GUARDIA)
  @ApiOperation({ summary: 'Registrar una nueva ronda' })
  @ApiResponse({ status: 201, description: 'Ronda creada exitosamente.' })
  create(@Body() dto: CreateRondaDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles(RolUsuario.GUARDIA, RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Actualizar una ronda existente' })
  @ApiResponse({ status: 200, description: 'Ronda actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Ronda no encontrada.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRondaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una ronda (solo administradores)' })
  @ApiResponse({ status: 204, description: 'Ronda eliminada correctamente.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
