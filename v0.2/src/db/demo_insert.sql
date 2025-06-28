-- DEMO: Datos de ejemplo para poblar el sistema académico (nuevo esquema)

-- Profesores
INSERT INTO profesores (cedula_profesor, nombres, apellidos, fecha_nacimiento, genero, especialidad, telefono, email, fecha_contratacion, estado)
VALUES
('V-12345678', 'Ana', 'Torres', '1980-05-12', 'F', 'Matemáticas', '0412-1111111', 'ana.torres@sigea.com', '2010-09-01', 'activo'),
('V-87654321', 'Carlos', 'Pérez', '1975-08-20', 'M', 'Historia', '0412-2222222', 'carlos.perez@sigea.com', '2008-09-01', 'activo'),
('V-23456789', 'María', 'Gómez', '1982-03-15', 'F', 'Inglés', '0412-3333333', 'maria.gomez@sigea.com', '2012-09-01', 'activo'),
('V-34567890', 'Luis', 'Fernández', '1978-11-30', 'M', 'Ciencias', '0412-4444444', 'luis.fernandez@sigea.com', '2009-09-01', 'activo'),
('V-45678901', 'Patricia', 'Ruiz', '1985-07-25', 'F', 'Educación Física', '0412-5555555', 'patricia.ruiz@sigea.com', '2011-09-01', 'activo'),
('V-56789012', 'Jorge', 'Salazar', '1981-09-10', 'M', 'Arte', '0412-6666666', 'jorge.salazar@sigea.com', '2013-09-01', 'activo'),
('V-67890123', 'Gabriela', 'Soto', '1983-02-18', 'F', 'Geografía', '0412-7777777', 'gabriela.soto@sigea.com', '2014-09-01', 'activo'),
('V-78901234', 'Ricardo', 'Díaz', '1979-06-05', 'M', 'Filosofía', '0412-8888888', 'ricardo.diaz@sigea.com', '2007-09-01', 'activo'),
('V-89012345', 'Elena', 'Rivas', '1984-12-01', 'F', 'Biología', '0412-9999999', 'elena.rivas@sigea.com', '2015-09-01', 'activo'),
('V-90123456', 'Miguel', 'Castillo', '1986-04-22', 'M', 'Química', '0412-1010101', 'miguel.castillo@sigea.com', '2016-09-01', 'activo'),
('V-01234567', 'Luisa', 'Moreno', '1983-07-30', 'F', 'Física', '0412-2020202', 'luisa.moreno@sigea.com', '2017-09-01', 'activo'),
('V-12345679', 'Fernando', 'Torres', '1980-11-25', 'M', 'Literatura', '0412-3030303', 'fernando.torres@sigea.com', '2018-09-01', 'activo'),
('V-23456780', 'Carmen', 'Jiménez', '1985-02-20', 'F', 'Computación', '0412-4040404', 'carmen.jimenez@sigea.com', '2019-09-01', 'activo'),
('V-34567891', 'Antonio', 'Díaz', '1978-05-15', 'M', 'Música', '0412-5050505', 'antonio.diaz@sigea.com', '2020-09-01', 'activo'),
('V-45678902', 'Patricia', 'González', '1982-08-10', 'F', 'Economía', '0412-6060606', 'patricia.gonzalez@sigea.com', '2021-09-01', 'activo'),
('V-56789013', 'Javier', 'Ramírez', '1984-09-05', 'M', 'Estadística', '0412-7070707', 'javier.ramirez@sigea.com', '2022-09-01', 'activo'),
('V-67890124', 'Verónica', 'Castro', '1981-10-20', 'F', 'Cálculo', '0412-8080808', 'veronica.castro@sigea.com', '2023-09-01', 'activo'),
('V-78901235', 'Eduardo', 'Rojas', '1979-12-15', 'M', 'Álgebra', '0412-9090909', 'eduardo.rojas@sigea.com', '2024-09-01', 'activo'),
('V-89012346', 'Marta', 'Sánchez', '1983-01-10', 'F', 'Geometría', '0412-1010102', 'marta.sanchez@sigea.com', '2025-09-01', 'activo'),
('V-90123457', 'Samuel', 'Herrera', '1982-04-05', 'M', 'Trigonometría', '0412-2020203', 'samuel.herrera@sigea.com', '2026-09-01', 'activo');

-- Materias
INSERT INTO materias (codigo, nombre, descripcion, nivel)
VALUES
('MAT01', 'Matemáticas', 'Matemáticas básicas', '1'),
('HIS01', 'Historia', 'Historia universal', '1'),
('ING01', 'Inglés', 'Inglés básico', '1'),
('CIE01', 'Ciencias', 'Ciencias naturales', '1'),
('EDF01', 'Educación Física', 'Educación física y salud', '1'),
('ART01', 'Arte', 'Educación artística', '1'),
('GEO01', 'Geografía', 'Geografía general', '1'),
('FIL01', 'Filosofía', 'Filosofía y ética', '1'),
('BIO01', 'Biología', 'Biología general', '1'),
('QUI01', 'Química', 'Química general', '1'),
('FIS01', 'Física', 'Física general', '1'),
('LIT01', 'Literatura', 'Literatura y lenguaje', '1'),
('COM01', 'Computación', 'Introducción a la computación', '1'),
('MUS01', 'Música', 'Educación musical', '1'),
('ECO01', 'Economía', 'Economía básica', '1'),
('EST01', 'Estadística', 'Estadística descriptiva', '1'),
('CAL01', 'Cálculo', 'Cálculo diferencial', '1'),
('ALG01', 'Álgebra', 'Álgebra básica', '1'),
('GEM01', 'Geometría', 'Geometría básica', '1'),
('TRI01', 'Trigonometría', 'Trigonometría básica', '1');

