# Actualización de Schema.sql - Resumen de Cambios

Última actualización: 2026-03-04

## Cambios Realizados

### 1. **Tabla `tickets` - Nuevos Campos**

Se agregaron dos nuevas columnas a la tabla tickets:

#### `category` (ENUM)
**Tipo:** ENUM con 9 opciones
**Valores permitidos:**
- Hardware
- Software
- Red
- Impresoras
- Monitor
- Teclado/Ratón
- Correo
- Sistema Operativo
- Otro

**Default:** 'Otro'

#### `priority` (ENUM)
**Tipo:** ENUM con 4 opciones
**Valores permitidos:**
- Baja
- Media
- Alta
- Crítica

**Default:** 'Media'

---

### 2. **Índices Agregados a `tickets`**

```sql
INDEX idx_category (category)
INDEX idx_priority (priority)
```

Estos índices mejoran las consultas de filtrado por categoría y prioridad.

---

### 3. **Nuevos Procedimientos Almacenados**

#### `sp_tickets_by_category(categoryName)`
Obtiene todos los tickets de una categoría específica, ordenados por prioridad.

```sql
CALL sp_tickets_by_category('Hardware');
```

#### `sp_tickets_by_priority(priorityName)`
Obtiene todos los tickets de una prioridad específica (excluyendo cerrados).

```sql
CALL sp_tickets_by_priority('Alta');
```

---

### 4. **Ejemplos de Consultas Útiles Agregados**

Se incluyen ejemplos documentados de consultas comunes:

1. **Tickets críticos sin asignar**
2. **Tickets por categoría** con orden por prioridad
3. **Reporte totales por categoría**
4. **Tickets asignados a un técnico**
5. **Tiempo promedio de resolución**
6. **Resumen por estado y categoría**

---

## Estructura Actualizada de `tickets`

```sql
CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT NOT NULL,
    status ENUM('Pendiente', 'En proceso', 'Resuelto', 'Cerrado') NOT NULL DEFAULT 'Pendiente',
    category ENUM('Hardware', 'Software', ...) NOT NULL DEFAULT 'Otro',           --  NUEVO
    priority ENUM('Baja', 'Media', 'Alta', 'Crítica') NOT NULL DEFAULT 'Media', --  NUEVO
    evidenceText LONGTEXT,
    reportedById INT NOT NULL,
    assignedToId INT,
    equipmentId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Relaciones
    CONSTRAINT fk_ticket_reportedBy FOREIGN KEY (reportedById) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ticket_assignedTo FOREIGN KEY (assignedToId) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_ticket_equipment FOREIGN KEY (equipmentId) REFERENCES equipments(id) ON DELETE SET NULL,
    
    -- Índices
    INDEX idx_status (status),
    INDEX idx_category (category),      -- NUEVO
    INDEX idx_priority (priority),      -- NUEVO
    INDEX idx_reportedById (reportedById),
    INDEX idx_assignedToId (assignedToId),
    INDEX idx_equipmentId (equipmentId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## Cómo Actualizar una BD Existente

Si ya tienes la base de datos creada, ejecuta:

```bash
cd backend
node update-db.js
```

Este script agregará automáticamente los campos `category` y `priority` a la tabla `tickets`.

---

## Crear BD desde Cero

```bash
cd backend
node setup-db.js
```

Esto creará la BD con la estructura completa incluyendo los nuevos campos.

---

##  Validación del Esquema

Para verificar que los cambios se aplicaron correctamente:

```sql
DESCRIBE tickets;
```

Deberías ver:
- `category` - ENUM
- `priority` - ENUM

---

##  Pruebas de Procedimientos Almacenados

```sql
-- Tickets de categoría Hardware
CALL sp_tickets_by_category('Hardware');

-- Tickets con prioridad Alta
CALL sp_tickets_by_priority('Alta');

-- Histórico de equipo
CALL sp_equipment_history(1);

-- Rendimiento de técnicos
CALL sp_technician_performance('2024-01-01', '2026-03-04');
```

---

## Todas las Tablas

1. `users` - Usuarios del sistema
2. `equipments` - Inventario de equipos
3.  `tickets` - Reportes/tickets (ACTUALIZADA)
4.  `ticket_comments` - Comentarios en tickets
5.  `ticket_evidence` - Evidencias/archivos

---

##  Usuario Admin

```
Email: admin@tecnm.mx
Contraseña: Admin123!
Rol: Admin
Área: Sistemas
```

---

**Schema.sql completamente actualizado y listo para usar** 
