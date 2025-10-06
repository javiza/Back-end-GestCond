

-- =============================================
-- 🏘️ SISTEMA DE CONDOMINIO HABITACIONAL
-- Autor: Jonathan Bustos
-- Motor: PostgreSQL
-- =============================================

-- =============================================
-- 1️⃣ Tabla: USUARIOS
-- =============================================
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  rut VARCHAR(12) UNIQUE NOT NULL
      CHECK (rut ~ '^[0-9]{7,8}-[0-9kK]$'),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) CHECK (rol IN ('administrador', 'guardia', 'locatario')) NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
 drop table usuarios cascade;


-- =============================================
-- 2️⃣ Tabla: CASAS
-- =============================================
CREATE TABLE casas (
  id SERIAL PRIMARY KEY,
  direccion VARCHAR(150) NOT NULL,
  id_locatario INT NOT NULL,
  FOREIGN KEY (id_locatario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =============================================
-- 3️⃣ Tabla: VEHICULOS
-- =============================================
CREATE TABLE vehiculos (
  id SERIAL PRIMARY KEY,
  patente VARCHAR(10) UNIQUE NOT NULL
      CHECK (patente ~ '^[A-Z0-9-]{5,10}$'),
  marca VARCHAR(50),
  modelo VARCHAR(50),
  color VARCHAR(30),
  tipo_propietario VARCHAR(20) CHECK (tipo_propietario IN ('locatario', 'integrante')) DEFAULT 'locatario',
  id_casa INT NOT NULL,
  id_locatario INT NOT NULL,
  id_integrante INT,
  FOREIGN KEY (id_casa) REFERENCES casas(id) ON DELETE CASCADE,
  FOREIGN KEY (id_locatario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =============================================
-- 4️⃣ Tabla: INTEGRANTES
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
-- 5️⃣ Tabla: VISITAS
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
-- 6️⃣ Tabla: REGISTROS_INGRESO
-- =============================================
CREATE TABLE registros_ingreso (
  id SERIAL PRIMARY KEY,
  id_visita INT,
  id_personal_interno INT,
  fecha_hora_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_hora_salida TIMESTAMP,
  id_guardia INT NOT NULL,
  FOREIGN KEY (id_visita) REFERENCES visitas(id) ON DELETE SET NULL,
  FOREIGN KEY (id_guardia) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =============================================
-- 7️⃣ Tabla: NO_AUTORIZADOS
-- =============================================
CREATE TABLE no_autorizados (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  rut VARCHAR(12),
  id_casa INT,
  motivo TEXT,
  fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_guardia INT NOT NULL,
  FOREIGN KEY (id_casa) REFERENCES casas(id) ON DELETE SET NULL,
  FOREIGN KEY (id_guardia) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- =============================================
-- 8️⃣ Tabla: EMPRESAS_CONTRATISTAS
-- =============================================
CREATE TABLE empresas_contratistas (
  id SERIAL PRIMARY KEY,
  nombre_empresa VARCHAR(100) NOT NULL,
  rubro VARCHAR(100),
  telefono VARCHAR(20),
  email VARCHAR(100),
  activa BOOLEAN DEFAULT TRUE
);

-- =============================================
-- 9️⃣ Tabla: PERSONAL_INTERNO
-- =============================================
CREATE TABLE personal_interno (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  rut VARCHAR(12) UNIQUE NOT NULL,
  cargo VARCHAR(100) NOT NULL,
  empresa_externa BOOLEAN DEFAULT FALSE,
  id_empresa INT,
  id_usuario INT,
  activo BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (id_empresa) REFERENCES empresas_contratistas(id) ON DELETE SET NULL,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- =============================================
-- 🔟 Tabla: TURNOS
-- =============================================
CREATE TABLE turnos (
  id SERIAL PRIMARY KEY,
  id_personal INT NOT NULL,
  fecha_inicio TIMESTAMP NOT NULL,
  fecha_fin TIMESTAMP NOT NULL,
  tipo_turno VARCHAR(30) CHECK (tipo_turno IN ('mañana', 'tarde', 'noche', 'especial')) NOT NULL,
  FOREIGN KEY (id_personal) REFERENCES personal_interno(id) ON DELETE CASCADE
);

-- =============================================
-- 11️⃣ Tabla: ASISTENCIAS
-- =============================================
CREATE TABLE asistencias (
  id SERIAL PRIMARY KEY,
  id_personal INT NOT NULL,
  fecha DATE DEFAULT CURRENT_DATE,
  hora_entrada TIME,
  hora_salida TIME,
  observacion TEXT,
  presente BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (id_personal) REFERENCES personal_interno(id) ON DELETE CASCADE
);

-- =============================================
-- 🧾 TRIGGER DE AUDITORÍA
-- =============================================
CREATE TABLE auditoria (
  id SERIAL PRIMARY KEY,
  accion VARCHAR(50),
  tabla_afectada VARCHAR(50),
  usuario_id INT,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
FOR EACH ROW EXECUTE FUNCTION log_auditoria();

-- =============================================
-- ⚡ ÍNDICES CLAVE
-- =============================================
CREATE INDEX idx_visitas_codigo_qr ON visitas (codigo_qr);
CREATE INDEX idx_casas_locatario ON casas (id_locatario);
CREATE INDEX idx_vehiculos_casa ON vehiculos (id_casa);
CREATE INDEX idx_registros_guardia ON registros_ingreso (id_guardia);
CREATE INDEX idx_personal_empresa ON personal_interno (id_empresa);
CREATE INDEX idx_turnos_personal ON turnos (id_personal);

-- =============================================
-- 🌱 DATOS DE EJEMPLO
-- =============================================

ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_rut_check;

ALTER TABLE usuarios
ADD CONSTRAINT usuarios_rut_check
CHECK (rut ~ '^[0-9]{7,8}-[0-9kK]$');


INSERT INTO usuarios(nombre, rut, email, password, rol)
VALUES
('Usuario', '22222222-7', 'guardia@correo.cl', 
'$2b$10$a.cvUAhtIbH2xHKOYU.0mOhwLAz35KRXTj.0uBIr43K.xJL1ifFju', 'guardia');

INSERT INTO usuarios (nombre, rut, email, password, rol)
VALUES
('Admin', '11111111-1', 'admin@correo.cl', 
'$2b$10$LpTPgqRoqgn/6p36sixWCu2TWR6quRN.NbZDTKE1OJQl7Fv7JO.Sy', 'administrador');

-- Casa
INSERT INTO casas (direccion, id_locatario)
VALUES ('Pasaje Ancahue 210', 3);

-- Vehículos
INSERT INTO vehiculos (patente, marca, modelo, color, id_casa, id_locatario)
VALUES
('5678-SD', 'Toyota', 'Yaris', 'Blanco', 1, 3),
('5467-KJ', 'Kia', 'Rio', 'Azul', 1, 3);

-- Integrantes
INSERT INTO integrantes (nombre, parentesco, id_locatario, id_casa)
VALUES
('Matías Farías', 'Hijo', 3, 1),
('Fernanda Soto', 'Esposa', 3, 1);

-- Contratista
INSERT INTO empresas_contratistas (nombre_empresa, rubro, telefono, email)
VALUES ('CleanCondo', 'Aseo', '+56912345678', 'contacto@cleancondo.cl');

-- Personal interno
INSERT INTO personal_interno (nombre, rut, cargo, empresa_externa, id_empresa)
VALUES ('Juan Pérez', '15.234.678-9', 'Aseo general', TRUE, 1);

-- Turno
INSERT INTO turnos (id_personal, fecha_inicio, fecha_fin, tipo_turno)
VALUES (1, '2025-10-05 07:00', '2025-10-05 15:00', 'mañana');

-- Asistencia
INSERT INTO asistencias (id_personal, hora_entrada, hora_salida)
VALUES (1, '07:05', '15:00');

-- Visita
INSERT INTO visitas (nombre, rut, id_casa, autorizado_por, codigo_qr)
VALUES ('Pedro Soto', '17.345.890-9', 1, 3, 'qr123abc');

-- Registro de ingreso de visita
INSERT INTO registros_ingreso (id_visita, id_guardia)
VALUES (1, 2);
