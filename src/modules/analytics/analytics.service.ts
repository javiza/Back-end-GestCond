import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FiltroAnalyticsDto } from './dto/filtro-analytics.dto';


 // Servicio Analytics
 // Consultas sobre la vista materializada analytics.hechos_ingresos.

@Injectable()
export class AnalyticsService {
  constructor(private readonly dataSource: DataSource) {}

  // Total de ingresos agrupados por tipo de visita
  async ingresosPorTipoVisita(filtro: FiltroAnalyticsDto) {
    try {
      let query = `
        SELECT tipo_visita, COUNT(*) AS total
        FROM analytics.hechos_ingresos
        WHERE 1=1
      `;

      if (filtro.desde) query += ` AND fecha_registro >= '${filtro.desde}'`;
      if (filtro.hasta) query += ` AND fecha_registro <= '${filtro.hasta}'`;

      query += ' GROUP BY tipo_visita ORDER BY total DESC;';

      return await this.dataSource.query(query);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al obtener métricas por tipo de visita');
    }
  }

  // Promedio de minutos de estadía por tipo de vehículo
  async promedioEstadiaPorVehiculo(filtro: FiltroAnalyticsDto) {
    try {
      let query = `
        SELECT tipo_vehiculo, ROUND(AVG(minutos_estadia), 2) AS promedio_minutos
        FROM analytics.hechos_ingresos
        WHERE 1=1
      `;

      if (filtro.desde) query += ` AND fecha_registro >= '${filtro.desde}'`;
      if (filtro.hasta) query += ` AND fecha_registro <= '${filtro.hasta}'`;

      query += ' GROUP BY tipo_vehiculo ORDER BY promedio_minutos DESC;';

      return await this.dataSource.query(query);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al obtener promedio de estadía');
    }
  }

  // Tráfico por hora del día
  async ingresosPorHora(filtro: FiltroAnalyticsDto) {
    try {
      let query = `
        SELECT hora_ingreso, COUNT(*) AS total
        FROM analytics.hechos_ingresos
        WHERE 1=1
      `;

      if (filtro.desde) query += ` AND fecha_registro >= '${filtro.desde}'`;
      if (filtro.hasta) query += ` AND fecha_registro <= '${filtro.hasta}'`;

      query += ' GROUP BY hora_ingreso ORDER BY hora_ingreso ASC;';

      return await this.dataSource.query(query);
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener ingresos por hora');
    }
  }

  // Refrescar la vista materializada
  async refrescarVista() {
    try {
      await this.dataSource.query('REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.hechos_ingresos;');
      return { message: 'Vista materializada refrescada correctamente' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error al refrescar la vista materializada');
    }
  }
}
