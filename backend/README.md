# Backend - Municipalidad Yau

Este proyecto contiene el backend para el sistema de gestión de la Municipalidad de Yau, enfocado en el manejo de usuarios y licencias.

---

## Requisitos Previos

*   Node.js (se recomienda v18.x o superior)
*   npm (v9.x o superior)
*   PostgreSQL (se recomienda v14 o superior)

## Instalación

1.  **Clonar el repositorio**
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd municipalidad-backend
    ```

2.  **Instalar dependencias**
    ```bash
    npm install
    ```

3.  **Configurar variables de entorno**
    Copia el archivo `.env.example` a un nuevo archivo llamado `.env` y completa los valores requeridos.
    ```bash
    cp .env.example .env
    ```
    Asegúrate de configurar al menos las credenciales de la base de datos y el secreto para JWT.

4.  **Preparar la Base de Datos**
    Crea una base de datos en PostgreSQL con el nombre y usuario que especificaste en tu archivo `.env`.

5.  **Ejecutar migraciones**
    Esto creará las tablas necesarias en tu base de datos.
    ```bash
    npm run migrar
    ```

## Uso

*   **Iniciar en modo de desarrollo** (con recarga automática)
    ```bash
    npm run dev
    ```
    El servidor se ejecutará en `http://localhost:4000` (o el puerto que definas en `.env`).

*   **Documentación de la API**
    Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva de la API (generada con Scalar) en la siguiente URL:
    http://localhost:4000/api/docs
