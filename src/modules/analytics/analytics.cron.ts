import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AnalyticsService } from './analytics.service';

@Injectable()
export class AnalyticsCron {
  private readonly logger = new Logger(AnalyticsCron.name);

  constructor(private readonly analyticsService: AnalyticsService) {}

  // Ejecuta cada 10 minutos (ajusta CronExpression a tu necesidad)
  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleRefresh() {
    this.logger.log('Inicio tarea programada: refrescar vista materializada analytics.hechos_ingresos');
    try {
      const res = await this.analyticsService.refrescarVista();
      this.logger.log(`Refresco exitoso: ${JSON.stringify(res)}`);
    } catch (err) {
      this.logger.error('Error al refrescar vista materializada (cron):', err);
    }
  }
}
