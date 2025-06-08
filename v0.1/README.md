# Sistema de Gestión y Control de Notas Académicas (Versión 0.1)

## Descripción
Esta versión inicial del sistema permite gestionar las notas académicas de estudiantes en una institución educativa. Incluye funcionalidades básicas para la administración de estudiantes, profesores y materias.

### Funcionalidades

#### **Estudiantes**
- Registro de estudiantes con datos básicos.
- Visualización de notas (funcionalidad limitada).

#### **Profesores**
- Registro de profesores y asignación de materias.

#### **Administradores**
- Gestión básica de estudiantes, profesores y materias.

## Instalación
1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```
2. Ejecuta el script de instalación:
   ```bash
   ./instalar_dependencias.bat
   ```
3. Configura las variables de entorno en un archivo `.env`.
4. Inicia el servidor:
   ```bash
   node src/backend/server.js
   ```

## Uso
- Accede al sistema a través de los archivos HTML en la carpeta `src`.
- Consulta las bases de datos iniciales en los archivos SQL de la carpeta `backend`.

## Tecnologías
- Node.js
- PostgreSQL

## Contribución
1. Haz un fork del repositorio.
2. Crea una rama para tu funcionalidad:
   ```bash
   git checkout -b nueva-funcionalidad
   ```
3. Realiza tus cambios y haz un commit:
   ```bash
   git commit -m "Descripción de los cambios"
   ```
4. Haz un push a tu rama:
   ```bash
   git push origin nueva-funcionalidad
   ```
5. Abre un pull request.