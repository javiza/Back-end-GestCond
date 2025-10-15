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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('vehiculos')
@ApiBearerAuth()
@Controller('vehiculos')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehiculosController {
  constructor(private readonly service: VehiculosService) {}

  @Post()
  @Roles('administrador', 'guardia')
  @ApiOperation({ summary: 'Registrar nuevo vehículo' })
  create(@Body() dto: CreateVehiculoDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('administrador', 'guardia')
  @ApiOperation({ summary: 'Listar todos los vehículos' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('administrador', 'guardia', 'locatario')
  @ApiOperation({ summary: 'Obtener un vehículo por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles('administrador', 'guardia')
  @ApiOperation({ summary: 'Actualizar vehículo existente' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateVehiculoDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('administrador')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar vehículo (solo administrador)' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }
}
