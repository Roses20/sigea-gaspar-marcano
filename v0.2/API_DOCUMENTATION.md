# Documentación de la API

## Base URL
```
http://localhost:3000/api
```

---

## Endpoints

### 1. Estudiantes
- **GET `/estudiantes`**: Listar todos los estudiantes (admin/profesor)
- **GET `/estudiantes/:id_estudiante`**: Obtener un estudiante por ID (admin/profesor/estudiante)
- **POST `/estudiantes`**: Crear estudiante (admin)
- **PUT `/estudiantes/:id_estudiante`**: Actualizar estudiante (admin/profesor)
- **DELETE `/estudiantes/:id_estudiante`**: Eliminar estudiante (admin)
- **GET `/estudiantes/:id_estudiante/materias`**: Materias inscritas (admin/profesor/estudiante)
- **POST `/estudiantes/:id_estudiante/materias`**: Asignar materia (admin/profesor)
- **DELETE `/estudiantes/:id_estudiante/materias/:codigo_materia`**: Quitar materia (admin/profesor)
- **GET `/estudiantes/perfil`**: Perfil del estudiante autenticado
- **PUT `/estudiantes/perfil`**: Modificar perfil del estudiante autenticado

#### Ejemplo de respuesta GET `/estudiantes`
```json
[
  {
    "id_estudiante": "ST001",
    "nombre": "Juan",
    "apellido": "Pérez",
    "cedula": "12345678",
    "telefono": "123456789",
    "direccion": "Calle Falsa 123",
    "anio": 2023,
    "seccion": "A"
  }
]
```

---

### 2. Profesores
- **GET `/profesores`**: Listar todos los profesores (admin)
- **GET `/profesores/:id_profesor`**: Obtener un profesor por ID (admin/profesor)
- **POST `/profesores`**: Crear profesor (admin)
- **PUT `/profesores/:id_profesor`**: Actualizar profesor (admin)
- **DELETE `/profesores/:id_profesor`**: Eliminar profesor (admin)
- **GET `/profesores/:id_profesor/materias`**: Materias asignadas (admin/profesor)
- **POST `/profesores/:id_profesor/materias`**: Asignar materia (admin)
- **DELETE `/profesores/:id_profesor/materias/:codigo_materia`**: Quitar materia (admin)

#### Ejemplo de respuesta GET `/profesores`
```json
[
  {
    "id_profesor": "PR001",
    "nombre": "María",
    "apellido": "López",
    "cedula": "87654321",
    "telefono": "987654321",
    "direccion": "Avenida Siempre Viva"
  }
]
```

---

### 3. Materias
- **GET `/materias`**: Listar todas las materias
- **GET `/materias/:codigo_materia`**: Obtener materia por código
- **POST `/materias`**: Crear materia (admin)
- **PUT `/materias/:codigo_materia`**: Actualizar materia (admin)
- **DELETE `/materias/:codigo_materia`**: Eliminar materia (admin)
- **GET `/materias/:codigo_materia/estudiantes`**: Listar estudiantes inscritos
- **GET `/materias/:codigo_materia/profesores`**: Listar profesores asignados

#### Ejemplo de respuesta GET `/materias`
```json
[
  {
    "codigo_materia": "MAT101",
    "nombre": "Matemáticas",
    "descripcion": "Álgebra y geometría"
  }
]
```

---

### 4. Notas
- **GET `/notas`**: Listar todas las notas (admin/profesor)
- **GET `/notas/:id`**: Obtener nota por ID (admin/profesor)
- **POST `/notas`**: Crear nota (profesor)
- **PUT `/notas/:id`**: Actualizar nota (profesor)
- **DELETE `/notas/:id`**: Eliminar nota (profesor)

#### Ejemplo de respuesta GET `/notas`
```json
[
  {
    "id": 1,
    "estudianteId": "ST001",
    "materiaId": "MAT101",
    "profesorId": "PR001",
    "periodo": "2024-1",
    "valor": 18.5
  }
]
```

---

### 5. Periodos
- **GET `/periodos`**: Listar periodos
- **GET `/periodos/:id`**: Obtener periodo por ID
- **POST `/periodos`**: Crear periodo (admin)
- **PUT `/periodos/:id`**: Actualizar periodo (admin)
- **DELETE `/periodos/:id`**: Eliminar periodo (admin)

---

### 6. Usuarios
- **GET `/usuarios`**: Listar usuarios (admin)
- **GET `/usuarios/:id`**: Obtener usuario por ID (admin)
- **POST `/usuarios`**: Crear usuario (admin)
- **PUT `/usuarios/:id`**: Actualizar usuario (admin)
- **DELETE `/usuarios/:id`**: Eliminar usuario (admin)

---

### 7. Secciones
- **GET `/secciones`**: Listar secciones
- **GET `/secciones/:id`**: Obtener sección por ID
- **POST `/secciones`**: Crear sección (admin)
- **PUT `/secciones/:id`**: Actualizar sección (admin)
- **DELETE `/secciones/:id`**: Eliminar sección (admin)

---

### 8. Profesor-Materias
- **GET `/profesor-materias`**: Listar asignaciones
- **GET `/profesor-materias/:id`**: Obtener asignación por ID
- **POST `/profesor-materias`**: Crear asignación (admin)
- **PUT `/profesor-materias/:id`**: Actualizar asignación (admin)
- **DELETE `/profesor-materias/:id`**: Eliminar asignación (admin)

---

### 9. Historial de Notas
- **GET `/historial-notas`**: Listar historial (admin)
- **GET `/historial-notas/:estudianteId`**: Historial de un estudiante (admin)
- **POST `/historial-notas`**: Crear registro (admin)

---

### 10. Dashboard y Reportes
- **GET `/dashboard/counts`**: Contar estudiantes y profesores
- **GET `/reportes/usuarios`**: Contar usuarios por tipo

---

### 11. Autenticación
- **POST `/auth/register`**: Registrar usuario (admin)
- **POST `/auth/login`**: Iniciar sesión

#### Ejemplo de login
```json
{
  "username": "admin",
  "password": "admin123"
}
```
Respuesta:
```json
{
  "token": "..."
}
```

---

### Notas generales
- Todas las rutas protegidas requieren el header `Authorization: Bearer <token>`.
- Los roles válidos son: `admin`, `profesor`, `estudiante`.
- Los ejemplos de respuesta pueden variar según los datos reales.
- Para rutas con parámetros, reemplaza los valores entre `:` por el valor real.
