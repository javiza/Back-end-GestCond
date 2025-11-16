-- ============================================================
-- SISTEMA DE CONDOMINIO HABITACIONAL - BASE DE DATOS FINAL
-- ============================================================

-- Seleccionar BD activa
SELECT current_database();

-- ============================================================
-- 1. TABLA: CASAS
-- ============================================================
CREATE TABLE casas (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(6) NOT NULL UNIQUE,
  direccion VARCHAR(150) NOT NULL
);
SHOW TIMEZONE;
SELECT NOW();
UPDATE registros_ingreso
SET fecha_hora_ingreso = fecha_hora_salida - INTERVAL '30 minutes'
WHERE fecha_hora_salida < fecha_hora_ingreso;



-- ============================================================
-- 2. TABLA: USUARIOS
-- ============================================================
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  rut VARCHAR(12) UNIQUE NOT NULL CHECK (rut ~ '^[0-9]{7,8}-[0-9kK]$'),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) CHECK (rol IN ('administrador','guardia','locatario')) NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_usuarios_email ON usuarios(email);

-- ============================================================
-- 3. TABLA: RESIDENTES
-- ============================================================
CREATE TABLE residentes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  rut VARCHAR(12) UNIQUE NOT NULL CHECK (rut ~ '^[0-9]{7,8}-[0-9kK]$'),
  email VARCHAR(100) UNIQUE NOT NULL,
  telefono VARCHAR(20),
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_casa INT NULL,
  id_usuario INT NULL,
  FOREIGN KEY (id_casa) REFERENCES casas(id) ON DELETE SET NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ============================================================
-- 4. TABLA: EMPRESAS CONTRATISTAS
-- ============================================================
CREATE TABLE empresas_contratistas (
  id SERIAL PRIMARY KEY,
  nombre_encargado VARCHAR(100) NOT NULL,
  nombre_empresa VARCHAR(100) NOT NULL,
  rut VARCHAR(12) UNIQUE NOT NULL CHECK (rut ~ '^[0-9]{7,8}-[0-9kK]$'),
  rubro VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(100),
  fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_termino TIMESTAMP,
  activa BOOLEAN DEFAULT TRUE
);

-- ============================================================
-- 5. TABLA: GUARDIAS
-- ============================================================
CREATE TABLE guardias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  rut VARCHAR(12) UNIQUE NOT NULL CHECK (rut ~ '^[0-9]{7,8}-[0-9kK]$'),
  telefono VARCHAR(20),
  email VARCHAR(100),
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_usuario INT NULL,
  id_empresa_contratista INT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (id_empresa_contratista) REFERENCES empresas_contratistas(id) ON DELETE SET NULL
);

-- ============================================================
-- 6. TABLA: VEHICULOS
-- ============================================================
CREATE TABLE vehiculos (
  id SERIAL PRIMARY KEY,
  nombre_dueno VARCHAR(100) NOT NULL,
  patente VARCHAR(10) UNIQUE NOT NULL,
  marca VARCHAR(50),
  modelo VARCHAR(50),
  color VARCHAR(30),
  tipo_vehiculo VARCHAR(20),
  id_casa INT NOT NULL,
  FOREIGN KEY (id_casa) REFERENCES casas(id) ON DELETE CASCADE
);

-- ============================================================
-- 7. TABLA: PERSONAL INTERNO
-- ============================================================
CREATE TABLE personal_interno (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  rut VARCHAR(12) UNIQUE NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  id_empresa_contratista INT NULL,
  activo BOOLEAN DEFAULT TRUE,
  fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_termino TIMESTAMP,
  FOREIGN KEY (id_empresa_contratista) REFERENCES empresas_contratistas(id) ON DELETE SET NULL
);

