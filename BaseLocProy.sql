-- ===============================================
-- 1. CREACION DE LOS ROLES
-- ===============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rol_enum') THEN
    CREATE TYPE rol_enum AS ENUM ('ESTUDIANTE', 'PROFESOR', 'ADMINISTRADOR');
  END IF;
END$$;

-- ===============================================
-- 2. CREACION DE LA  TABLA USUARIOS
-- ===============================================
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre_completo TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  contrasena TEXT NOT NULL,       -- Aquí se almacenará el hash de la contraseña
  rol rol_enum NOT NULL,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ===============================================
-- 3. EXTENSIÓN PARA LA CONTASEÑA SEGURA
-- ===============================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ===============================================
-- 4. CREACION PARA LOS TÓPICOS DE ESTUDIO
-- ===============================================
CREATE TABLE IF NOT EXISTS topico (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  profesor_id INTEGER NOT NULL REFERENCES usuarios(id),
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT now(),
  actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT now()
);
-- ===============================================
-- 5. SCRIPT DE MATEO PARA LAS CONTRASEÑAS
-- SELECT * FROM usuarios;
-- SELECT current_user;
-- ALTER TABLE usuarios RENAME COLUMN contraseña TO contrasena;
-- CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- SHOW data_directory
-- SELECT oid, datname FROM pg_database WHERE datname = 'ProyGenSW';
-- ===============================================