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
import { PersonalInternoService } from './personal-interno.service';
import { CreatePersonalInternoDto } from './dto/create-personal-interno.dto';
import { UpdatePersonalInternoDto } from './dto/update-personal-interno.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Personal Interno')
@ApiBearerAuth() // Activa el botón Authorize en Swagger
@UseGuards(JwtAuthGuard, RolesGuard) //  Aplica autenticación + control de rol
@Controller('personal-interno')
export class PersonalInternoController {
  constructor(private readonly service: PersonalInternoService) {}

  // GET /personal-interno
  @Get()
  @Roles('administrador')
  @ApiOperation({ summary: 'Listar todo el personal interno' })
  @ApiResponse({ status: 200, description: 'Listado de personal interno obtenido correctamente.' })
  findAll() {
    return this.service.findAll();
  }

  // GET /personal-interno/:id
  @Get(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Obtener un registro de personal interno por ID' })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  // POST /personal-interno
  @Post()
  @Roles('administrador')
  @ApiOperation({ summary: 'Crear nuevo registro de personal interno' })
  create(@Body() dto: CreatePersonalInternoDto) {
    return this.service.create(dto);
  }

  // PUT /personal-interno/:id
  @Put(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Actualizar un registro de personal interno' })
  update(@Param('id') id: number, @Body() dto: UpdatePersonalInternoDto) {
    return this.service.update(id, dto);
  }

  //  PATCH /personal-interno/:id/activo/:estado
  @Patch(':id/activo/:estado')
  @Roles('administrador')
  @ApiOperation({ summary: 'Activar o desactivar personal interno' })
  toggleActivo(@Param('id') id: number, @Param('estado') estado: string) {
    return this.service.toggleActivo(id, estado === 'true');
  }

  //  DELETE /personal-interno/:id
  @Delete(':id')
  @Roles('administrador')
  @ApiOperation({ summary: 'Eliminar registro de personal interno' })
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
