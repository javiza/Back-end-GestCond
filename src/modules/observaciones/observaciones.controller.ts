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
import { ObservacionesService } from './observaciones.service';
import { CreateObservacionDto } from './dto/create-observacione.dto';
import { UpdateObservacionDto } from './dto/update-observacione.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Observaciones')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('observaciones')
export class ObservacionesController {
  constructor(private readonly service: ObservacionesService) {}

  // GET /observaciones
  @Get()
  @Roles('guardia', 'administrador')
  @ApiOperation({ summary: 'Listar todas las observaciones registradas' })
  @ApiResponse({
    status: 200,
    description: 'Listado de observaciones obtenido con éxito.',
  })
  findAll() {
    return this.service.findAll();
  }

  // GET /observaciones/:id
  @Get(':id')
  @Roles('guardia', 'administrador')
  @ApiOperation({ summary: 'Obtener una observación específica' })
  @ApiResponse({ status: 200, description: 'Observación encontrada.' })
  @ApiResponse({ status: 404, description: 'Observación no encontrada.' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  // POST /observaciones
  @Post()
  @Roles('guardia')
  @ApiOperation({ summary: 'Registrar una nueva observación (guardia)' })
  @ApiResponse({
    status: 201,
    description: 'Observación creada exitosamente.',
  })
  create(@Body() dto: CreateObservacionDto) {
    return this.service.create(dto);
  }

  // PUT /observaciones/:id
  @Put(':id')
  @Roles('guardia', 'administrador')
  @ApiOperation({ summary: 'Actualizar una observación existente' })
  @ApiResponse({
    status: 200,
    description: 'Observación actualizada exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Observación no encontrada.' })
  update(@Param('id') id: number, @Body() dto: UpdateObservacionDto) {
    return this.service.update(id, dto);
  }

  // DELETE /observaciones/:id
  @Delete(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Eliminar una observación (solo administrador)' })
  @ApiResponse({
    status: 200,
    description: 'Observación eliminada correctamente.',
  })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
