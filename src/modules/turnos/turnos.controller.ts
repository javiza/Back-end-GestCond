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
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { CerrarTurnoDto } from './dto/cerrar-turno.dto';
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

  //  Listar todos los turnos
  @Get()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA)
  @ApiOperation({ summary: 'Listar todos los turnos registrados' })
  @ApiResponse({
    status: 200,
    description: 'Listado de turnos obtenido con éxito.',
  })
  findAll() {
    return this.service.findAll();
  }

  // Obtener un turno específico
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
@ApiOperation({ summary: 'Registrar el inicio de un nuevo turno' })
@ApiResponse({ status: 201, description: 'Turno iniciado exitosamente.' })
create(@Body() dto: CreateTurnoDto) {
  return this.service.create(dto); // usa el que viene del front
}

  //  Registrar término del turno (observación de salida)
  @Put(':id/cerrar')
  @Roles(RolUsuario.GUARDIA, RolUsuario.ADMINISTRADOR)
  @ApiOperation({
    summary: 'Registrar la finalización de un turno',
    description:
      'Actualiza el registro del turno con observación de término y fecha de cierre automática.',
  })
  @ApiResponse({ status: 200, description: 'Turno cerrado exitosamente.' })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  cerrarTurno(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CerrarTurnoDto,
  ) {
    return this.service.cerrarTurno(id, dto);
  }

  // Actualizar turno (uso administrativo)
  @Put(':id')
  @Roles(RolUsuario.GUARDIA, RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Actualizar los datos de un turno existente' })
  @ApiResponse({
    status: 200,
    description: 'Turno actualizado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Turno no encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTurnoDto) {
    return this.service.update(id, dto);
  }

  // Eliminar turno
  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Eliminar un turno existente' })
  @ApiResponse({
    status: 200,
    description: 'Turno eliminado correctamente.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
