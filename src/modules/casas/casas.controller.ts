import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CasasService } from './casas.service';
import { CreateCasaDto } from './dto/create-casa.dto';
import { UpdateCasaDto } from './dto/update-casa.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../usuarios/usuarios.entity';

@ApiTags('Casas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('casas')
export class CasasController {
  constructor(private readonly service: CasasService) {}

 
  @Get()
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA)
  @ApiOperation({ summary: 'Listar todas las casas registradas' })
  @ApiResponse({ status: 200, description: 'Listado de casas obtenido correctamente.' })
  findAll() {
    return this.service.findAll();
  }

 
  @Get(':id')
  @Roles(RolUsuario.ADMINISTRADOR, RolUsuario.GUARDIA)
  @ApiOperation({ summary: 'Obtener detalles de una casa específica' })
  @ApiParam({ name: 'id', example: 1, description: 'ID numérico de la casa' })
  @ApiResponse({ status: 200, description: 'Casa encontrada correctamente.' })
  @ApiResponse({ status: 404, description: 'Casa no encontrada.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }


  @Post()
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Registrar una nueva casa' })
  @ApiBody({ type: CreateCasaDto })
  @ApiResponse({ status: 201, description: 'Casa creada exitosamente.' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCasaDto) {
    return this.service.create(dto);
  }

 
  @Put(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Actualizar los datos de una casa existente' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdateCasaDto })
  @ApiResponse({ status: 200, description: 'Casa actualizada correctamente.' })
  @ApiResponse({ status: 404, description: 'Casa no encontrada.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCasaDto) {
    return this.service.update(id, dto);
  }


  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({
    summary: 'Eliminar una casa del registro (acción solo para administradores)',
  })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 204, description: 'Casa eliminada correctamente.' })
  @ApiResponse({ status: 404, description: 'Casa no encontrada.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }
}
