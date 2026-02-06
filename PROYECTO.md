# Documentación del Proyecto: Sistema de Control de Equipo de Cómputo

## 👥 Definición de Roles


| Miembro | Rol | Responsabilidades Principales |
| :--- | :--- | :--- |
| **Angelica Alexandra** | **Project Manager (PM)** | Gestión del Kanban, control de tiempos, documentación técnica y comunicación interna. |
| **Rafael** | **Frontend Lead** | Arquitectura en React/Vue, diseño de componentes y consumo de APIs. |
| **Oliver Benjamin** | **Backend Lead** | Desarrollo de la API con Flask/FastAPI, lógica de tickets y seguridad. |
| **Heliodoro** | **Database Administrator (DBA)** | Diseño del esquema MySQL, optimización de consultas y migración de datos. |
| **Brian Enrique** | **QA & Testing Engineer** | Pruebas de software, validación de Historias de Usuario y reporte de bugs. |
| **Erick de Jesus** | **UI/UX & Frontend Support** | Diseño de interfaces, estilos (CSS), y apoyo en la integración con el frontend. |

---

## 📋 Product Backlog Inicial

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