-- Estudiantes
INSERT INTO estudiantes (cedula_estudiante, nombres, apellidos, fecha_nacimiento, genero, direccion, telefono, email, fecha_ingreso, estado)
VALUES
('V-10000001', 'Juan', 'Martínez', '2008-01-15', 'M', 'Calle 1', '0412-1111001', 'juan.martinez@sigea.com', '2024-09-15', 'activo'),
('V-10000002', 'Laura', 'García', '2008-02-20', 'F', 'Calle 2', '0412-1111002', 'laura.garcia@sigea.com', '2024-09-15', 'activo'),
('V-10000003', 'Pedro', 'López', '2008-03-25', 'M', 'Calle 3', '0412-1111003', 'pedro.lopez@sigea.com', '2024-09-15', 'activo'),
('V-10000004', 'Sofía', 'Hernández', '2008-04-30', 'F', 'Calle 4', '0412-1111004', 'sofia.hernandez@sigea.com', '2024-09-15', 'activo'),
('V-10000005', 'Diego', 'González', '2008-05-05', 'M', 'Calle 5', '0412-1111005', 'diego.gonzalez@sigea.com', '2024-09-15', 'activo'),
('V-10000006', 'Valentina', 'Ramírez', '2008-06-10', 'F', 'Calle 6', '0412-1111006', 'valentina.ramirez@sigea.com', '2024-09-15', 'activo'),
('V-10000007', 'Andrés', 'Torres', '2008-07-15', 'M', 'Calle 7', '0412-1111007', 'andres.torres@sigea.com', '2024-09-15', 'activo'),
('V-10000008', 'Camila', 'Sánchez', '2008-08-20', 'F', 'Calle 8', '0412-1111008', 'camila.sanchez@sigea.com', '2024-09-15', 'activo'),
('V-10000009', 'Mateo', 'Castro', '2008-09-25', 'M', 'Calle 9', '0412-1111009', 'mateo.castro@sigea.com', '2024-09-15', 'activo'),
('V-10000010', 'Isabella', 'Mendoza', '2008-10-30', 'F', 'Calle 10', '0412-1111010', 'isabella.mendoza@sigea.com', '2024-09-15', 'activo'),
('V-10000011', 'Sebastián', 'Pérez', '2008-11-04', 'M', 'Calle 11', '0412-1111011', 'sebastian.perez@sigea.com', '2024-09-15', 'activo'),
('V-10000012', 'Valeria', 'Romero', '2008-12-09', 'F', 'Calle 12', '0412-1111012', 'valeria.romero@sigea.com', '2024-09-15', 'activo'),
('V-10000013', 'Nicolás', 'Morales', '2009-01-14', 'M', 'Calle 13', '0412-1111013', 'nicolas.morales@sigea.com', '2024-09-15', 'activo'),
('V-10000014', 'Camila', 'Salas', '2009-02-19', 'F', 'Calle 14', '0412-1111014', 'camila.salas@sigea.com', '2024-09-15', 'activo'),
('V-10000015', 'Diego', 'Rivas', '2009-03-26', 'M', 'Calle 15', '0412-1111015', 'diego.rivas@sigea.com', '2024-09-15', 'activo'),
('V-10000016', 'Sofía', 'Cordero', '2009-04-30', 'F', 'Calle 16', '0412-1111016', 'sofia.cordero@sigea.com', '2024-09-15', 'activo'),
('V-10000017', 'Mateo', 'Paredes', '2009-05-05', 'M', 'Calle 17', '0412-1111017', 'mateo.paredes@sigea.com', '2024-09-15', 'activo'),
('V-10000018', 'Isabella', 'Fuentes', '2009-06-10', 'F', 'Calle 18', '0412-1111018', 'isabella.fuentes@sigea.com', '2024-09-15', 'activo'),
('V-10000019', 'Valentino', 'Cabrera', '2009-07-15', 'M', 'Calle 19', '0412-1111019', 'valentino.cabrera@sigea.com', '2024-09-15', 'activo'),
('V-10000020', 'Renata', 'Maldonado', '2009-08-20', 'F', 'Calle 20', '0412-1111020', 'renata.maldonado@sigea.com', '2024-09-15', 'activo');

