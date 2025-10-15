-- =============================================
-- 🏘️ SISTEMA DE CONDOMINIO HABITACIONAL (versión final corregida)
-- Autor: Jonathan Bustos
-- Motor: PostgreSQL 16
-- =============================================
create database condominio2;
-- =============================================
-- 1️⃣ TABLA: CASAS
-- =============================================
CREATE TABLE casas (
  id SERIAL PRIMARY KEY,
  numero VARCHAR(6) NOT NULL UNIQUE,
  direccion VARCHAR(150) NOT NULL
);

-- =============================================
-- 2️⃣ TABLA: USUARIOS
-- =============================================
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  rut VARCHAR(12) UNIQUE NOT NULL CHECK (rut ~ '^[0-9]{7,8}-[0-9kK]$'),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) CHECK (rol IN ('administrador', 'guardia', 'locatario')) NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_casa INT,
  FOREIGN KEY (id_casa) REFERENCES casas(id) ON DELETE SET NULL
);

-- =============================================
-- 3️⃣ TABLA: VEHÍCULOS
-- =============================================
CREATE TABLE vehiculos (
  id SERIAL PRIMARY KEY,
  patente VARCHAR(10) UNIQUE NOT NULL,
  marca VARCHAR(50),
  modelo VARCHAR(50),
  color VARCHAR(30),
  tipo_vehiculo VARCHAR(20) CHECK (tipo_vehiculo IN ('auto', 'moto')),
  tipo_propietario VARCHAR(20) CHECK (tipo_propietario IN ('locatario', 'integrante')) DEFAULT 'locatario',
  id_casa INT NOT NULL,
  id_locatario INT NOT NULL,
  id_integrante INT,
  FOREIGN KEY (id_casa) REFERENCES casas(id) ON DELETE CASCADE,
  FOREIGN KEY (id_locatario) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (id_integrante) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- =============================================
-- 4️⃣ TABLA: INTEGRANTES
-- =============================================
CREATE TABLE integrantes (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  parentesco VARCHAR(50) NOT NULL,
  id_locatario INT NOT NULL,
  id_casa INT NOT NULL,
  id_vehiculo INT,
  FOREIGN KEY (id_locatario) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (id_casa) REFERENCES casas(id) ON DELETE CASCADE,
  FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id) ON DELETE SET NULL
);

-- =============================================
-- 5️⃣ TABLA: EMPRESAS CONTRATISTAS
-- =============================================
CREATE TABLE empresas_contratistas (
  id SERIAL PRIMARY KEY,
  nombre_encargado VARCHAR(100) NOT NULL,
  nombre_empresa VARCHAR(100) NOT NULL,
  rubro VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(100),
  fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_termino TIMESTAMP,
  activa BOOLEAN DEFAULT TRUE
);

