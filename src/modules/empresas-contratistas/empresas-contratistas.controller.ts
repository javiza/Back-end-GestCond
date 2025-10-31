import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EmpresasContratistasService } from './empresas-contratistas.service';
import { CreateEmpresaContratistaDto } from './dto/create-empresa-contratista.dto';
import { UpdateEmpresaContratistaDto } from './dto/update-empresa-contratista.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { RolUsuario } from '../usuarios/usuarios.entity';


@ApiTags('Empresas Contratistas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('empresas-contratistas')
export class EmpresasContratistasController {
  constructor(private readonly service: EmpresasContratistasService) {}


  @Get()
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Listar todas las empresas contratistas' })
  @ApiResponse({ status: 200, description: 'Listado obtenido correctamente.' })
  findAll() {
    return this.service.findAll();
  }


  @Get(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Obtener una empresa contratista por ID' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID de la empresa contratista' })
  @ApiResponse({ status: 200, description: 'Empresa encontrada.' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }


  @Post()
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Registrar una nueva empresa contratista' })
  @ApiResponse({ status: 201, description: 'Empresa contratista creada con éxito.' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateEmpresaContratistaDto) {
    return this.service.create(dto);
  }

 
  @Put(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Actualizar información de una empresa contratista' })
  @ApiResponse({ status: 200, description: 'Empresa actualizada correctamente.' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmpresaContratistaDto,
  ) {
    return this.service.update(id, dto);
  }

  // PATCH /empresas-contratistas/:id/estado/:activa
 
  @Patch(':id/estado/:activa')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Activar o desactivar una empresa contratista' })
  @ApiParam({ name: 'activa', type: Boolean, example: true, description: 'true = activa, false = inactiva' })
  @ApiResponse({ status: 200, description: 'Estado de la empresa actualizado correctamente.' })
  toggleActiva(
    @Param('id', ParseIntPipe) id: number,
    @Param('activa') activa: string,
  ) {
    return this.service.toggleActiva(id, activa === 'true');
  }


  //  DELETE /empresas-contratistas/:id
  
  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Eliminar una empresa contratista del sistema' })
  @ApiResponse({ status: 200, description: 'Empresa contratista eliminada.' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
