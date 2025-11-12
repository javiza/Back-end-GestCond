import { Controller, Get, Query, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { FiltroAnalyticsDto } from './dto/filtro-analytics.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { RolUsuario } from '../usuarios/usuarios.entity';

@ApiTags('Analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly service: AnalyticsService) {}

  @Get('ingresos-por-tipo')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Métricas de ingresos agrupadas por tipo de visita' })
  ingresosPorTipo(@Query() filtro: FiltroAnalyticsDto) {
    return this.service.ingresosPorTipoVisita(filtro);
  }

  @Get('promedio-estadia')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Promedio de minutos de estadía por tipo de vehículo' })
  promedioEstadia(@Query() filtro: FiltroAnalyticsDto) {
    return this.service.promedioEstadiaPorVehiculo(filtro);
  }

  @Get('ingresos-por-hora')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Cantidad de ingresos agrupados por hora del día' })
  ingresosPorHora(@Query() filtro: FiltroAnalyticsDto) {
    return this.service.ingresosPorHora(filtro);
  }

  @Get('ingresos-diarios')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Ingresos totales agrupados por fecha (tendencia diaria)' })
  ingresosDiarios(@Query() filtro: FiltroAnalyticsDto) {
    return this.service.ingresosDiarios(filtro);
  }

  @Post('refrescar')
  @Roles(RolUsuario.ADMINISTRADOR)
  @ApiOperation({ summary: 'Refrescar la vista materializada de hechos_ingresos' })
  @ApiResponse({ status: 200, description: 'Vista refrescada correctamente' })
  refrescarVista() {
    return this.service.refrescarVista();
  }
}
