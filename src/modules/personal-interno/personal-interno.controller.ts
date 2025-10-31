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
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PersonalInternoService } from './personal-interno.service';
import { CreatePersonalInternoDto } from './dto/create-personal-interno.dto';
import { UpdatePersonalInternoDto } from './dto/update-personal-interno.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { RolUsuario } from '../usuarios/usuarios.entity';

@ApiTags('Personal Interno')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('personal-interno')
export class PersonalInternoController {
  constructor(private readonly service: PersonalInternoService) {}


  @Get()
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Listar todo el personal interno' })
  @ApiResponse({
    status: 200,
    description: 'Listado de personal interno obtenido correctamente.',
  })
  findAll() {
    return this.service.findAll();
  }


  @Get(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Obtener un registro de personal interno por ID' })
  @ApiResponse({ status: 200, description: 'Registro encontrado.' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }


  @Post()
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Registrar nuevo trabajador interno' })
  @ApiResponse({ status: 201, description: 'Registro creado exitosamente.' })
  create(@Body() dto: CreatePersonalInternoDto) {
    return this.service.create(dto);
  }

  
  @Put(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Actualizar datos de un trabajador interno' })
  @ApiResponse({ status: 200, description: 'Registro actualizado correctamente.' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePersonalInternoDto) {
    return this.service.update(id, dto);
  }

 
  @Patch(':id/activo/:estado')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Activar o desactivar trabajador interno' })
  @ApiResponse({ status: 200, description: 'Estado actualizado correctamente.' })
  toggleActivo(
    @Param('id', ParseIntPipe) id: number,
    @Param('estado') estado: string,
  ) {
    return this.service.toggleActivo(id, estado === 'true');
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar trabajador interno' })
  @ApiResponse({ status: 204, description: 'Registro eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Registro no encontrado.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }
}
