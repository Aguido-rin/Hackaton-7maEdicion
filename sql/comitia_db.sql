-- -----------------------------------------------------
-- Creación de la Base de Datos
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS comitia_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE comitia_db;

-- -----------------------------------------------------
-- Configuración del Motor de Almacenamiento
-- -----------------------------------------------------
SET default_storage_engine=InnoDB;

-- -----------------------------------------------------
-- Tabla: CentrosVotacion
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS CentrosVotacion (
  id_centro CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  nombre VARCHAR(255) NOT NULL,
  direccion VARCHAR(255) NOT NULL,
  distrito VARCHAR(100),
  latitud DECIMAL(10, 8), 
  longitud DECIMAL(11, 8)
) COMMENT='Lugares físicos de votación (colegios, etc.)';


-- -----------------------------------------------------
-- Tabla: Mesas
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Mesas (
  id_mesa INT AUTO_INCREMENT PRIMARY KEY,
  id_centro CHAR(36) NOT NULL,
  numero_mesa VARCHAR(10) NOT NULL UNIQUE,
  ubicacion_detalle VARCHAR(255), 
  
  -- Índice para acelerar las búsquedas por centro
  INDEX idx_id_centro (id_centro), 
  
  FOREIGN KEY (id_centro) REFERENCES CentrosVotacion(id_centro)
    ON DELETE RESTRICT -- Opcional: previene borrar un centro si tiene mesas
    ON UPDATE CASCADE
) COMMENT='Mesas de sufragio y su ubicación detallada.';


-- -----------------------------------------------------
-- Tabla: Usuarios
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Usuarios (
  id_usuario CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  dni VARCHAR(8) NOT NULL UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  id_mesa INT NULL,
  rol ENUM('Elector', 'MiembroMesa') NOT NULL DEFAULT 'Elector',
  -- Índice para acelerar las búsquedas por DNI (ya cubierto por UNIQUE)
  -- INDEX idx_dni (dni), -- 'UNIQUE' ya crea un índice
  -- Índice para acelerar las búsquedas por mesa
  INDEX idx_id_mesa (id_mesa), 
  
  FOREIGN KEY (id_mesa) REFERENCES Mesas(id_mesa)
    ON DELETE SET NULL -- Si se borra la mesa, el usuario no se borra
    ON UPDATE CASCADE
) COMMENT='Almacena SOLO a los usuarios registrados en la app.';


-- -----------------------------------------------------
-- Tabla: PartidosPoliticos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS PartidosPoliticos (
  id_partido CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  jne_id_simbolo INT NULL COMMENT 'ID interno del JNE (ej: /GetSimbolo/4)',
  nombre_partido VARCHAR(255) NOT NULL,
  siglas VARCHAR(50) NULL,
  fecha_inscripcion DATE NULL,
  
  logo_blob MEDIUMBLOB NULL COMMENT 'Datos binarios de la imagen del logo',
  nombre_candidato_principal VARCHAR(255) NULL COMMENT 'Nombre del candidato principal',
  foto_candidato_principal MEDIUMBLOB NULL COMMENT 'Foto del candidato principal',
  
  direccion_legal VARCHAR(255) NULL,
  telefonos VARCHAR(100) NULL,
  sitio_web VARCHAR(255) NULL,
  email_contacto VARCHAR(255) NULL,
  
  personero_titular VARCHAR(255) NULL,
  personero_alterno VARCHAR(255) NULL,
  
  ideologia ENUM('Izquierda', 'CentroIzquierda', 'Centro', 'CentroDerecha', 'Derecha', 'Otro', 'Desconocido') NULL DEFAULT 'Desconocido',

  -- Índice para acelerar búsquedas por nombre (como en models.py)
  INDEX idx_nombre_partido (nombre_partido)
  
) COMMENT='Agrupaciones políticas. Logos guardados como BLOB.';