-- ============================================================
-- 8. TABLA: TRABAJOS
-- ============================================================
CREATE TABLE trabajos (
  id SERIAL PRIMARY KEY,
  trabajo_realizado VARCHAR(100) NOT NULL,
  fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_termino TIMESTAMP,
  id_personal_interno INT NOT NULL,
  FOREIGN KEY (id_personal_interno) REFERENCES personal_interno(id) ON DELETE CASCADE
);

-- ============================================================
-- 9. TABLA: TURNOS
-- ============================================================
CREATE TABLE turnos (
  id SERIAL PRIMARY KEY,
  observacion_inicio TEXT NOT NULL,
  observacion_termino TEXT NULL,
  fecha_hora_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_hora_termino TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_guardia INT NULL,
  FOREIGN KEY (id_guardia) REFERENCES guardias(id) ON DELETE SET NULL
);

-- ============================================================
-- 10. TABLA: RONDAS (VERSIÓN FINAL)
-- ============================================================
CREATE TABLE rondas (
  id SERIAL PRIMARY KEY,
  observacion_ronda TEXT NOT NULL,
  fecha_hora_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_hora_termino TIMESTAMP NULL,
  id_turno INT NULL,
  FOREIGN KEY (id_turno) REFERENCES turnos(id) ON DELETE SET NULL
);

