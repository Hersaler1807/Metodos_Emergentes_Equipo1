# API Endpoints - Pruebas y Ejemplos

## Autenticación

### Login (POST /auth/login)

**Descripción:** Autenticar usuario y obtener JWT token

**Body (JSON):**
```json
{
  "email": "admin@tecnm.mx",
  "password": "Admin123!",
  "area": "Sistemas"
}
```

**Curl:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@tecnm.mx",
    "password": "Admin123!",
    "area": "Sistemas"
  }'
```

**Respuesta Exitosa (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@tecnm.mx",
    "role": "Admin",
    "area": "Sistemas"
  }
}
```

---

### Register (POST /auth/register) - Solo Admin

**Descripción:** Crear un nuevo usuario (Solo Administrador)

**Headers:**
```
Authorization: Bearer <JWT_TOKEN_ADMIN>
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "tecnico@tecnm.mx",
  "password": "Tech123!",
  "role": "Technician",
  "area": "Sistemas"
}
```

**Curl:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tecnico@tecnm.mx",
    "password": "Tech123!",
    "role": "Technician",
    "area": "Sistemas"
  }'
```

**Respuesta Exitosa (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 2,
    "email": "tecnico@tecnm.mx",
    "role": "Technician",
    "area": "Sistemas"
  }
}
```

---

## Usuarios

### Crear Usuario (POST /users) - Solo Admin

**Headers:**
```
Authorization: Bearer <JWT_TOKEN_ADMIN>
Content-Type: application/json
```

**Body:**
```json
{
  "email": "usuario@tecnm.mx",
  "password": "User123!",
  "role": "User",
  "area": "Biblioteca"
}
```

**Respuesta:**
```json
{
  "id": 3,
  "email": "usuario@tecnm.mx",
  "role": "User",
  "area": "Biblioteca",
  "createdAt": "2026-03-04T11:35:00.000Z",
  "updatedAt": "2026-03-04T11:35:00.000Z"
}
```

---

### Listar Usuarios (GET /users) - Solo Admin

**Headers:**
```
Authorization: Bearer <JWT_TOKEN_ADMIN>
```

**Curl:**
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## Equipments

### Crear Equipo (POST /equipments) - Admin/Technician

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Laptop DELL",
  "serialNumber": "DELL-12345-ABC",
  "area": "Sistemas",
  "status": "Activo",
  "hardwareDetails": "Intel i7, 16GB RAM, 512GB SSD"
}
```

---

## Tickets

### Crear Ticket (POST /tickets) - Todos

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "title": "Impresora no conecta a la red",
  "description": "La impresora de la oficina no conecta. Hemos intentado reiniciar.",
  "reportedById": 3,
  "equipmentId": 1
}
```

---

## Reportes

### Dashboard Stats (GET /reports/dashboard-stats) - Autenticado

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

---

## Credenciales de Prueba

### Usuario Admin
```
Email: admin@tecnm.mx
Contraseña: Admin123!
Área: Sistemas
Rol: Admin
```

---

## Validaciones

### Login
- Email debe ser válido
- Contraseña mínimo 6 caracteres
- Área debe ser una de: Biblioteca, Sistemas, Recursos Humanos, Recursos Financieros, Edificio Q, Edificio R
- El área debe coincidir con la del usuario en BD

### Register (Admin solo)
- Email debe ser válido y único
- Contraseña mínimo 6 caracteres
- Rol debe ser: Admin, Technician o User
- Área debe ser válida

### Crear Usuario (Admin solo)
- Email único
- Contraseña mínimo 6 caracteres
- Rol requerido
- Área requerida

---

##  Prueba Rápida con Postman

1. **Importar en Postman:**
   - Copiar los ejemplos de curl arriba
   - O crear requests manualmente

2. **Flujo de prueba:**
   ```
   1. POST /auth/login → Obtener token
   2. POST /auth/register → Crear usuario (con token admin)
   3. POST /users → Crear usuario desde admin
   4. GET /users → Listar usuarios
   5. POST /equipments → Crear equipo
   6. POST /tickets → Crear ticket
   ```

--

##  Próximas Pruebas Recomendadas

1. Intentar login con contraseña incorrecta → Debe fallar
2. Intentar register sin ser admin → Debe fallar (401)
3. Login con área diferente a la del usuario → Debe fallar
4. Crear usuario con email duplicado → Debe fallar
5. Crear equipo sin token → Debe fallar (401)
