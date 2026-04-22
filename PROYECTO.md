# Documentación del Proyecto: Sistema de Control de Equipo de Cómputo

## Definición de Roles


| Miembro | Rol | Responsabilidades Principales |
| :--- | :--- | :--- |
| **Angelica Alexandra** | **Project Manager (PM)** | Gestión del Kanban, control de tiempos, documentación técnica y comunicación interna. |
| **Rafael** | **Frontend Lead** | Arquitectura en React/Vue, diseño de componentes y consumo de APIs. |
| **Oliver Benjamin** | **Backend Lead** | Desarrollo de la API con Flask/FastAPI, lógica de tickets y seguridad. |
| **Heliodoro** | **Database Administrator (DBA)** | Diseño del esquema MySQL, optimización de consultas y migración de datos. |
| **Brian Enrique** | **QA & Testing Engineer** | Pruebas de software, validación de Historias de Usuario y reporte de bugs. |
| **Erick de Jesus** | **UI/UX & Frontend Support** | Diseño de interfaces, estilos (CSS), y apoyo en la integración con el frontend. |

---

## Product Backlog Inicial

### Fase 1: Cimientos y Autenticación
* **H01:** Sistema de Login con JWT (Admin, Técnico, Usuario).
* **H02:** Middleware de protección de rutas basado en roles.

### Fase 2: Gestión de Inventario (ITAM)
* **H03:** CRUD completo de Equipos (ID, Marca, Modelo, Serie, Ubicación).
* **H04:** Buscador y filtros de equipos por estado (Activo, Mantenimiento, Baja).

### Fase 3: Ciclo de Vida del Ticket
* **H05:** Formulario de creación de ticket (Usuario final).
* **H06:** Panel de asignación de tickets (Solo Admin).
* **H07:** Gestión de estados (Abierto -> En Proceso -> Resuelto).
* **H08:** Módulo de comentarios y carga de evidencias (Imágenes).

### Fase 4: Reportes y Auditoría
* **H09:** Generación de histórico por equipo (Hoja de vida del equipo).
* **H10:** Reporte de rendimiento por técnico.

  # Plan de Trabajo y Actualizaciones - 2do Avance

Este documento detalla los cambios y asignaciones para la próxima integración de nuestro sistema de control y soporte. 

>  **IMPORTANTE:** Todos los cambios detallados a continuación fueron realizados **exclusivamente** dentro de la carpeta `2do avance`. 

---

## 1. Tareas realizadas por Integrante

###  Angelica
- [ ] **Subio los recursos gráficos:** Agrego dos nuevos archivos `.png` dentro de la carpeta `imagenes`.
  - **Descripción:** Estas imágenes corresponden a los modelos esperados construidos en Figma (Dashboard del técnico y Dashboard del usuario básico).

###  Oliver
- [ ] **Actualizo `frontend/dashboard.css`**
  - **Instrucción** *"Agregando nuevos estilos para la sección de creación de formularios de reportes."*
- [ ] **Actualizo `frontend/style.css`**
  - **Instrucción** *"Estilos agregados para la estructura de los formularios."*

###  Rafael
- [ ] **Actualizo `dashboard.html`**
  - **Instrucción:** *"Integración de nuevo panel para agregar reportes. El reporte ahora se clasifica en niveles de prioridad y categoría (Software, Hardware o Problemas Externos)."*

###  Brian
- [ ] **Actualizo `dashboard.js`**
  - **Instrucción** *"Actualización de iconos propuestos, mejora en el panel de navegación y habilitación del botón de redirección al nuevo panel de creación de reportes."*
- [ ] **Actualizo `scripts.js`**
  - **Instrucción:** *"Creación de validación del formulario de reportes para el envío de datos al backend (Python) y a la nueva tabla de reportes en la base de datos."*

###  Zeuz
- [ ] **Nuevo archivo de Backend (Python)**
  - **Instrucción** *"Conexión de Python con la base de datos y creación de la ruta para recibir los datos de los reportes nuevos."*
- [ ] **Actualización de Base de Datos (phpMyAdmin)**
  - **Descripción:** Crear una nueva tabla llamada `reportes` que recibirá la información enviada desde el frontend, asegurando que a cada registro se le asigne un `id_reportes` único para su identificación.

#  3er Avance - Actualizaciones y Mejoras del Código

Este documento detalla las implementaciones realizadas en la base de datos, el backend, el frontend y las nuevas capas de seguridad del sistema.

---

