import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { NoAutorizadosService } from './no-autorizados.service';
import { CreateNoAutorizadoDto } from './dto/create-no-autorizado.dto';
import { UpdateNoAutorizadoDto } from './dto/update-no-autorizado.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('No Autorizados')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('no-autorizados')
export class NoAutorizadosController {
  constructor(private readonly service: NoAutorizadosService) {}

  // GET /no-autorizados
  @Get()
  @Roles('administrador', 'guardia')
  @ApiOperation({ summary: 'Listar todos los registros de no autorizados' })
  @ApiResponse({
    status: 200,
    description: 'Listado de no autorizados obtenido correctamente.',
  })
  findAll() {
    return this.service.findAll();
  }

  // GET /no-autorizados/:id
  @Get(':id')
  @Roles('administrador', 'guardia')
  @ApiOperation({ summary: 'Obtener los detalles de un registro de no autorizado' })
  @ApiResponse({ status: 200, description: 'Registro encontrado.' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado.' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  // POST /no-autorizados
  @Post()
  @Roles('guardia', 'administrador')
  @ApiOperation({ summary: 'Registrar un nuevo ingreso no autorizado' })
  @ApiResponse({
    status: 201,
    description: 'Registro de no autorizado creado exitosamente.',
  })
  create(@Body() dto: CreateNoAutorizadoDto) {
    return this.service.create(dto);
  }

  // PUT /no-autorizados/:id
  @Put(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Actualizar información de un registro no autorizado' })
  @ApiResponse({
    status: 200,
    description: 'Registro actualizado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Registro no encontrado.' })
  update(@Param('id') id: number, @Body() dto: UpdateNoAutorizadoDto) {
    return this.service.update(id, dto);
  }

  // DELETE /no-autorizados/:id
  @Delete(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Eliminar un registro de no autorizado' })
  @ApiResponse({
    status: 200,
    description: 'Registro eliminado correctamente.',
  })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
