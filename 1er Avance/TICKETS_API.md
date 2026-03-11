#  Tickets - Ejemplo de Uso

## Categorías Disponibles
```
- Hardware
- Software
- Red
- Impresoras
- Monitor
- Teclado/Ratón
- Correo
- Sistema Operativo
- Otro
```

## Prioridades Disponibles
```
- Baja
- Media (por defecto)
- Alta
- Crítica
```

---

## Crear Ticket (POST /tickets)

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Impresora no conecta a la red",
  "description": "La impresora de la oficina no está conectada a la red de datos. Hemos intentado reiniciarla sin éxito.",
  "category": "Impresoras",
  "priority": "Alta",
  "equipmentId": 1
}
```

**Curl:**
```bash
curl -X POST http://localhost:3000/tickets \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Impresora no conecta a la red",
    "description": "La impresora de la oficina no está conectada a la red de datos.",
    "category": "Impresoras",
    "priority": "Alta",
    "equipmentId": 1
  }'
```

**Respuesta Exitosa (201):**
```json
{
  "id": 1,
  "title": "Impresora no conecta a la red",
  "description": "La impresora de la oficina no está conectada a la red de datos.",
  "category": "Impresoras",
  "priority": "Alta",
  "status": "Pendiente",
  "reportedById": 1,
  "equipmentId": 1,
  "createdAt": "2026-03-04T12:00:00.000Z",
  "updatedAt": "2026-03-04T12:00:00.000Z"
}
```

---

## Listar Mis Tickets (GET /tickets/my-tickets)

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Curl:**
```bash
curl -X GET http://localhost:3000/tickets/my-tickets \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

**Respuesta:**
```json
[
  {
    "id": 1,
    "title": "Impresora no conecta a la red",
    "description": "La impresora de la oficina...",
    "category": "Impresoras",
    "priority": "Alta",
    "status": "Pendiente",
    "createdAt": "2026-03-04T12:00:00.000Z"
  }
]
```

---

##  Listar Tickets Asignados (GET /tickets/assigned) - Solo Técnicos

**Headers:**
```
Authorization: Bearer <JWT_TECNICO>
```

---

##  Actualizar Estado de Ticket (PUT /tickets/:id/status) - Solo Técnico

**Headers:**
```
Authorization: Bearer <JWT_TECNICO>
```

**Body:**
```json
{
  "status": "Resuelto",
  "evidenceText": "Se actualizó el driver de la impresora y se reconectó a la red."
}
```

**Estados Válidos:**
- Pendiente
- En proceso
- Resuelto
- Cerrado

---

## Asignar Ticket (PUT /tickets/:id/assign) - Solo Admin

**Headers:**
```
Authorization: Bearer <JWT_ADMIN>
```

**Body:**
```json
{
  "technicianId": 2
}
```

---

##  Prueba Completa en Postman

### 1. Login (Obtener token)
```
POST http://localhost:3000/auth/login
{
  "email": "admin@tecnm.mx",
  "password": "Admin123!",
  "area": "Sistemas"
}
```
Guardar token en variable `{{JWT_TOKEN}}`

### 2. Crear Ticket
```
POST http://localhost:3000/tickets
Headers: Authorization: Bearer {{JWT_TOKEN}}
{
  "title": "Monitor no enciende",
  "description": "El monitor de mi escritorio no enciende",
  "category": "Monitor",
  "priority": "Media"
}
```

### 3. Ver Mis Tickets
```
GET http://localhost:3000/tickets/my-tickets
Headers: Authorization: Bearer {{JWT_TOKEN}}
```

### 4. Ver Detalles del Ticket
```
GET http://localhost:3000/tickets/1
Headers: Authorization: Bearer {{JWT_TOKEN}}
```

---

## Validaciones del DTO

- **title** - Requerido, string
- **description** - Requerido, string
- **category** - Requerido, enum válido
- **priority** - Opcional, enum válido (Media por defecto)
- **equipmentId** - Opcional, debe ser número entero if provided

---

## Estructura del Ticket

```typescript
{
  id: number,
  title: string,
  description: string,
  category: TicketCategory, // Enum
  priority: TicketPriority,  // Enum
  status: TicketStatus,      // Enum: Pendiente, En proceso, Resuelto, Cerrado
  evidenceText?: string,     // Notas del técnico
  reportedById: number,      // Usuario que reportó
  assignedToId?: number,     // Técnico asignado
  equipmentId?: number,      // Equipo relacionado
  createdAt: Date,
  updatedAt: Date,
  
  // Relaciones
  reportedBy: User,
  assignedTo?: User,
  equipment?: Equipment
}
```

---

##  Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| **400 Bad Request** | Campo requerido faltante | Asegúrate de incluir title, description, category |
| **400 Bad Request** | Categoría inválida | Usa una de: Hardware, Software, Red, Impresoras, Monitor, Teclado/Ratón, Correo, Sistema Operativo, Otro |
| **400 Bad Request** | Prioridad inválida | Usa una de: Baja, Media, Alta, Crítica |
| **401 Unauthorized** | Token inválido o expirado | Haz login nuevamente |
| **404 Not Found** | Ticket no existe | Verifica el ticket ID |

---

##  Relación con el Formulario Frontend

El formulario en frontend pide:
```
1. Título del Reporte ────────→ "title"
2. Descripción Detallada ─────→ "description"
3. Área (readonly) ───────────→ Viene del usuario autenticado
4. Categoría/Sistema ─────────→ "category"
5. Prioridad ────────────────→ "priority"
```

**El backend ahora espera exactamente eso en el JSON del POST /tickets**
