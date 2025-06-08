# API Documentation

## Base URL
```
http://localhost:3000/api
```

---

## Endpoints

### 1. **Estudiantes**
#### GET `/estudiantes`
- **Description:** Obtener todos los estudiantes.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Response:**
```json
[
  {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Perez",
    "cedula": "12345678",
    "telefono": "123456789",
    "fecha_nacimiento": "2000-01-01",
    "direccion": "Calle Falsa 123",
    "anio": "2023",
    "seccion": "A"
  }
]
```

#### POST `/estudiantes`
- **Description:** Crear un nuevo estudiante.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Body:**
```json
{
  "nombre": "Juan",
  "apellido": "Perez",
  "cedula": "12345678",
  "telefono": "123456789",
  "fecha_nacimiento": "2000-01-01",
  "direccion": "Calle Falsa 123",
  "anio": "2023",
  "seccion": "A"
}
```
- **Response:**
```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Perez",
  "cedula": "12345678",
  "telefono": "123456789",
  "fecha_nacimiento": "2000-01-01",
  "direccion": "Calle Falsa 123",
  "anio": "2023",
  "seccion": "A"
}
```

#### PUT `/estudiantes/:id`
- **Description:** Actualizar un estudiante por ID.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Body:**
```json
{
  "nombre": "Juan",
  "apellido": "Perez"
}
```
- **Response:**
```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Perez",
  "cedula": "12345678",
  "telefono": "123456789",
  "fecha_nacimiento": "2000-01-01",
  "direccion": "Calle Falsa 123",
  "anio": "2023",
  "seccion": "A"
}
```

#### DELETE `/estudiantes/:id`
- **Description:** Eliminar un estudiante por ID.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Response:**
```json
{
  "id": 1
}
```

#### GET `/estudiantes/perfil`
- **Description:** Obtener los datos personales del estudiante que inició sesión.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Response:**
```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Perez",
  "cedula": "12345678",
  "telefono": "123456789",
  "fecha_nacimiento": "2000-01-01",
  "direccion": "Calle Falsa 123",
  "anio": "2023",
  "seccion": "A"
}
```

#### PUT `/estudiantes/perfil`
- **Description:** Modificar los datos de perfil del estudiante que inició sesión.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Body:**
```json
{
  "username": "nuevoUsuario",
  "password": "nuevaContraseña"
}
```
- **Response:**
```json
{
  "message": "Perfil actualizado correctamente."
}
```

---

### 2. **Profesores**
#### GET `/profesores`
- **Description:** Obtener todos los profesores.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Response:**
```json
[
  {
    "id": 1,
    "nombre": "Maria",
    "apellido": "Lopez",
    "cedula": "87654321",
    "telefono": "987654321",
    "direccion": "Avenida Siempre Viva",
    "materia": "Matemáticas"
  }
]
```

#### POST `/profesores`
- **Description:** Crear un nuevo profesor.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Body:**
```json
{
  "nombre": "Maria",
  "apellido": "Lopez",
  "cedula": "87654321",
  "telefono": "987654321",
  "direccion": "Avenida Siempre Viva",
  "materia": "Matemáticas"
}
```
- **Response:**
```json
{
  "id": 1,
  "nombre": "Maria",
  "apellido": "Lopez",
  "cedula": "87654321",
  "telefono": "987654321",
  "direccion": "Avenida Siempre Viva",
  "materia": "Matemáticas"
}
```

#### PUT `/profesores/:id`
- **Description:** Actualizar un profesor por ID.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Body:**
```json
{
  "nombre": "Maria",
  "apellido": "Lopez"
}
```
- **Response:**
```json
{
  "id": 1,
  "nombre": "Maria",
  "apellido": "Lopez",
  "cedula": "87654321",
  "telefono": "987654321",
  "direccion": "Avenida Siempre Viva",
  "materia": "Matemáticas"
}
```

#### DELETE `/profesores/:id`
- **Description:** Eliminar un profesor por ID.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Response:**
```json
{
  "id": 1
}
```

#### GET `/profesores/estudiantes`
- **Description:** Obtener la lista de estudiantes asignados al profesor que inició sesión.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Response:**
```json
[
  {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Perez",
    "cedula": "12345678",
    "telefono": "123456789",
    "fecha_nacimiento": "2000-01-01",
    "direccion": "Calle Falsa 123",
    "anio": "2023",
    "seccion": "A"
  }
]
```

#### PUT `/profesores/notas`
- **Description:** Modificar la nota de un estudiante asignado al profesor que inició sesión.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Body:**
```json
{
  "estudianteId": 1,
  "materiaId": 2,
  "nota": 18
}
```
- **Response:**
```json
{
  "message": "Nota actualizada correctamente."
}
```

---

### 3. **Administradores**
#### PUT `/secciones/:id`
- **Description:** Cambiar la sección de un profesor.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Body:**
```json
{
  "tutorId": 5
}
```
- **Response:**
```json
{
  "message": "Sección actualizada correctamente."
}
```

---

### 4. **Autenticación**
#### POST `/auth/register`
- **Description:** Registrar un nuevo usuario.
- **Body:**
```json
{
  "username": "admin",
  "password": "admin123",
  "rol": "admin"
}
```
- **Response:**
```json
{
  "id": 1,
  "username": "admin",
  "rol": "admin"
}
```

#### POST `/auth/login`
- **Description:** Iniciar sesión.
- **Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```
- **Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbCI6ImFkbWluIiwiaWF0IjoxNjE2MjM5MDIyfQ.4XJ9XJ9XJ9XJ9XJ9XJ9XJ9XJ9XJ9XJ9XJ9XJ9XJ9"
}
```

---

### Nota
- Todas las rutas protegidas requieren el encabezado `Authorization` con un token válido.
- Los datos de ejemplo son ilustrativos y pueden variar según la implementación.
