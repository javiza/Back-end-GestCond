import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { GuardiasService } from './guardias.service';
import { CreateGuardiaDto } from './dto/create-guardia.dto';
import { UpdateGuardiaDto } from './dto/update-guardia.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../usuarios/usuarios.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Guardia } from './guardia.entity';

@ApiTags('Guardias')
@ApiBearerAuth()
@Controller('guardias')
@UseGuards(JwtAuthGuard) //Protección JWT global para todo el controlador
export class GuardiasController {
  constructor(private readonly guardiasService: GuardiasService) {}


  @Post()
  @UseGuards(RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({
    summary: 'Registrar nuevo guardia (solo administradores)',
    description:
      'Crea un nuevo guardia, validando integridad y relaciones con usuario y empresa contratista.',
  })
  @ApiBody({ type: CreateGuardiaDto })
  @ApiResponse({ status: 201, description: 'Guardia creado exitosamente.', type: Guardia })
  @ApiResponse({ status: 409, description: 'RUT o correo ya existen.' })
  @ApiResponse({ status: 403, description: 'No autorizado para esta acción.' })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateGuardiaDto): Promise<Guardia> {
    return await this.guardiasService.create(dto);
  }

 
  @Get()
  @UseGuards(RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA)
  @ApiOperation({
    summary: 'Listar guardias activos',
    description: 'Devuelve un listado de todos los guardias registrados y sus relaciones.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de guardias obtenido correctamente.',
    type: [Guardia],
  })
  async findAll(): Promise<Guardia[]> {
    return await this.guardiasService.findAll();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA)
  @ApiOperation({
    summary: 'Obtener detalles de un guardia por ID',
    description:
      'Devuelve información detallada del guardia incluyendo empresa contratista y usuario asociado.',
  })
  @ApiParam({ name: 'id', example: 1, description: 'ID del guardia a consultar' })
  @ApiResponse({ status: 200, description: 'Guardia encontrado.', type: Guardia })
  @ApiResponse({ status: 404, description: 'Guardia no encontrado.' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Guardia> {
    return await this.guardiasService.findOne(id);
  }


  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({
    summary: 'Actualizar datos de un guardia (solo administradores)',
    description:
      'Permite modificar datos personales o reasignar empresa/usuario asociados a un guardia.',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateGuardiaDto })
  @ApiResponse({ status: 200, description: 'Guardia actualizado correctamente.', type: Guardia })
  @ApiResponse({ status: 404, description: 'Guardia no encontrado.' })
  @ApiResponse({ status: 409, description: 'RUT o correo ya existen.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateGuardiaDto,
  ): Promise<Guardia> {
    return await this.guardiasService.update(id, dto);
  }

 
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({
    summary: 'Desactivar guardia (baja lógica)',
    description:
      'Desactiva el registro del guardia cambiando su estado "activo" a false. Mantiene el historial.',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 204, description: 'Guardia desactivado correctamente.' })
  @ApiResponse({ status: 404, description: 'Guardia no encontrado.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.guardiasService.remove(id);
  }
}
