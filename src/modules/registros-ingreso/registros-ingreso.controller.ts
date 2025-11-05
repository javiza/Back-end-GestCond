import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Patch,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { RegistrosIngresosService } from './registros-ingreso.service';
import { CreateRegistroIngresoDto } from './dto/create-registro_ingreso.dto';
import { UpdateRegistroIngresoDto } from './dto/update-registro-ingreso.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { RolUsuario } from '../usuarios/usuarios.entity';
import { RegistroIngreso } from './registro-ingreso.entity';

@ApiTags('Registros de Ingreso')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('registros-ingresos')
export class RegistrosIngresosController {
  constructor(private readonly service: RegistrosIngresosService) {}

  @Get()
  @Roles(RolUsuario.GUARDIA)
  async findAll() {
    return await this.service.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.GUARDIA)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.service.findOne(id);
  }

  @Post()
  @Roles(RolUsuario.GUARDIA)
  async create(@Body() dto: CreateRegistroIngresoDto, @Request() req) {
    const usuario = req.user;
    if (!usuario.id_guardia) {
      throw new Error('El usuario autenticado no tiene un guardia asociado');
    }

    dto.id_guardia = usuario.id_guardia;
    return await this.service.create(dto);
  }

  @Put(':id')
  @Roles(RolUsuario.GUARDIA)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRegistroIngresoDto,
  ) {
    return await this.service.update(id, dto);
  }

  @Patch(':id/salida')
  @Roles(RolUsuario.GUARDIA)
  async registrarSalida(@Param('id', ParseIntPipe) id: number) {
    return await this.service.registrarSalida(id);
  }

  @Delete(':id')
  @Roles(RolUsuario.GUARDIA)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }
}
