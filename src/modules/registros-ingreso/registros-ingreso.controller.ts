import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RegistrosIngresosService } from './registros-ingreso.service';
import { CreateRegistroIngresoDto } from './dto/create-registro_ingreso.dto';
import { UpdateRegistroIngresoDto } from './dto/update-registro-ingreso.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RolUsuario } from '../usuarios/usuarios.entity';
import { RegistroIngreso } from './registro-ingreso.entity';

@ApiTags('Registros de Ingreso')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('registros-ingresos')
export class RegistrosIngresosController {
  constructor(private readonly service: RegistrosIngresosService) {}

  // GET - Listar registros
  @Get()
  @Roles(RolUsuario.GUARDIA)
  @ApiOperation({ summary: 'Listar todos los registros de ingreso' })
  @ApiResponse({
    status: 200,
    description: 'Listado de registros obtenido correctamente.',
    type: [RegistroIngreso],
  })
  async findAll() {
    return await this.service.findAll();
  }

  // GET - Obtener registro por ID
  @Get(':id')
  @Roles(RolUsuario.GUARDIA)
  @ApiOperation({ summary: 'Obtener un registro de ingreso por ID' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Registro encontrado exitosamente.',
    type: RegistroIngreso,
  })
  @ApiResponse({ status: 404, description: 'Registro no encontrado.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findOne(id);
  }

  // POST - Crear registro
  @Post()
  @Roles(RolUsuario.GUARDIA)
  @ApiOperation({ summary: 'Registrar un nuevo ingreso' })
  @ApiBody({ type: CreateRegistroIngresoDto })
  @ApiResponse({ status: 201, description: 'Registro creado exitosamente.' })
  async create(@Body() dto: CreateRegistroIngresoDto) {
    return await this.service.create(dto);
  }

  // PUT - Actualizar registro existente
  @Put(':id')
  @Roles(RolUsuario.GUARDIA)
  @ApiOperation({ summary: 'Actualizar un registro de ingreso existente' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateRegistroIngresoDto })
  @ApiResponse({
    status: 200,
    description: 'Registro actualizado exitosamente.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRegistroIngresoDto,
  ) {
    return await this.service.update(id, dto);
  }

  // PATCH - Registrar salida
  @Patch(':id/salida')
  @Roles(RolUsuario.GUARDIA)
  @ApiOperation({
    summary: 'Registrar salida (marca la hora actual como salida)',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Salida registrada correctamente.',
  })
  async registrarSalida(@Param('id', ParseIntPipe) id: number) {
    return await this.service.registrarSalida(id);
  }

  // DELETE - Eliminar registro (solo si aplica)
  @Delete(':id')
  @Roles(RolUsuario.GUARDIA)
  @ApiOperation({
    summary: 'Eliminar un registro de ingreso',
    description:
      'Elimina completamente un registro (solo si es permitido por políticas del sistema).',
  })
  @ApiResponse({
    status: 204,
    description: 'Registro eliminado correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Registro no encontrado.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }
}
