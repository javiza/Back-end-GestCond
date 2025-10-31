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
import { ResidentesService } from './residentes.service';
import { CreateResidenteDto } from './dto/create-residente.dto';
import { UpdateResidenteDto } from './dto/update-residente.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../usuarios/usuarios.entity';

@ApiTags('Residentes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('residentes')
export class ResidentesController {
  constructor(private readonly service: ResidentesService) {}

  @Post()
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Registrar un nuevo residente' })
  @ApiResponse({ status: 201, description: 'Residente creado correctamente.' })
  create(@Body() dto: CreateResidenteDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA)
  @ApiOperation({ summary: 'Listar todos los residentes del condominio' })
  @ApiResponse({ status: 200, description: 'Listado de residentes obtenido correctamente.' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA)
  @ApiOperation({ summary: 'Obtener un residente específico por su ID' })
  @ApiResponse({ status: 200, description: 'Residente encontrado.' })
  @ApiResponse({ status: 404, description: 'Residente no encontrado.' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Actualizar los datos de un residente' })
  @ApiResponse({ status: 200, description: 'Residente actualizado correctamente.' })
  @ApiResponse({ status: 404, description: 'Residente no encontrado.' })
  update(@Param('id') id: number, @Body() dto: UpdateResidenteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Eliminar un residente del registro' })
  @ApiResponse({ status: 200, description: 'Residente eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Residente no encontrado.' })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
