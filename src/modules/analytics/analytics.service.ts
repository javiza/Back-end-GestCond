import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FiltroAnalyticsDto } from './dto/filtro-analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly dataSource: DataSource) {}

  private buildWhereAndParams(filtro: FiltroAnalyticsDto) {
    const clauses: string[] = [];
    const params: any[] = [];

    if (filtro.desde) {
      params.push(filtro.desde);
      clauses.push(`fecha_registro >= $${params.length}`);
    }
    if (filtro.hasta) {
      params.push(filtro.hasta);
      clauses.push(`fecha_registro <= $${params.length}`);
    }
    if (filtro.tipo_visita) {
      params.push(`%${filtro.tipo_visita}%`);
      clauses.push(`tipo_visita ILIKE $${params.length}`);
    }
    if (filtro.tipo_vehiculo) {
      params.push(`%${filtro.tipo_vehiculo}%`);
      clauses.push(`tipo_vehiculo ILIKE $${params.length}`);
    }

    const where = clauses.length ? ' AND ' + clauses.join(' AND ') : '';
    return { where, params };
  }

  // Total de ingresos agrupados por tipo de visita
  async ingresosPorTipoVisita(filtro: FiltroAnalyticsDto) {
    try {
      const { where, params } = this.buildWhereAndParams(filtro);

      const query = `
        SELECT tipo_visita, COUNT(*) AS total
        FROM analytics.hechos_ingresos
        WHERE 1=1 ${where}
        GROUP BY tipo_visita
        ORDER BY total DESC;
      `;

      return await this.dataSource.query(query, params);
    } catch (error) {
      console.error('ingresosPorTipoVisita error', error);
      throw new InternalServerErrorException('Error al obtener métricas por tipo de visita');
    }
  }

  // Promedio de minutos de estadía por tipo de vehículo
  async promedioEstadiaPorVehiculo(filtro: FiltroAnalyticsDto) {
    try {
      const { where, params } = this.buildWhereAndParams(filtro);

      const query = `
        SELECT tipo_vehiculo, ROUND(AVG(minutos_estadia)::numeric, 2) AS promedio_minutos
        FROM analytics.hechos_ingresos
        WHERE 1=1 ${where}
        GROUP BY tipo_vehiculo
        ORDER BY promedio_minutos DESC;
      `;

      return await this.dataSource.query(query, params);
    } catch (error) {
      console.error('promedioEstadiaPorVehiculo error', error);
      throw new InternalServerErrorException('Error al obtener promedio de estadía');
    }
  }

  // Tráfico por hora del día
  async ingresosPorHora(filtro: FiltroAnalyticsDto) {
    try {
      const { where, params } = this.buildWhereAndParams(filtro);

      const query = `
        SELECT hora_ingreso::int AS hora_ingreso, COUNT(*) AS total
        FROM analytics.hechos_ingresos
        WHERE 1=1 ${where}
        GROUP BY hora_ingreso
        ORDER BY hora_ingreso ASC;
      `;

      return await this.dataSource.query(query, params);
    } catch (error) {
      console.error('ingresosPorHora error', error);
      throw new InternalServerErrorException('Error al obtener ingresos por hora');
    }
  }

  // Ingresos diarios (tendencia por fecha)
  async ingresosDiarios(filtro: FiltroAnalyticsDto) {
    try {
      const { where, params } = this.buildWhereAndParams(filtro);

      const query = `
        SELECT fecha_registro, COUNT(*) AS total
        FROM analytics.hechos_ingresos
        WHERE 1=1 ${where}
        GROUP BY fecha_registro
        ORDER BY fecha_registro ASC;
      `;

      return await this.dataSource.query(query, params);
    } catch (error) {
      console.error('ingresosDiarios error', error);
      throw new InternalServerErrorException('Error al obtener ingresos diarios');
    }
  }

  // Refrescar la vista materializada (intenta CONCURRENTLY; si falla, intenta sin CONCURRENTLY)
  async refrescarVista() {
    const queries = [
      'REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.hechos_ingresos;',
      'REFRESH MATERIALIZED VIEW analytics.hechos_ingresos;',
    ];

    for (const q of queries) {
      try {
        await this.dataSource.query(q);
        return { message: `Vista materializada refrescada correctamente (${q.includes('CONCURRENTLY') ? 'concurrent' : 'non-concurrent'})` };
      } catch (err: any) {
        // Si fue el intento CONCURRENTLY y falló, lo ignoramos para intentar la versión no-concurrente
        console.warn(`Intento de REFRESH con query "${q}" falló:`, err?.message ?? err);
        // si es el último intento, lanzamos
        if (q === queries[queries.length - 1]) {
          console.error('refrescarVista error final', err);
          throw new InternalServerErrorException('Error al refrescar la vista materializada');
        }
        // de lo contrario seguimos al siguiente intento
      }
    }
  }
}
