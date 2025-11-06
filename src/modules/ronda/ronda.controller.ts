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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RondasService } from './ronda.service';
import { CreateRondaDto } from './dto/create-ronda.dto';
import { UpdateRondaDto } from './dto/update-ronda.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../usuarios/usuarios.entity';

@ApiTags('Rondas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('rondas')
export class RondasController {
  constructor(private readonly service: RondasService) {}

  @Get()
  @Roles(RolUsuario.GUARDIA, RolUsuario.ADMINISTRADOR)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles(RolUsuario.GUARDIA, RolUsuario.ADMINISTRADOR)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Post()
  @Roles(RolUsuario.GUARDIA)
  create(@Body() dto: CreateRondaDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  @Roles(RolUsuario.GUARDIA, RolUsuario.ADMINISTRADOR)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRondaDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(RolUsuario.ADMINISTRADOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
