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
import { RondasService } from './ronda.service';
import { CreateRondaDto } from './dto/create-ronda.dto';
import { UpdateRondaDto } from './dto/update-ronda.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Rondas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rondas')
export class RondasController {
  constructor(private readonly service: RondasService) {}

  // GET /rondas
  @Get()
  @Roles('guardia', 'administrador')
  @ApiOperation({ summary: 'Listar todas las rondas registradas' })
  @ApiResponse({
    status: 200,
    description: 'Listado de rondas obtenido con éxito.',
  })
  findAll() {
    return this.service.findAll();
  }

  // GET /rondas/:id
  @Get(':id')
  @Roles('guardia', 'administrador')
  @ApiOperation({ summary: 'Obtener detalles de una ronda específica' })
  @ApiResponse({ status: 200, description: 'Ronda encontrada.' })
  @ApiResponse({ status: 404, description: 'Ronda no encontrada.' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  // POST /rondas
  @Post()
  @Roles('guardia')
  @ApiOperation({ summary: 'Registrar una nueva ronda' })
  @ApiResponse({ status: 201, description: 'Ronda creada exitosamente.' })
  create(@Body() dto: CreateRondaDto) {
    return this.service.create(dto);
  }

  // PUT /rondas/:id
  @Put(':id')
  @Roles('guardia', 'administrador')
  @ApiOperation({ summary: 'Actualizar una ronda existente' })
  @ApiResponse({ status: 200, description: 'Ronda actualizada exitosamente.' })
  @ApiResponse({ status: 404, description: 'Ronda no encontrada.' })
  update(@Param('id') id: number, @Body() dto: UpdateRondaDto) {
    return this.service.update(id, dto);
  }

  // DELETE /rondas/:id
  @Delete(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Eliminar una ronda' })
  @ApiResponse({ status: 200, description: 'Ronda eliminada correctamente.' })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
