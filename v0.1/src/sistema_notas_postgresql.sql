-- Crear base de datos (opcional)
-- CREATE DATABASE sistema_notas;
-- \c sistema_notas; -- Conectarse a la base de datos

-- Tabla: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    usuario VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(100),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rol VARCHAR(20)
);

-- Tabla: estudiantes
CREATE TABLE estudiantes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    cedula VARCHAR(15) UNIQUE,
    fecha_nacimiento DATE,
    anio INT,
    seccion VARCHAR(10),
    direccion TEXT,
    telefono VARCHAR(20),
    correo VARCHAR(100) UNIQUE
);

-- Tabla: profesores
CREATE TABLE profesores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    cedula VARCHAR(15) UNIQUE,
    telefono VARCHAR(20),
    correo VARCHAR(100) UNIQUE,
    direccion TEXT
);

-- Tabla: materias
CREATE TABLE materias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100),
    descripcion TEXT,
    codigo VARCHAR(20) UNIQUE,
    profesor_id INT REFERENCES profesores(id) ON DELETE SET NULL
);

-- Tabla: inscripciones
CREATE TABLE inscripciones (
    id SERIAL PRIMARY KEY,
    estudiante_id INT REFERENCES estudiantes(id) ON DELETE CASCADE,
    materia_id INT REFERENCES materias(id) ON DELETE CASCADE,
    fecha_inscripcion DATE DEFAULT CURRENT_DATE,
    UNIQUE(estudiante_id, materia_id)
);

-- Tabla: notas
CREATE TABLE notas (
    id SERIAL PRIMARY KEY,
    inscripcion_id INT REFERENCES inscripciones(id) ON DELETE CASCADE,
    evaluacion VARCHAR(50),
    nota NUMERIC(5,2) CHECK (nota >= 0 AND nota <= 100),
    fecha_evaluacion DATE DEFAULT CURRENT_DATE
);
