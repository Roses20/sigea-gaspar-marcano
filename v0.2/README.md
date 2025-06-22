# Sistema de Gestión y Control de Notas Académicas

## Descripción
Este sistema permite gestionar y controlar las notas académicas de estudiantes en una institución educativa. Está diseñado para tres tipos de usuarios: estudiantes, profesores y administradores.

### Funcionalidades

#### **Estudiantes**
- Ver sus propias notas en un año específico.
- Ver sus datos personales registrados en el sistema.
- Modificar su perfil (nombre de usuario y contraseña).

#### **Profesores**
- Ver la lista de estudiantes asignados según las materias y secciones.
- Modificar las notas de estudiantes asignados en el periodo escolar en curso.
- Ver sus datos personales registrados en el sistema.
- Modificar su perfil (nombre de usuario y contraseña).

#### **Administradores**
- Permisos generales para ver y modificar todos los datos del sistema:
  - Estudiantes
  - Profesores
  - Materias
  - Notas
  - Periodos
  - Secciones

## Instalación
1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en un archivo `.env`.
4. Inicia el servidor:
   ```bash
   npm start
   ```

## Configuración del archivo `.env`
Crea un archivo llamado `.env` en la carpeta `v0.2` con el siguiente formato y reemplaza los valores según tu entorno:

```
PORT=3000
DB_USER='postgres'
DB_PASSWORD='tu_contraseña'
DB_HOST='localhost'
DB_PORT='5432'
DB_NAME='nombre_base_datos'
# DATABASE_URL='postgres://postgres:tu_contraseña@localhost:5432/nombre_base_datos'  # Opcional
JWT_SECRET=tu_clave_secreta
```

- `PORT`: Puerto en el que se ejecutará el servidor (por defecto 3000).
- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME`: Datos de conexión a la base de datos PostgreSQL.
- `DATABASE_URL`: (Opcional) Cadena de conexión completa a tu base de datos PostgreSQL. Si no la defines, el sistema la generará automáticamente usando los datos individuales.
- `JWT_SECRET`: Clave secreta para firmar y verificar los tokens JWT.

## Uso
- Accede a la API en `http://localhost:3000/api`.
- Consulta la documentación completa en el archivo `API_DOCUMENTATION.md`.

## Tecnologías
- Node.js
- Express
- Sequelize
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