INSERT INTO CentrosVotacion (id_centro, nombre, direccion, distrito, latitud, longitud) VALUES
(UUID(), 'IE 7069 José María Arguedas', 'Av. Los Héroes 345', 'San Juan de Miraflores', -12.157892, -76.971234),
(UUID(), 'Colegio Nacional Ricardo Palma', 'Av. Ricardo Palma 240', 'Surquillo', -12.112345, -77.012345),
(UUID(), 'IE 7089 Romeo Luna Victoria', 'Av. Aviación 4850', 'Santiago de Surco', -12.138850, -76.995120),
(UUID(), 'GUE Alfonso Ugarte', 'Av. Alfonso Ugarte 1230', 'Lima', -12.049510, -77.042830),
(UUID(), 'Colegio San Agustín', 'Av. Javier Prado Este 5560', 'La Molina', -12.074010, -76.953050);

SELECT id_centro, nombre FROM CentrosVotacion;

INSERT INTO Mesas (id_centro, numero_mesa, ubicacion_detalle) VALUES
('c92c46b4-c254-11f0-9f78-a841f415c3a6', '045125', 'Pabellón A - Aula 5'),
('c92c46b4-c254-11f0-9f78-a841f415c3a6', '045126', 'Pabellón A - Aula 6'),
('c92c46b4-c254-11f0-9f78-a841f415c3a6', '045127', 'Pabellón B - Aula 1'),
('c92c46b4-c254-11f0-9f78-a841f415c3a6', '045128', 'Pabellón B - Aula 2'),
('c92c46b4-c254-11f0-9f78-a841f415c3a6', '045129', 'Pabellón B - Aula 3');

INSERT INTO Mesas (id_centro, numero_mesa, ubicacion_detalle) VALUES
('c92e2d81-c254-11f0-9f78-a841f415c3a6', '045130', 'Pabellón C - Aula 1'),
('c92e2d81-c254-11f0-9f78-a841f415c3a6', '045131', 'Pabellón C - Aula 2'),
('c92e2d81-c254-11f0-9f78-a841f415c3a6', '045132', 'Pabellón C - Aula 3'),
('c92e2d81-c254-11f0-9f78-a841f415c3a6', '045133', 'Patio Central - Zona 1'),
('c92e2d81-c254-11f0-9f78-a841f415c3a6', '045134', 'Patio Central - Zona 2');

INSERT INTO Mesas (id_centro, numero_mesa, ubicacion_detalle) VALUES
('80b5f2bb-c325-11f0-ad84-a841f415c3a6', '045135', 'Pabellón A - Aula 1'),
('80b5f2bb-c325-11f0-ad84-a841f415c3a6', '045136', 'Pabellón A - Aula 2'),
('80b5f2bb-c325-11f0-ad84-a841f415c3a6', '045137', 'Pabellón A - Aula 3'),
('80b5f2bb-c325-11f0-ad84-a841f415c3a6', '045138', 'Pabellón A - Aula 4'),
('80b5f2bb-c325-11f0-ad84-a841f415c3a6', '045139', 'Pabellón A - Aula 5');

INSERT INTO Mesas (id_centro, numero_mesa, ubicacion_detalle) VALUES
('80b5ff88-c325-11f0-ad84-a841f415c3a6', '045140', 'Pabellón 1 - Aula 101'),
('80b5ff88-c325-11f0-ad84-a841f415c3a6', '045141', 'Pabellón 1 - Aula 102'),
('80b5ff88-c325-11f0-ad84-a841f415c3a6', '045142', 'Pabellón 1 - Aula 103'),
('80b5ff88-c325-11f0-ad84-a841f415c3a6', '045143', 'Pabellón 2 - Aula 201'),
('80b5ff88-c325-11f0-ad84-a841f415c3a6', '045144', 'Pabellón 2 - Aula 202');

INSERT INTO Mesas (id_centro, numero_mesa, ubicacion_detalle) VALUES
('80b60281-c325-11f0-ad84-a841f415c3a6', '045145', 'Coliseo - Zona A'),
('80b60281-c325-11f0-ad84-a841f415c3a6', '045146', 'Coliseo - Zona B'),
('80b60281-c325-11f0-ad84-a841f415c3a6', '045147', 'Coliseo - Zona C'),
('80b60281-c325-11f0-ad84-a841f415c3a6', '045148', 'Patio Principal - Mesa 1'),
('80b60281-c325-11f0-ad84-a841f415c3a6', '045149', 'Patio Principal - Mesa 2');

USE comitia_db;

SELECT * FROM PartidosPoliticos;
SELECT * FROM candidatos;
SELECT * FROM usuarios;
SELECT * FROM mesas;