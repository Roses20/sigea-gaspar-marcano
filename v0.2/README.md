# Resumen del Backend

Este backend está diseñado para gestionar un sistema académico. Proporciona APIs para manejar estudiantes, profesores, materias, notas, periodos, secciones y asignaciones de materias a profesores. Además, incluye autenticación mediante JWT y validación de datos para garantizar la seguridad y consistencia.

## Funcionalidades principales

1. **Gestión de estudiantes:**
   - Crear, leer, actualizar y eliminar estudiantes.

2. **Gestión de profesores:**
   - Crear, leer, actualizar y eliminar profesores.

3. **Gestión de materias:**
   - Crear, leer, actualizar y eliminar materias.

4. **Gestión de notas:**
   - Crear, leer, actualizar y eliminar notas.

5. **Gestión de periodos:**
   - Crear, leer, actualizar y eliminar periodos académicos.

6. **Gestión de secciones:**
   - Crear, leer, actualizar y eliminar secciones.

7. **Asignación de materias a profesores:**
   - Crear, leer, actualizar y eliminar asignaciones.

8. **Autenticación:**
   - Registro e inicio de sesión de usuarios.
   - Protección de rutas mediante tokens JWT.

9. **Validación de datos:**
   - Validación de datos en todas las rutas para garantizar la integridad.

## Tecnologías utilizadas

- **Node.js**
- **Express.js**
- **Sequelize** (ORM para bases de datos)
- **PostgreSQL**
- **JWT** (Autenticación)
- **Bcrypt** (Encriptación de contraseñas)
- **Express-validator** (Validación de datos)

## Cómo probar el proyecto

1. Clona el repositorio.
2. Instala las dependencias usando el script proporcionado.
3. Configura las variables de entorno en un archivo `.env`.
4. Ejecuta el servidor y prueba las APIs.

---

Para más detalles, consulta la documentación completa en `API_DOCUMENTATION.md`.
