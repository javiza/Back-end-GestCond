import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(private readonly dataSource: DataSource) {}

  // Visitas con mayor permanencia
  async visitasMayorEstadia(limit = 20) {
    return this.dataSource.query(`
      SELECT 
        visitante AS nombre,
        rut_visita AS rut,
        casa AS direccion_casa,
        fecha_hora_ingreso,
        fecha_hora_salida,
        ROUND(minutos_estadia, 1) AS minutos_permanencia,
        guardia
      FROM analytics.hechos_ingresos
      WHERE tipo_registro = 'visita'
        AND minutos_estadia IS NOT NULL
      ORDER BY minutos_estadia DESC
      LIMIT $1
    `, [limit]);
  }

  // Guardia con mayor actividad en un mes (rondas + turnos)
  async guardiasActividad(mes: number, anio: number) {
    return this.dataSource.query(`
      WITH actividad AS (
        SELECT
          u.id AS id_guardia,
          u.nombre AS nombre_guardia,
          u.rut AS rut_guardia,
          COALESCE(rn.total_rondas, 0) AS rondas_totales,
          COALESCE(ri.jornadas_dias, 0) AS jornadas_estimadas
        FROM usuarios u
        LEFT JOIN (
          SELECT id_guardia, COUNT(*) AS total_rondas
          FROM rondas
          WHERE EXTRACT(YEAR FROM fecha_inicio) = $2
            AND EXTRACT(MONTH FROM fecha_inicio) = $1
          GROUP BY id_guardia
        ) rn ON rn.id_guardia = u.id
        LEFT JOIN (
          SELECT id_guardia, COUNT(DISTINCT DATE(fecha_hora_ingreso)) AS jornadas_dias
          FROM registros_ingreso
          WHERE EXTRACT(YEAR FROM fecha_hora_ingreso) = $2
            AND EXTRACT(MONTH FROM fecha_hora_ingreso) = $1
          GROUP BY id_guardia
        ) ri ON ri.id_guardia = u.id
        WHERE u.rol = 'guardia'
      )
      SELECT *
      FROM actividad
      ORDER BY rondas_totales DESC, jornadas_estimadas DESC;
    `, [mes, anio]);
  }

  // Deliverys con permanencia > 20 minutos
  async deliverysExcedidos() {
    return this.dataSource.query(`
      SELECT 
        r.nombre,
        r.rut,
        e.nombre_empresa AS empresa,
        r.patente,
        r.tipo_vehiculo,
        r.fecha_hora_ingreso,
        r.fecha_hora_salida,
        ROUND(EXTRACT(EPOCH FROM (r.fecha_hora_salida - r.fecha_hora_ingreso))/60, 1) AS minutos_permanencia
      FROM registros_ingreso r
      LEFT JOIN empresas_contratistas e ON e.id = r.id_personal_externo
      WHERE r.tipo_registro = 'externo'
        AND r.fecha_hora_salida IS NOT NULL
        AND EXTRACT(EPOCH FROM (r.fecha_hora_salida - r.fecha_hora_ingreso))/60 > 20
      ORDER BY minutos_permanencia DESC;
    `);
  }

  // Promedio mensual de ingresos por día de la semana
  async flujoSemanal(mes: number, anio: number) {
    return this.dataSource.query(`
      WITH diarios AS (
        SELECT
          DATE(fecha_hora_ingreso) AS fecha,
          EXTRACT(DOW FROM fecha_hora_ingreso)::int AS dow,
          COUNT(*) AS ingresos_dia
        FROM registros_ingreso
        WHERE EXTRACT(YEAR FROM fecha_hora_ingreso) = $2
          AND EXTRACT(MONTH FROM fecha_hora_ingreso) = $1
        GROUP BY DATE(fecha_hora_ingreso), EXTRACT(DOW FROM fecha_hora_ingreso)
      ),
      promedios AS (
        SELECT
          dow,
          CASE dow
            WHEN 0 THEN 'Domingo'
            WHEN 1 THEN 'Lunes'
            WHEN 2 THEN 'Martes'
            WHEN 3 THEN 'Miércoles'
            WHEN 4 THEN 'Jueves'
            WHEN 5 THEN 'Viernes'
            WHEN 6 THEN 'Sábado'
          END AS dia_semana,
          ROUND(AVG(ingresos_dia), 2) AS promedio_diario
        FROM diarios
        GROUP BY dow
      )
      SELECT dia_semana, promedio_diario
      FROM promedios
      ORDER BY dow;
    `, [mes, anio]);
  }
}
