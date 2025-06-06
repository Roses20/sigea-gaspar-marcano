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

---

### 3. **Materias**
#### GET `/materias`
- **Description:** Obtener todas las materias.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Response:**
```json
[
  {
    "id": 1,
    "nombre": "Matemáticas",
    "descripcion": "Materia de cálculo y álgebra"
  }
]
```

#### POST `/materias`
- **Description:** Crear una nueva materia.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Body:**
```json
{
  "nombre": "Matemáticas",
  "descripcion": "Materia de cálculo y álgebra"
}
```
- **Response:**
```json
{
  "id": 1,
  "nombre": "Matemáticas",
  "descripcion": "Materia de cálculo y álgebra"
}
```

#### PUT `/materias/:id`
- **Description:** Actualizar una materia por ID.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Body:**
```json
{
  "nombre": "Matemáticas Avanzadas"
}
```
- **Response:**
```json
{
  "id": 1,
  "nombre": "Matemáticas Avanzadas",
  "descripcion": "Materia de cálculo y álgebra"
}
```

#### DELETE `/materias/:id`
- **Description:** Eliminar una materia por ID.
- **Headers:**
  - `Authorization`: Bearer `<token>`
- **Response:**
```json
{
  "id": 1
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