-- ============================================================
-- 11. TABLA: AUTORIZACION_QR
-- ============================================================
CREATE TABLE autorizacion_qr (
  id SERIAL PRIMARY KEY,
  codigo_qr VARCHAR(255) UNIQUE NOT NULL,
  nombre_visita VARCHAR(100) NOT NULL,
  motivo TEXT,
  usado BOOLEAN DEFAULT FALSE,
  fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_usuario INT NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ============================================================
-- 12. TABLA: REGISTROS DE INGRESO
-- ============================================================
CREATE TABLE registros_ingreso (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  rut VARCHAR(12) CHECK (rut ~ '^[0-9]{7,8}-[0-9kK]$'),
  patente VARCHAR(10),
  tipo_vehiculo VARCHAR(20),
  autorizado_por VARCHAR(100) NOT NULL,
  lugar_destino VARCHAR(100) NOT NULL,
  tipo_visita VARCHAR(20) CHECK (tipo_visita IN ('visita','delivery','trabajador')) NOT NULL,
  fecha_hora_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_hora_salida TIMESTAMP,
  alerta_delivery BOOLEAN DEFAULT FALSE,
  alerta_leida BOOLEAN DEFAULT FALSE,
  id_autorizacion_qr INT NULL,
  id_guardia INT NOT NULL,

  FOREIGN KEY (id_autorizacion_qr) REFERENCES autorizacion_qr(id) ON DELETE SET NULL,

  FOREIGN KEY (id_guardia) REFERENCES guardias(id) ON DELETE CASCADE
);


-- ============================================================
-- 13. TABLA: AUDITORÍA
-- ============================================================
CREATE TABLE auditoria (
  id SERIAL PRIMARY KEY,
  accion VARCHAR(50),
  tabla_afectada VARCHAR(50),
  id_usuario INT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- FUNCIÓN DE AUDITORÍA
-- ============================================================
CREATE OR REPLACE FUNCTION log_auditoria()
RETURNS TRIGGER AS $$
DECLARE v_user_id INT;
BEGIN
  BEGIN
    IF TG_OP IN ('INSERT','UPDATE') THEN
      v_user_id := NEW.id_usuario;
    ELSE
      v_user_id := OLD.id_usuario;
    END IF;
  EXCEPTION WHEN others THEN
    v_user_id := NULL;
  END;

  INSERT INTO auditoria (accion, tabla_afectada, id_usuario)
  VALUES (TG_OP, TG_TABLE_NAME, v_user_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TRIGGERS AUDITORÍA
-- ============================================================
CREATE TRIGGER trg_audit_usuarios
AFTER INSERT OR UPDATE OR DELETE ON usuarios
FOR EACH ROW EXECUTE FUNCTION log_auditoria();

CREATE TRIGGER trg_audit_residentes
AFTER INSERT OR UPDATE OR DELETE ON residentes
FOR EACH ROW EXECUTE FUNCTION log_auditoria();

CREATE TRIGGER trg_audit_guardias
AFTER INSERT OR UPDATE OR DELETE ON guardias
FOR EACH ROW EXECUTE FUNCTION log_auditoria();

CREATE TRIGGER trg_audit_empresas_contratistas
AFTER INSERT OR UPDATE OR DELETE ON empresas_contratistas
FOR EACH ROW EXECUTE FUNCTION log_auditoria();

CREATE TRIGGER trg_audit_registros_ingreso
AFTER INSERT OR UPDATE OR DELETE ON registros_ingreso
FOR EACH ROW EXECUTE FUNCTION log_auditoria();

-- ============================================================
-- SCHEMA ANALYTICS (Big Data / BI)
-- ============================================================
CREATE SCHEMA IF NOT EXISTS analytics;
SET search_path TO analytics, public;

CREATE MATERIALIZED VIEW analytics.hechos_ingresos AS
SELECT 
  r.id AS id_registro,
  r.fecha_hora_ingreso,
  r.fecha_hora_salida,
  r.patente,
  r.tipo_vehiculo,
  r.tipo_visita,
  EXTRACT(EPOCH FROM (COALESCE(r.fecha_hora_salida, NOW()) - r.fecha_hora_ingreso)) / 60 AS minutos_estadia,
  g.nombre AS guardia,
  ec.nombre_empresa AS empresa_contratista,
  c.direccion AS casa,
  DATE(r.fecha_hora_ingreso) AS fecha_registro,
  DATE_PART('hour', r.fecha_hora_ingreso) AS hora_ingreso,
  DATE_PART('hour', r.fecha_hora_salida) AS hora_salida
FROM public.registros_ingreso r
LEFT JOIN public.guardias g ON g.id = r.id_guardia
LEFT JOIN public.empresas_contratistas ec ON ec.id = g.id_empresa_contratista
LEFT JOIN public.usuarios u ON u.id = g.id_usuario
LEFT JOIN public.residentes res ON res.id_usuario = u.id
LEFT JOIN public.casas c ON c.id = res.id_casa;

CREATE INDEX idx_hechos_fecha ON analytics.hechos_ingresos (fecha_registro);

-- ============================================================
-- TABLA DIMENSIÓN TIEMPO
-- ============================================================
CREATE TABLE IF NOT EXISTS dim_tiempo (
  id SERIAL PRIMARY KEY,
  fecha DATE UNIQUE NOT NULL,
  anio INT NOT NULL,
  mes INT NOT NULL,
  dia INT NOT NULL,
  nombre_dia VARCHAR(15),
  nombre_mes VARCHAR(15)
);

INSERT INTO dim_tiempo (fecha, anio, mes, dia, nombre_dia, nombre_mes)
SELECT d::date,
       EXTRACT(YEAR FROM d),
       EXTRACT(MONTH FROM d),
       EXTRACT(DAY FROM d),
       TO_CHAR(d, 'TMDay'),
       TO_CHAR(d, 'TMMonth')
FROM generate_series('2020-01-01'::date, '2035-12-31'::date, '1 day') d
ON CONFLICT (fecha) DO NOTHING;

-- ============================================================
-- USUARIOS BASE
-- ============================================================
INSERT INTO usuarios (nombre, rut, email, password, rol)
VALUES
('Usuario', '22222222-7', 'usuario@correo.cl', '$2b$10$a.cvUAhtIbH2xHKOYU.0mOhwLAz35KRXTj.0uBIr43K.xJL1ifFju', 'guardia'),
('Admin', '11111111-1', 'admin@correo.cl', '$2b$10$LpTPgqRoqgn/6p36sixWCu2TWR6quRN.NbZDTKE1OJQl7Fv7JO.Sy', 'administrador');
