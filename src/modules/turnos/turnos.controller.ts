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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../usuarios/usuarios.entity';

@ApiTags('Turnos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('turnos')
export class TurnosController {
  constructor(private readonly service: TurnosService) {}

  @Get()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA)
  @ApiOperation({ summary: 'Listar todos los turnos registrados' })
  @ApiResponse({ status: 200, description: 'Listado de turnos obtenido con éxito.' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA)
  @ApiOperation({ summary: 'Obtener detalles de un turno específico' })
  @ApiResponse({ status: 200, description: 'Turno encontrado.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles(RolUsuario.GUARDIA, RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Registrar un nuevo turno' })
  @ApiResponse({ status: 201, description: 'Turno creado exitosamente.' })
  create(@Body() dto: CreateTurnoDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles(RolUsuario.GUARDIA, RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Actualizar los datos de un turno existente' })
  @ApiResponse({ status: 200, description: 'Turno actualizado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTurnoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Eliminar un turno existente' })
  @ApiResponse({ status: 200, description: 'Turno eliminado correctamente.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
