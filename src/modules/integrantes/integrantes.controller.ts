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
import { IntegrantesService } from './integrantes.service';
import { CreateIntegranteDto } from './dto/create-integrante.dto';
import { UpdateIntegranteDto } from './dto/update-integrante.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('integrantes')
@ApiBearerAuth()
@Controller('integrantes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IntegrantesController {
  constructor(private readonly service: IntegrantesService) {}

  @Post()
  @Roles('administrador', 'guardia', 'locatario')
  @ApiOperation({ summary: 'Registrar nuevo integrante' })
  create(@Body() dto: CreateIntegranteDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles('administrador', 'guardia')
  @ApiOperation({ summary: 'Listar todos los integrantes' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('administrador', 'guardia', 'locatario')
  @ApiOperation({ summary: 'Obtener un integrante por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles('administrador', 'guardia', 'locatario')
  @ApiOperation({ summary: 'Actualizar datos de un integrante' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIntegranteDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles('administrador', 'guardia')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar integrante' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }
}