##  1. Base de Datos (XAMPP / phpMyAdmin)
- **Nueva tabla de Perfiles de Técnicos:** Se creó una tabla vinculada exclusiva para almacenar información pública de los técnicos (fotografía, carrera académica, especialidad, etc.) para mantener esta información separada de las credenciales de acceso.
- **Actualización de Roles:** Se modificó la tabla `usuarios`. La columna `rol` ahora incluye la opción de **Administrador**.
- **Registro Inicial:** Se registró con éxito el primer usuario Administrador en el sistema.

##  2. Backend - Módulo de Administración (Python / `main.py`)
Se crearon tres nuevas rutas exclusivas para que el Administrador pueda gestionar a los usuarios y reportes desde el servidor:
- `GET /admin/usuarios`: Permite leer y obtener todos los usuarios registrados para desplegarlos en la tabla del panel.
- `PUT /admin/usuarios/<id>`: Endpoint de edición que recibe un ID para modificar el rol (Básico, Técnico o Admin) y permite forzar el cambio de contraseña en caso de olvido.
- `DELETE /admin/usuarios/<id>`: Endpoint de eliminación para borrar permanentemente a un usuario del sistema (escuela/empresa).

##  3. Frontend - Pantalla del Administrador (HTML / JS)
- **`dashboard.html`:** Se diseñó el menú exclusivo para el rol Admin. Se construyó una tabla dedicada para visualizar usuarios y una ventana modal para la edición de sus datos.
- **`dashboard.js`:** 
  - Se agregó la nueva vista del administrador con la lógica necesaria para mostrarla u ocultarla según el contexto.
  - Se actualizó el bloque de condicionales (`if`) para validar correctamente el rol de Administrador.
  - Se integró el código funcional para cargar la tabla dinámica, abrir el modal de edición, guardar nuevas contraseñas y ejecutar la eliminación de usuarios.

##  4. Vista "Mis Técnicos"
- Se conectó la información de la base de datos para que el **usuario básico** pueda visualizar correctamente los perfiles públicos de los técnicos directamente en su panel.

##  5. Seguridad y Encriptación (Werkzeug)
- **Importación de Librerías:** Se agregó la importación de las herramientas de seguridad de `Werkzeug` (la librería nativa de Flask) en el archivo `main.py` para el manejo de encriptación.
- **Blindaje de Registro:** Se implementó `generate_password_hash(password_texto_plano)`. Antes de realizar el `INSERT INTO`, la contraseña escrita por el usuario se transforma en un hash indescifrable.
- **Blindaje de Login:** Se eliminó la validación directa con `==`. Ahora se utiliza `check_password_hash` para comparar de forma segura la contraseña ingresada con el texto encriptado de la base de datos.

##  6. Autenticación y Autorización Avanzada
Atendiendo a las observaciones de la revisión anterior, se reforzó la arquitectura de seguridad del sistema con las siguientes implementaciones:

*   **Contraseñas blindadas:** Se aplicaron *hashes* criptográficos. Ya no es posible leer las contraseñas en texto plano dentro de la base de datos, garantizando la privacidad de los usuarios.
*   **Identidad segura (Tokens JWT):** Se eliminó la dependencia e inseguridad de confiar en el `localStorage` para la validación de identidad. Ahora el sistema utiliza **JSON Web Tokens (JWT)**, los cuales garantizan sesiones seguras e infalsificables.
*   **Implementación de RolesGuard:** Se desarrolló y aplicó el decorador `@requiere_rol`, el cual funciona como un escudo impenetrable en el backend para proteger las rutas, vistas y acciones sensibles del sistema según los privilegios del usuario.

## Entorno de Desarrollo Profesional

*   **Live Server (Visual Studio Code):** Se integró el uso de la extensión *Live Server* para el entorno de trabajo. Esto permite que la dirección local del proyecto se despliegue y visualice de una manera mucho más limpia y profesional (mediante una dirección IP de red local) en lugar de rutas de archivos estáticos.

## Corrección de Bugs y Vulnerabilidades (Tickets)

*   **Parche de seguridad en la creación de reportes:** Se identificó y solucionó una vulnerabilidad crítica de suplantación de identidad (Spoofing). Anteriormente, un usuario malintencionado podía utilizar las herramientas de desarrollador del navegador (F12) para interceptar la petición HTTP y manipular el `usuario_id` (por ejemplo, enviando el ID "1" para suplantar a un Director o Admin).
*   **Validación estricta en `reports.py`:** Para erradicar este bug, se integraron nuevas librerías en el archivo `reports.py`. Ahora es obligatorio el envío y validación del Token JWT al momento de agregar reportes, asegurando que el ID del creador del ticket coincida criptográficamente con el usuario autenticado que realiza la petición.
