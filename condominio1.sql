CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre_usuario VARCHAR(100) NOT NULL,
  rut VARCHAR(12) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol VARCHAR(20) CHECK (rol IN ('administrador', 'usuario')) NOT NULL,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO usuarios(nombre_usuario, rut, email, password, rol)
VALUES
('Usuario', '22222222-7', 'usuario@correo.cl', 
'$2b$10$a.cvUAhtIbH2xHKOYU.0mOhwLAz35KRXTj.0uBIr43K.xJL1ifFju', 'usuario');

INSERT INTO usuarios (nombre_usuario, rut, email, password, rol)
VALUES
('Admin', '11111111-1', 'admin@correo.cl', 
'$2b$10$LpTPgqRoqgn/6p36sixWCu2TWR6quRN.NbZDTKE1OJQl7Fv7JO.Sy', 'administrador');