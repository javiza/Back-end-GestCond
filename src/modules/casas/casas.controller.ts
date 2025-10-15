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
import { CasasService } from './casas.service';
import { CreateCasaDto } from './dto/create-casa.dto';
import { UpdateCasaDto } from './dto/update-casa.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Casas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('casas')
export class CasasController {
  constructor(private readonly service: CasasService) {}

  // GET /casas
  @Get()
  @Roles('administrador', 'guardia')
  @ApiOperation({ summary: 'Listar todas las casas registradas' })
  @ApiResponse({ status: 200, description: 'Casas listadas exitosamente.' })
  findAll() {
    return this.service.findAll();
  }

  // GET /casas/:id
  @Get(':id')
  @Roles('administrador', 'guardia')
  @ApiOperation({ summary: 'Obtener una casa por su ID' })
  @ApiResponse({ status: 200, description: 'Casa encontrada.' })
  @ApiResponse({ status: 404, description: 'Casa no encontrada.' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  // POST /casas
  @Post()
  @Roles('administrador')
  @ApiOperation({ summary: 'Registrar una nueva casa' })
  @ApiResponse({ status: 201, description: 'Casa creada exitosamente.' })
  create(@Body() dto: CreateCasaDto) {
    return this.service.create(dto);
  }

  // PUT /casas/:id
  @Put(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Actualizar una casa existente' })
  @ApiResponse({ status: 200, description: 'Casa actualizada correctamente.' })
  @ApiResponse({ status: 404, description: 'Casa no encontrada.' })
  update(@Param('id') id: number, @Body() dto: UpdateCasaDto) {
    return this.service.update(id, dto);
  }

  // DELETE /casas/:id
  @Delete(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Eliminar una casa del registro' })
  @ApiResponse({ status: 200, description: 'Casa eliminada correctamente.' })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
