-- DEMO: Datos de ejemplo para poblar el sistema académico

-- Profesores
INSERT INTO profesor (nombre, numero_empleado, direccion, fecha_nacimiento, cedula, telefono, email)
VALUES
('Ana Torres', 'P001', 'Av. Bolívar 123', '1980-05-12', 'V-12345678', '0412-1111111', 'ana.torres@demo.edu'),
('Carlos Pérez', 'P002', 'Calle Sucre 45', '1975-08-20', 'V-87654321', '0412-2222222', 'carlos.perez@demo.edu'),
('María Gómez', 'P003', 'Av. Principal 10', '1982-03-15', 'V-23456789', '0412-3333333', 'maria.gomez@demo.edu'),
('Luis Fernández', 'P004', 'Calle Real 8', '1978-11-30', 'V-34567890', '0412-4444444', 'luis.fernandez@demo.edu'),
('Patricia Ruiz', 'P005', 'Av. Libertador 99', '1985-07-25', 'V-45678901', '0412-5555555', 'patricia.ruiz@demo.edu'),
('Jorge Salazar', 'P006', 'Calle 5 de Julio', '1981-09-10', 'V-56789012', '0412-6666666', 'jorge.salazar@demo.edu'),
('Gabriela Soto', 'P007', 'Av. Universidad 22', '1983-02-18', 'V-67890123', '0412-7777777', 'gabriela.soto@demo.edu'),
('Ricardo Díaz', 'P008', 'Calle Miranda 77', '1979-06-05', 'V-78901234', '0412-8888888', 'ricardo.diaz@demo.edu'),
('Elena Rivas', 'P009', 'Av. Los Próceres 55', '1984-12-01', 'V-89012345', '0412-9999999', 'elena.rivas@demo.edu'),
('Miguel Castillo', 'P010', 'Calle Vargas 33', '1986-04-22', 'V-90123456', '0412-1010101', 'miguel.castillo@demo.edu');

-- Materias (asignando profesor_id correlativo)
INSERT INTO materia (nombre, profesor_id) VALUES
('Matemáticas', 1),
('Historia', 2),
('Inglés', 3),
('Ciencias', 4),
('Educación Física', 5),
('Arte', 6),
('Geografía', 7),
('Filosofía', 8),
('Biología', 9),
('Química', 10),
('Física', 1),
('Literatura', 2),
('Computación', 3),
('Música', 4),
('Economía', 5);

-- Estudiantes
INSERT INTO estudiante (nombre, apellido, cedula, telefono, fecha_nacimiento, direccion, anio, seccion, email)
VALUES
('Juan', 'Martínez', 'V-10000001', '0412-1111001', '2008-01-15', 'Calle 1', '1er Año', 'A', 'juan.martinez@demo.edu'),
('Laura', 'García', 'V-10000002', '0412-1111002', '2008-02-20', 'Calle 2', '1er Año', 'A', 'laura.garcia@demo.edu'),
('Pedro', 'López', 'V-10000003', '0412-1111003', '2008-03-25', 'Calle 3', '1er Año', 'B', 'pedro.lopez@demo.edu'),
('Sofía', 'Hernández', 'V-10000004', '0412-1111004', '2008-04-30', 'Calle 4', '1er Año', 'B', 'sofia.hernandez@demo.edu'),
('Diego', 'González', 'V-10000005', '0412-1111005', '2008-05-10', 'Calle 5', '2do Año', 'A', 'diego.gonzalez@demo.edu'),
('Valentina', 'Ramírez', 'V-10000006', '0412-1111006', '2008-06-12', 'Calle 6', '2do Año', 'A', 'valentina.ramirez@demo.edu'),
('Andrés', 'Torres', 'V-10000007', '0412-1111007', '2008-07-18', 'Calle 7', '2do Año', 'B', 'andres.torres@demo.edu'),
('Camila', 'Sánchez', 'V-10000008', '0412-1111008', '2008-08-22', 'Calle 8', '2do Año', 'B', 'camila.sanchez@demo.edu'),
('Mateo', 'Castro', 'V-10000009', '0412-1111009', '2008-09-27', 'Calle 9', '3er Año', 'A', 'mateo.castro@demo.edu'),
('Isabella', 'Mendoza', 'V-10000010', '0412-1111010', '2008-10-30', 'Calle 10', '3er Año', 'A', 'isabella.mendoza@demo.edu');
