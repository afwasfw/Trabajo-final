# Portal de Trámites Digitales - Municipalidad de Yau

Este es un proyecto full-stack diseñado para modernizar y digitalizar la gestión de trámites municipales. Permite a los ciudadanos iniciar y dar seguimiento a sus solicitudes en línea, y proporciona a los administradores las herramientas para gestionar estos procesos de manera eficiente.

## ✨ Características Principales

*   **Autenticación de Usuarios**: Sistema de registro e inicio de sesión seguro, con opción de usar credenciales locales o una cuenta de Google.
*   **Catálogo de Trámites Dinámico**: Los administradores pueden definir y gestionar los tipos de trámites que ofrece la municipalidad sin necesidad de cambiar el código.
*   **Gestión de Solicitudes**: Los ciudadanos pueden iniciar nuevas solicitudes, adjuntar los documentos requeridos y dar seguimiento a su estado.
*   **Predicción de Prioridad con IA**: Utiliza un modelo de Machine Learning para asignar una prioridad (Alta, Media, Baja) a cada nueva solicitud, ayudando a los administradores a gestionar su carga de trabajo.
*   **Interfaz Moderna y Responsiva**: Diseño limpio, profesional y adaptable a dispositivos móviles, con funcionalidades como búsqueda y paginación.
*   **Descarga Segura de Archivos**: Los usuarios solo pueden descargar los documentos que les pertenecen.

## 🚀 Stack Tecnológico

El proyecto está dividido en dos componentes principales: un backend robusto y un frontend moderno.

### Backend

*   **Entorno**: Node.js
*   **Framework**: Express.js
*   **Base de Datos**: MySQL (provista por XAMPP) con Knex.js como constructor de consultas y gestor de migraciones.
*   **Dependencias Clave**:
    *   `express`: Servidor web.
    *   `knex`: Constructor de consultas SQL y migraciones.
    *   `mysql2`: Driver de MySQL para Knex.
    *   `bcrypt`: Para el hash de contraseñas.
    *   `jsonwebtoken`: Para la autenticación JWT.
    *   `firebase-admin`: Para la autenticación con Google.
    *   `multer`: Para la subida de archivos.
    *   `python-shell`: Para la integración con scripts de Python (ML).
    *   `dotenv`: Para la gestión de variables de entorno.
    *   `helmet`: Para cabeceras de seguridad HTTP.
    *   `cors`: Para la gestión de políticas de origen cruzado.
    *   `uuid`: Para generar IDs únicos (códigos de seguimiento).
    *   `pino`, `pino-pretty`: Para logging estructurado y legible.

### Frontend

*   **Framework**: React (con Vite como herramienta de construcción).
*   **Enrutamiento**: `react-router-dom`.
*   **Estilos**: Bootstrap 5 y Bootstrap Icons, con un archivo `App.css` para personalizaciones.
*   **Dependencias Clave**:
    *   `react`, `react-dom`: Librerías principales de React.
    *   `react-router-dom`: Para el enrutamiento en el frontend.
    *   `axios`: Cliente HTTP para comunicarse con el backend.
    *   `bootstrap`, `bootstrap-icons`: Framework y librería de iconos para el diseño.
    *   `react-datepicker`: Componente para la selección de fechas.
    *   `sweetalert2`: Para alertas y notificaciones personalizadas.
    *   `react-google-recaptcha-v3`: Para la integración con reCAPTCHA.
    *   `jwt-decode`: Para decodificar tokens JWT en el cliente.

### Machine Learning

*   **Lenguaje**: Python
*   **Librerías**: `pandas` para manipulación de datos, `scikit-learn` para el pipeline de preprocesamiento y el modelo, y `joblib` para guardar y cargar el modelo entrenado.

---

## ⚙️ Instalación y Configuración

Para ejecutar el proyecto completo, necesitas configurar tanto el backend como el frontend.

### Configuración del Backend

1.  **Requisitos Previos**:
    *   Node.js (v18.x o superior).
    *   XAMPP (que incluye MySQL) o una instalación de MySQL independiente.
    *   Python (v3.x) instalado y accesible desde la línea de comandos.

2.  **Instalación**:
    *   Navega a la carpeta `backend`.
    *   Ejecuta `npm install` para instalar las dependencias de Node.js.

3.  **Variables de Entorno (`.env`)**:
    *   Crea un archivo `.env` en la raíz de la carpeta `backend`.
    *   Configura las credenciales de tu base de datos (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).
    *   Define un `JWT_SECRET` para firmar los tokens.
    *   Añade la variable `FIREBASE_SERVICE_ACCOUNT` con el contenido del JSON de tu clave de servicio de Firebase para que funcione el login con Google.

4.  **Base de Datos (MySQL)**:
    *   Asegúrate de que tu servidor de base de datos esté corriendo y crea una base de datos con el nombre que especificaste en el `.env`.
    *   Ejecuta las migraciones para crear toda la estructura de tablas:
        ```bash
        npm run migrar
        ```

5.  **Entorno de Python**:
    *   Navega a la carpeta `backend/python_scripts`.
    *   Instala las dependencias de Python:
        ```bash
        pip install -r requirements.txt
        ```

### Configuración del Frontend

1.  **Requisitos Previos**:
    *   Node.js (v18.x o superior).

2.  **Instalación**:
    *   Navega a la carpeta `frontend`.
    *   Ejecuta `npm install` para instalar las dependencias.

3.  **Variables de Entorno (`.env`)**:
    *   Crea un archivo `.env` en la raíz de la carpeta `frontend`.
    *   Define la URL de tu API de backend: `VITE_API_URL=http://localhost:4000/api`.
    *   Añade tu clave de sitio de reCAPTCHA: `VITE_RECAPTCHA_SITE_KEY=...`.
    *   Si usas Google Login, añade `VITE_GOOGLE_CLIENT_ID=...`.
## ▶️ Ejecución de la Aplicación

Necesitarás dos terminales abiertas para ejecutar el proyecto.

1.  **Iniciar el Backend**:
    *   En una terminal, navega a la carpeta `backend`.
    *   Ejecuta el comando:
        ```bash
        npm run dev
        ```
    *   El servidor se iniciará en `http://localhost:4000` y se recargará automáticamente con los cambios.

2.  **Iniciar el Frontend**:
    *   En otra terminal, navega a la carpeta `frontend`.
    *   Ejecuta el comando:
        ```bash
        npm run dev
        ```
    *   La aplicación estará disponible en `http://localhost:5173` (o el puerto que indique Vite).

## 📂 Estructura del Proyecto

### Backend

*   `src/controladores`: Manejan las peticiones HTTP y las respuestas.
*   `src/servicios`: Contienen la lógica de negocio y las interacciones con la base de datos.
*   `src/rutas`: Definen las URLs de la API y las asocian a los controladores.
*   `src/middlewares`: Funciones intermedias para autenticación, validación, etc.
*   `migraciones`: Archivos para definir y versionar la estructura de la base de datos.
*   `python_scripts`: Scripts de Python para la predicción de Machine Learning.
*   `ml_models`: Almacena los modelos de IA entrenados (`.joblib`).

### Frontend

*   `src/pages`: Componentes que representan páginas completas de la aplicación.
*   `src/components`: Componentes reutilizables (como el Footer).
*   `src/context`: Lógica para el estado global (ej. `AuthContext`).
*   `src/routes`: Configuración del enrutador de la aplicación (`AppRouter`).
*   `src/api`: Configuración del cliente Axios (`apiClient`).
*   `public`: Carpeta para archivos estáticos como imágenes de fondo.