-- =============================================
-- 6️⃣ TABLA: PERSONAL INTERNO
-- =============================================
CREATE TABLE personal_interno (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  rut VARCHAR(12) UNIQUE NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  empresa_externa BOOLEAN DEFAULT FALSE,
  id_empresa INT,
  id_administrador INT,
  activo BOOLEAN DEFAULT TRUE,
  fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_termino TIMESTAMP,
  FOREIGN KEY (id_empresa) REFERENCES empresas_contratistas(id) ON DELETE SET NULL,
  FOREIGN KEY (id_administrador) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- =============================================
-- 7️⃣ TABLA: VISITAS
-- =============================================
CREATE TABLE visitas (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  rut VARCHAR(12) NOT NULL,
  id_casa INT NOT NULL,
  autorizado_por INT NOT NULL,
  codigo_qr VARCHAR(255) UNIQUE NOT NULL,
  fecha_autorizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_casa) REFERENCES casas(id) ON DELETE CASCADE,
  FOREIGN KEY (autorizado_por) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =============================================
-- 8️⃣ TABLA: REGISTROS DE INGRESO
-- =============================================
CREATE TABLE registros_ingreso (
  id SERIAL PRIMARY KEY,
  id_casa INT,
  id_visita INT,
  id_personal_interno INT,
  id_personal_externo INT,
  fecha_hora_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_hora_salida TIMESTAMP,
  id_guardia INT NOT NULL,
  tipo_registro VARCHAR(20) CHECK (tipo_registro IN ('visita', 'interno', 'externo')),
  nombre VARCHAR(100),
  rut VARCHAR(12) CHECK (rut ~ '^[0-9]{7,8}-[0-9kK]$'),
  observacion TEXT NOT NULL,
  patente VARCHAR(10),
  tipo_vehiculo VARCHAR(20) CHECK (tipo_vehiculo IN ('moto', 'auto')),
  FOREIGN KEY (id_visita) REFERENCES visitas(id) ON DELETE SET NULL,
  FOREIGN KEY (id_casa) REFERENCES casas(id) ON DELETE SET NULL,
  FOREIGN KEY (id_personal_interno) REFERENCES personal_interno(id) ON DELETE SET NULL,
  FOREIGN KEY (id_personal_externo) REFERENCES empresas_contratistas(id) ON DELETE SET NULL,
  FOREIGN KEY (id_guardia) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =============================================
-- 9️⃣ TABLA: NO AUTORIZADOS
-- =============================================
CREATE TABLE no_autorizados (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  rut VARCHAR(12),
  id_casa INT,
  motivo TEXT,
  fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_administrador INT,
  FOREIGN KEY (id_casa) REFERENCES casas(id) ON DELETE SET NULL,
  FOREIGN KEY (id_administrador) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =============================================
-- 🔟 TABLA: RONDAS
-- =============================================
CREATE TABLE rondas (
  id SERIAL PRIMARY KEY,
  nombre_guardia VARCHAR(100),
  observaciones VARCHAR(100) NOT NULL,
  fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_termino TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_guardia INT,
  FOREIGN KEY (id_guardia) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- =============================================
-- 11️⃣ TABLA: OBSERVACIONES
-- =============================================
CREATE TABLE observaciones (
  id SERIAL PRIMARY KEY,
  nombre_guardia VARCHAR(100),
  observaciones VARCHAR(100) NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_guardia INT,
  FOREIGN KEY (id_guardia) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- =============================================
-- 12️⃣ TABLA: AUDITORÍA
-- =============================================
CREATE TABLE auditoria (
  id SERIAL PRIMARY KEY,
  accion VARCHAR(50),
  tabla_afectada VARCHAR(50),
  usuario_id INT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- 🧠 FUNCIONES Y TRIGGERS
-- =============================================
CREATE OR REPLACE FUNCTION log_auditoria()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO auditoria (accion, tabla_afectada, usuario_id)
  VALUES (TG_OP, TG_TABLE_NAME, NEW.id_guardia);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auditoria_ingresos
AFTER INSERT ON registros_ingreso
FOR EACH ROW
EXECUTE FUNCTION log_auditoria();

CREATE OR REPLACE FUNCTION set_fecha_termino_empresa()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.activa = FALSE AND OLD.activa = TRUE THEN
    NEW.fecha_termino := CURRENT_TIMESTAMP;
  ELSIF NEW.activa = TRUE AND OLD.activa = FALSE THEN
    NEW.fecha_termino := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_fecha_termino_empresa
BEFORE UPDATE ON empresas_contratistas
FOR EACH ROW
EXECUTE FUNCTION set_fecha_termino_empresa();

CREATE OR REPLACE FUNCTION set_fecha_termino_personal()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.activo = FALSE AND OLD.activo = TRUE THEN
    NEW.fecha_termino := CURRENT_TIMESTAMP;
  ELSIF NEW.activo = TRUE AND OLD.activo = FALSE THEN
    NEW.fecha_termino := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_fecha_termino_personal
BEFORE UPDATE ON personal_interno
FOR EACH ROW
EXECUTE FUNCTION set_fecha_termino_personal();

-- =============================================
-- ⚡ ÍNDICES
-- =============================================
CREATE INDEX idx_casas_numero ON casas (numero);
CREATE INDEX idx_visitas_codigo_qr ON visitas (codigo_qr);
CREATE INDEX idx_vehiculos_casa ON vehiculos (id_casa);
CREATE INDEX idx_registros_guardia ON registros_ingreso (id_guardia);
CREATE INDEX idx_registros_fecha ON registros_ingreso (fecha_hora_ingreso);
CREATE INDEX idx_personal_empresa ON personal_interno (id_empresa);

-- =============================================
-- 📊 ESQUEMA ANALÍTICO
-- =============================================
CREATE SCHEMA IF NOT EXISTS analytics;
SET search_path TO analytics, public;

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
       EXTRACT(YEAR FROM d)::int,
       EXTRACT(MONTH FROM d)::int,
       EXTRACT(DAY FROM d)::int,
       TO_CHAR(d, 'TMDay'),
       TO_CHAR(d, 'TMMonth')
FROM generate_series('2020-01-01'::date, '2035-12-31'::date, '1 day') AS d
ON CONFLICT (fecha) DO NOTHING;

CREATE MATERIALIZED VIEW IF NOT EXISTS hechos_ingresos AS
SELECT 
  r.id AS id_registro,
  r.tipo_registro,
  r.observacion,
  r.fecha_hora_ingreso,
  r.fecha_hora_salida,
  r.patente,
  r.tipo_vehiculo,
  EXTRACT(EPOCH FROM (r.fecha_hora_salida - r.fecha_hora_ingreso))/60 AS minutos_estadia,
  u_guardia.nombre AS guardia,
  u_guardia.rol AS rol_guardia,
  c.direccion AS casa,
  v.nombre AS visitante,
  v.rut AS rut_visita,
  e.nombre_empresa AS empresa,
  p.nombre AS trabajador_interno,
  DATE(r.fecha_hora_ingreso) AS fecha_registro,
  DATE_PART('hour', r.fecha_hora_ingreso) AS hora_ingreso,
  DATE_PART('hour', r.fecha_hora_salida) AS hora_salida
FROM public.registros_ingreso r
LEFT JOIN public.visitas v ON v.id = r.id_visita
LEFT JOIN public.usuarios u_guardia ON u_guardia.id = r.id_guardia
LEFT JOIN public.casas c ON c.id = v.id_casa
LEFT JOIN public.personal_interno p ON p.id = r.id_personal_interno
LEFT JOIN public.empresas_contratistas e ON e.id = p.id_empresa;

CREATE INDEX IF NOT EXISTS idx_hechos_tipo_fecha 
ON hechos_ingresos (tipo_registro, fecha_registro);

CREATE OR REPLACE FUNCTION refresh_hechos_ingresos()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics.hechos_ingresos;
END;
$$ LANGUAGE plpgsql;




INSERT INTO usuarios(nombre, rut, email, password, rol)
VALUES
('Usuario', '22222222-7', 'usuario@correo.cl', 
'$2b$10$a.cvUAhtIbH2xHKOYU.0mOhwLAz35KRXTj.0uBIr43K.xJL1ifFju', 'guardia');

INSERT INTO usuarios (nombre, rut, email, password, rol)
VALUES
('Admin', '11111111-1', 'admin@correo.cl', 
'$2b$10$LpTPgqRoqgn/6p36sixWCu2TWR6quRN.NbZDTKE1OJQl7Fv7JO.Sy', 'administrador');

