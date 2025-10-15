import { 
  Controller, 
  Get, 
  Query, 
  UseGuards 
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('analytics')
@ApiBearerAuth()
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  // Visitas con mayor estadía
  @Get('visitas-mayor-estadia')
  @Roles('administrador', 'guardia')
  @ApiOperation({ summary: 'Lista de visitas con mayor permanencia en el condominio' })
  async getVisitasMayorEstadia(@Query('limit') limit = 20) {
    return this.analyticsService.visitasMayorEstadia(Number(limit));
  }

  // Guardia con mayor actividad (por mes)
  @Get('guardias-actividad')
  @Roles('administrador')
  @ApiOperation({ summary: 'Actividad de guardias por mes (rondas y turnos)' })
  @ApiQuery({ name: 'mes', required: true, example: 1 })
  @ApiQuery({ name: 'anio', required: true, example: 2025 })
  async getGuardiasActividad(@Query('mes') mes: number, @Query('anio') anio: number) {
    return this.analyticsService.guardiasActividad(Number(mes), Number(anio));
  }

  // Deliverys con permanencia mayor a 20 minutos
  @Get('deliverys-excedidos')
  @Roles('administrador', 'guardia')
  @ApiOperation({ summary: 'Lista de deliverys con permanencia mayor a 20 minutos' })
  async getDeliverysExcedidos() {
    return this.analyticsService.deliverysExcedidos();
  }

  //Flujo semanal promedio de ingresos
  @Get('flujo-semanal')
  @Roles('administrador', 'guardia')
  @ApiOperation({ summary: 'Promedio mensual de ingresos por día de la semana' })
  @ApiQuery({ name: 'mes', required: true, example: 1 })
  @ApiQuery({ name: 'anio', required: true, example: 2025 })
  async getFlujoSemanal(@Query('mes') mes: number, @Query('anio') anio: number) {
    return this.analyticsService.flujoSemanal(Number(mes), Number(anio));
  }
}
