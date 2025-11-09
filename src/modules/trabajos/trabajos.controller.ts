import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { TrabajosService } from './trabajos.service';
import { CreateTrabajoDto } from './dto/create-trabajo.dto';
import { UpdateTrabajoDto } from './dto/update-trabajo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../usuarios/usuarios.entity';

@ApiTags('Trabajos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('trabajos')
export class TrabajosController {
  constructor(private readonly service: TrabajosService) {}

  @Post()
@Roles(RolUsuario.ADMINISTRADOR)
@HttpCode(HttpStatus.CREATED)
@ApiOperation({ summary: 'Registrar nuevo trabajo de personal interno' })
create(@Body() dto: CreateTrabajoDto) {
  return this.service.create(dto);
}

  @Get()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA)
  @ApiOperation({ summary: 'Listar todos los trabajos registrados' })
  @ApiResponse({
    status: 200,
    description: 'Listado de trabajos obtenido correctamente.',
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA)
  @ApiOperation({ summary: 'Obtener detalles de un trabajo específico' })
  @ApiResponse({ status: 200, description: 'Trabajo encontrado.' })
  @ApiResponse({ status: 404, description: 'Trabajo no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Actualizar información de un trabajo' })
  @ApiResponse({
    status: 200,
    description: 'Trabajo actualizado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Trabajo no encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTrabajoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Eliminar un trabajo registrado' })
  @ApiResponse({ status: 200, description: 'Trabajo eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Trabajo no encontrado.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
