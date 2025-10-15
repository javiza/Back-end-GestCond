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
import { VisitasService } from './visitas.service';
import { CreateVisitaDto } from './dto/create-visita.dto';
import { UpdateVisitaDto } from './dto/update-visita.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Visitas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('visitas')
export class VisitasController {
  constructor(private readonly service: VisitasService) {}

  // GET /visitas
  @Get()
  @Roles('administrador', 'guardia')
  @ApiOperation({ summary: 'Listar todas las visitas autorizadas' })
  @ApiResponse({
    status: 200,
    description: 'Listado de visitas obtenido con éxito.',
  })
  findAll() {
    return this.service.findAll();
  }

  // GET /visitas/:id
  @Get(':id')
  @Roles('administrador', 'guardia', 'locatario')
  @ApiOperation({ summary: 'Obtener detalles de una visita específica' })
  @ApiResponse({ status: 200, description: 'Visita encontrada.' })
  @ApiResponse({ status: 404, description: 'Visita no encontrada.' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  // POST /visitas
  @Post()
  @Roles('locatario', 'administrador')
  @ApiOperation({ summary: 'Registrar una nueva visita autorizada' })
  @ApiResponse({
    status: 201,
    description: 'Visita registrada exitosamente.',
  })
  create(@Body() dto: CreateVisitaDto) {
    return this.service.create(dto);
  }

  // PUT /visitas/:id
  @Put(':id')
  @Roles('guardia', 'administrador')
  @ApiOperation({ summary: 'Actualizar una visita existente (por ejemplo, marcar salida)' })
  @ApiResponse({
    status: 200,
    description: 'Visita actualizada correctamente.',
  })
  @ApiResponse({ status: 404, description: 'Visita no encontrada.' })
  update(@Param('id') id: number, @Body() dto: UpdateVisitaDto) {
    return this.service.update(id, dto);
  }

  // DELETE /visitas/:id
  @Delete(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Eliminar una visita' })
  @ApiResponse({
    status: 200,
    description: 'Visita eliminada correctamente.',
  })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
