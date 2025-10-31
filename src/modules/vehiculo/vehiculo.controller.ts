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
import { VehiculosService } from './vehiculo.service';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../usuarios/usuarios.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Vehiculo } from './vehiculo.entity';

@ApiTags('Vehículos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vehiculos')
export class VehiculosController {
  constructor(private readonly service: VehiculosService) {}

  @Post()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA)
  @ApiOperation({
    summary: 'Registrar un nuevo vehículo',
    description:
      'Crea un nuevo registro de vehículo asociado a una casa. Solo accesible por administrador o guardia.',
  })
  @ApiBody({ type: CreateVehiculoDto })
  @ApiResponse({ status: 201, description: 'Vehículo creado correctamente.', type: Vehiculo })
  @ApiResponse({ status: 409, description: 'Patente duplicada.' })
  create(@Body() dto: CreateVehiculoDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA)
  @ApiOperation({
    summary: 'Listar todos los vehículos registrados',
    description: 'Devuelve todos los vehículos con su casa asociada.',
  })
  @ApiResponse({ status: 200, description: 'Listado obtenido correctamente.', type: [Vehiculo] })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA, RolUsuario.LOCATARIO)
  @ApiOperation({
    summary: 'Obtener detalles de un vehículo por ID',
    description: 'Retorna la información del vehículo y su casa asociada.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'Identificador numérico del vehículo' })
  @ApiResponse({ status: 200, description: 'Vehículo encontrado.', type: Vehiculo })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA)
  @ApiOperation({
    summary: 'Actualizar los datos de un vehículo existente',
    description:
      'Permite modificar los datos de un vehículo ya registrado. Solo accesible por administrador o guardia.',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateVehiculoDto })
  @ApiResponse({ status: 200, description: 'Vehículo actualizado correctamente.', type: Vehiculo })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVehiculoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un vehículo del sistema (solo administradores)',
    description:
      'Elimina el vehículo especificado por su ID. Esta acción es irreversible y requiere rol administrador.',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 204, description: 'Vehículo eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Vehículo no encontrado.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }
}
