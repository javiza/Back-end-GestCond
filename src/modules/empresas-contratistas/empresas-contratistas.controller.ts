import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EmpresasContratistasService } from './empresas-contratistas.service';
import { CreateEmpresaContratistaDto } from './dto/create-empresa-contratista.dto';
import { UpdateEmpresaContratistaDto } from './dto/update-empresa-contratista.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Empresas Contratistas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('empresas-contratistas')
export class EmpresasContratistasController {
  constructor(private readonly service: EmpresasContratistasService) {}

  // GET /empresas-contratistas
  @Get()
  @Roles('administrador')
  @ApiOperation({ summary: 'Listar todas las empresas contratistas' })
  @ApiResponse({ status: 200, description: 'Listado obtenido correctamente.' })
  findAll() {
    return this.service.findAll();
  }

  // GET /empresas-contratistas/:id
  @Get(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Obtener una empresa contratista por ID' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada.' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  // POST /empresas-contratistas
  @Post()
  @Roles('administrador')
  @ApiOperation({ summary: 'Registrar una nueva empresa contratista' })
  @ApiResponse({ status: 201, description: 'Empresa contratista creada con éxito.' })
  create(@Body() dto: CreateEmpresaContratistaDto) {
    return this.service.create(dto);
  }

  // PUT /empresas-contratistas/:id
  @Put(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Actualizar información de una empresa contratista' })
  update(@Param('id') id: number, @Body() dto: UpdateEmpresaContratistaDto) {
    return this.service.update(id, dto);
  }

  // PATCH /empresas-contratistas/:id/estado/:activa
  @Patch(':id/estado/:activa')
  @Roles('administrador')
  @ApiOperation({ summary: 'Activar o desactivar una empresa contratista' })
  toggleActiva(@Param('id') id: number, @Param('activa') activa: string) {
    return this.service.toggleActiva(id, activa === 'true');
  }

  // DELETE /empresas-contratistas/:id
  @Delete(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Eliminar una empresa contratista' })
  @ApiResponse({ status: 200, description: 'Empresa contratista eliminada.' })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
