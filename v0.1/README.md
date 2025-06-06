# SIGEA - Sistema Integral de Gestión Escolar y Académica

## Descripción
SIGEA es un sistema web para la gestión escolar y académica, desarrollado en Node.js y PostgreSQL. Permite administrar usuarios, estudiantes, profesores, materias, inscripciones, notas y reportes avanzados. Incluye control de roles (admin, profesor, estudiante) y un frontend moderno para la gestión y consulta de datos.

### Funcionalidades principales
- Registro y login de usuarios con roles (admin, profesor, estudiante)
- Gestión de estudiantes, profesores y materias
- Inscripción de estudiantes en materias y asignación de profesores
- Registro y edición de notas
- Reportes avanzados: materias y notas de estudiantes, inscripciones por período, estudiantes por materia o sección
- Panel de control y control de acceso por rol

## Estructura del proyecto
- `src/backend/` : Código backend (Node.js, Express, SQL)
- `src/` : Archivos frontend (HTML, CSS, JS)
- `src/assets/` : Imágenes, íconos, fuentes, etc.
- `src/sistema_notas_postgresql.sql` : Script SQL para la base de datos
- `instalar_dependencias.bat` : Script para instalar dependencias del backend

## Requisitos
- Node.js (v16+ recomendado)
- PostgreSQL (base de datos creada y accesible)

## Instalación y primer uso
1. **Clona el repositorio y entra a la carpeta del proyecto**
2. **Crea la base de datos en PostgreSQL**
   - Nombre sugerido: `sigea-data`
   - Ejecuta el script `src/sistema_notas_postgresql.sql` para crear las tablas
   - Ejecuta también `src/backend/usuarios.sql` para la tabla de usuarios
3. **Configura las variables de entorno**
   - Crea un archivo `.env` en `src/backend/` con:
     ```
     PGHOST=localhost
     PGUSER=tu_usuario
     PGPASSWORD=tu_password
     PGDATABASE=sigea-data
     PGPORT=5432
     JWT_SECRET=un_secreto_seguro
     ```
4. **Instala las dependencias**
   - Ejecuta el script `instalar_dependencias.bat` (doble clic o desde consola)
5. **Crea un usuario admin directamente en la base de datos**
   - Inserta un usuario con rol `admin` usando SQL (ver ejemplo en usuarios.sql o pide ayuda aquí)
6. **Inicia el backend**
   - Desde consola: `cd src/backend && node server.js`
7. **Abre el frontend**
   - Abre `src/index.html` o `src/login.html` en tu navegador

## Notas
- El sistema requiere iniciar sesión para acceder a la mayoría de las funciones.
- Los reportes avanzados están en `src/reportes.html`.
- Puedes personalizar los assets en `src/assets/`.

## ¿Dudas o problemas?
Si tienes algún inconveniente, revisa la consola del navegador y la terminal del backend. Puedes pedir ayuda aquí mismo.