-- Cursos (asignar materia y profesor)
INSERT INTO cursos (id_materia, id_profesor, periodo_academico)
VALUES
(1, 1, '2024-2025'),
(2, 2, '2024-2025'),
(3, 3, '2024-2025'),
(4, 4, '2024-2025'),
(5, 5, '2024-2025'),
(6, 6, '2024-2025'),
(7, 7, '2024-2025'),
(8, 8, '2024-2025'),
(9, 9, '2024-2025'),
(10, 10, '2024-2025'),
(11, 11, '2024-2025'),
(12, 12, '2024-2025'),
(13, 13, '2024-2025'),
(14, 14, '2024-2025'),
(15, 15, '2024-2025'),
(16, 16, '2024-2025'),
(17, 17, '2024-2025'),
(18, 18, '2024-2025'),
(19, 19, '2024-2025'),
(20, 20, '2024-2025');

-- Inscripciones (estudiante a curso)
INSERT INTO inscripciones (id_estudiante, id_curso, fecha_inscripcion, estado)
VALUES
(1, 1, '2024-09-20', 'inscrito'),
(2, 2, '2024-09-20', 'inscrito'),
(3, 3, '2024-09-20', 'inscrito'),
(4, 4, '2024-09-20', 'inscrito'),
(5, 5, '2024-09-20', 'inscrito'),
(6, 6, '2024-09-20', 'inscrito'),
(7, 7, '2024-09-20', 'inscrito'),
(8, 8, '2024-09-20', 'inscrito'),
(9, 9, '2024-09-20', 'inscrito'),
(10, 10, '2024-09-20', 'inscrito'),
(11, 11, '2024-09-20', 'inscrito'),
(12, 12, '2024-09-20', 'inscrito'),
(13, 13, '2024-09-20', 'inscrito'),
(14, 14, '2024-09-20', 'inscrito'),
(15, 15, '2024-09-20', 'inscrito'),
(16, 16, '2024-09-20', 'inscrito'),
(17, 17, '2024-09-20', 'inscrito'),
(18, 18, '2024-09-20', 'inscrito'),
(19, 19, '2024-09-20', 'inscrito'),
(20, 20, '2024-09-20', 'inscrito');

-- Calificaciones (por inscripción)
INSERT INTO calificaciones (id_inscripcion, tipo_evaluacion, puntaje, porcentaje, fecha_registro, comentarios)
VALUES
(1, 'Parcial 1', 18.5, 30, '2024-10-10', 'Buen desempeño'),
(2, 'Parcial 1', 16.0, 30, '2024-10-10', 'Puede mejorar'),
(3, 'Parcial 1', 17.2, 30, '2024-10-10', 'Buen desempeño'),
(4, 'Parcial 1', 15.8, 30, '2024-10-10', 'Necesita mejorar'),
(5, 'Parcial 1', 19.0, 30, '2024-10-10', 'Excelente'),
(6, 'Parcial 1', 18.0, 30, '2024-10-10', 'Muy bien'),
(7, 'Parcial 1', 17.5, 30, '2024-10-10', 'Buen desempeño'),
(8, 'Parcial 1', 16.7, 30, '2024-10-10', 'Puede mejorar'),
(9, 'Parcial 1', 15.9, 30, '2024-10-10', 'Necesita mejorar'),
(10, 'Parcial 1', 17.8, 30, '2024-10-10', 'Buen desempeño'),
(11, 'Parcial 1', 18.2, 30, '2024-10-10', 'Muy bien'),
(12, 'Parcial 1', 16.4, 30, '2024-10-10', 'Puede mejorar'),
(13, 'Parcial 1', 17.6, 30, '2024-10-10', 'Buen desempeño'),
(14, 'Parcial 1', 15.7, 30, '2024-10-10', 'Necesita mejorar'),
(15, 'Parcial 1', 19.3, 30, '2024-10-10', 'Excelente'),
(16, 'Parcial 1', 18.1, 30, '2024-10-10', 'Muy bien'),
(17, 'Parcial 1', 17.9, 30, '2024-10-10', 'Buen desempeño'),
(18, 'Parcial 1', 16.8, 30, '2024-10-10', 'Puede mejorar'),
(19, 'Parcial 1', 15.6, 30, '2024-10-10', 'Necesita mejorar'),
(20, 'Parcial 1', 17.4, 30, '2024-10-10', 'Buen desempeño');

-- Usuarios (admin, profesores y estudiantes)
INSERT INTO usuarios (username, password_hash, rol, id_persona, ultimo_login, estado)
VALUES
('admin', '$2a$10$Qw1Qw1Qw1Qw1Qw1Qw1QwOeQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw', 'admin', NULL, NULL, 'activo'),
('ana.torres', '$2a$10$7QJ8Qw1Qw1Qw1Qw1Qw1QwOeQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw', 'profesor', 1, NULL, 'activo'),
('juan.martinez', '$2a$10$7QJ8Qw1Qw1Qw1Qw1Qw1QwOeQw1Qw1Qw1Qw1Qw1Qw1Qw1Qw1Qw', 'estudiante', 1, NULL, 'activo');
-- NOTA: El password_hash es un hash de ejemplo, reemplazar por uno real generado con bcrypt.
