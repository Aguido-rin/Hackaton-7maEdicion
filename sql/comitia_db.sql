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
-- Tabla: CentrosVotacion (Se mantiene para usuarios)
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
-- Tabla: Mesas (Se mantiene para usuarios)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Mesas (
  id_mesa INT AUTO_INCREMENT PRIMARY KEY,
  id_centro CHAR(36) NOT NULL,
  numero_mesa VARCHAR(10) NOT NULL UNIQUE,
  ubicacion_detalle VARCHAR(255), 
  
  FOREIGN KEY (id_centro) REFERENCES CentrosVotacion(id_centro)
) COMMENT='Mesas de sufragio y su ubicación detallada.';


-- -----------------------------------------------------
-- Tabla: Usuarios (Se mantiene para usuarios)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Usuarios (
  id_usuario CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  dni VARCHAR(8) NOT NULL UNIQUE,
  email VARCHAR(255) UNIQUE, 
  password_hash VARCHAR(255), 
  id_mesa INT NULL,           
  rol ENUM('Elector', 'MiembroMesa') NOT NULL DEFAULT 'Elector',
  
  FOREIGN KEY (id_mesa) REFERENCES Mesas(id_mesa)
) COMMENT='Almacena SOLO a los usuarios registrados en la app.';


-- -----------------------------------------------------
-- Tabla: PartidosPoliticos (¡MODIFICADA!)
-- Optimizada para almacenar los datos del JNE y el logo como BLOB.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS PartidosPoliticos (
  id_partido CHAR(36) PRIMARY KEY DEFAULT (UUID()),
  jne_id_simbolo INT NULL COMMENT 'ID interno del JNE (ej: /GetSimbolo/4)',
  nombre_partido VARCHAR(255) NOT NULL,
  siglas VARCHAR(50) NULL,
  fecha_inscripcion DATE NULL,
  
  -- Campo para almacenar la imagen del logo (para la IA)
  logo_blob MEDIUMBLOB NULL COMMENT 'Datos binarios de la imagen del logo',
  
  -- Campos de información de contacto (del HTML)
  direccion_legal VARCHAR(255) NULL,
  telefonos VARCHAR(100) NULL,
  sitio_web VARCHAR(255) NULL,
  email_contacto VARCHAR(255) NULL,
  
  -- Campos de personeros (del HTML)
  personero_titular VARCHAR(255) NULL,
  personero_alterno VARCHAR(255) NULL,
  
  -- Campo de ideología (se mantiene)
  ideologia ENUM('Izquierda', 'CentroIzquierda', 'Centro', 'CentroDerecha', 'Derecha', 'Otro', 'Desconocido') NULL DEFAULT 'Desconocido'
) COMMENT='Agrupaciones políticas. Logos guardados como BLOB.';