# Sistema de Gestión de Notas Académicas

## Descripción General
Este proyecto es un sistema de gestión de notas académicas diseñado para facilitar la administración de estudiantes, materias, profesores y calificaciones en un entorno educativo. El sistema está dividido en dos versiones principales:

### Versión 0.1
La versión inicial del proyecto incluye una interfaz gráfica básica y scripts SQL para la base de datos. Sin embargo, esta versión presentó problemas significativos:
- **Error de arranque del backend**: El servidor no se iniciaba correctamente debido a configuraciones incorrectas.
- **Problemas de conexión con la base de datos**: La conexión con la base de datos PostgreSQL no funcionaba como se esperaba.

### Versión 0.2
La segunda versión del proyecto se centra exclusivamente en el backend modular y las APIs indispensables para el sistema. Esta versión incluye:
- **Backend modular**: Código organizado en módulos para facilitar el mantenimiento y la escalabilidad.
- **APIs indispensables**: Endpoints para gestionar estudiantes, materias, profesores, notas y autenticación.

## Estructura del Proyecto
El proyecto está organizado en las siguientes carpetas:

- **v0.1/**: Contiene la interfaz gráfica y scripts SQL iniciales.
- **v0.2/**: Incluye el backend modular y las APIs.

### Detalles de la Versión 0.2
La versión 0.2 está estructurada de la siguiente manera:
- **src/**: Contiene el código fuente del backend.
  - **auth/**: Módulo de autenticación.
  - **config/**: Configuración del sistema.
  - **controllers/**: Controladores para manejar la lógica de negocio.
  - **db/models/**: Modelos de la base de datos.
  - **libs/**: Librerías auxiliares.
  - **middleware/**: Middleware para la aplicación.
  - **routes/**: Rutas de las APIs.
  - **services/**: Servicios para la lógica de negocio.

## Instalación
Para instalar las dependencias del proyecto, ejecuta el siguiente comando en la carpeta `v0.2`:
```bash
npm install
```

## Uso
1. Configura las variables de entorno en un archivo `.env`.
2. Inicia el servidor ejecutando:
```bash
node src/app.js
```

## Contribución
Si deseas contribuir al proyecto, por favor realiza un fork del repositorio y envía tus pull requests.

## Licencia
Este proyecto está bajo la licencia MIT.
