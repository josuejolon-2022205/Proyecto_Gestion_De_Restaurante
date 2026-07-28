# ProyectoRestaurante

Backend en **TypeScript** para la gestión integral de un restaurante: clientes, empleados, mesas, pedidos, inventario, facturación y más. Construido con el módulo `http` nativo de Node.js (sin frameworks tipo Express) y **PostgreSQL** como base de datos, con validación de datos mediante **Zod**.

## Arquitectura

El proyecto sigue una arquitectura en capas, aplicada de forma consistente en los 17 módulos del sistema:

```
Request → Router → Service → Repository → PostgreSQL
```

- **Router** (`src/api`): recibe la petición HTTP, parsea el body/params y delega al service. Maneja los errores con `handleError`.
- **Service** (`src/service`): contiene la lógica de negocio, valida los datos de entrada con los schemas de Zod y coordina las reglas (ej. verificar que un registro exista antes de actualizarlo).
- **Repository** (`src/data`): encapsula las queries SQL a PostgreSQL usando el driver `pg`, con placeholders parametrizados (`$1`, `$2`, ...) para evitar inyección SQL.
- **Models** (`src/models`): interfaces TypeScript que representan las entidades del dominio.
- **Validations** (`src/validations`): schemas de Zod por entidad (uno para creación, otro `.partial()` para actualización).
- **Errors** (`src/errors`): jerarquía de errores personalizados (`AppError` abstracto → `ValidationError`, `NotFoundError`, `ConflictError`, `DatabaseError`), cada uno con su `statusCode` y `serializeErrors()`.
- **Utils** (`src/utils`): helpers transversales como `withTryCatch` / `withTryCatchThrow` (envuelven funciones async para loguear y manejar errores de forma uniforme) y `errorHandler` (traduce cualquier error a una respuesta JSON con el status code correcto).

## Módulos del sistema

| Entidad | Endpoint base |
|---|---|
| Cargos | `/cargos` |
| Categorías de producto | `/categorias` |
| Clientes | `/clientes` |
| Detalles de pedido | `/detalles` |
| Empleados | `/empleados` |
| Facturas | `/facturas` |
| Ingredientes | `/ingredientes` |
| Mesas | `/mesas` |
| Movimientos de inventario | `/movimientos` |
| Pagos | `/pagos` |
| Pedidos | `/pedidos` |
| Producto-Ingrediente | `/productoIngredientes` |
| Productos | `/productos` |
| Proveedores | `/proveedores` |
| Reservas | `/reservas` |
| Roles | `/roles` |
| Usuarios | `/usuarios` |

Cada módulo expone operaciones **CRUD** completas siguiendo el mismo patrón REST:

| Método | Ruta | Acción |
|---|---|---|
| `GET` | `/entidad` | Listar todos los registros |
| `GET` | `/entidad/:id` | Obtener un registro por ID |
| `POST` | `/entidad` | Crear un nuevo registro |
| `PUT` | `/entidad/:id` | Actualizar un registro existente |
| `DELETE` | `/entidad/:id` | Eliminar un registro |

## Modelo de dominio (resumen)

El sistema modela el flujo completo de un restaurante:

- **Gestión de personal**: `Usuario` (con `Rol`), `Empleado` (con `Cargo`).
- **Gestión de clientes y mesas**: `Cliente`, `Mesa` (estados: `LIBRE`, `OCUPADA`, `RESERVADA`), `Reserva`.
- **Operación**: `Pedido` (estados: `PREPARACION`, `ENTREGADO`, `CANCELADO`), `DetallePedido`, `Producto`, `CategoriaProducto`.
- **Inventario**: `Ingrediente`, `ProductoIngrediente` (relación producto-ingrediente), `MovimientoInventario` (`ENTRADA`/`SALIDA`), `Proveedor`.
- **Cobros**: `Pago` (`EFECTIVO`, `TARJETA`, `TRANSFERENCIA`), `Factura`.

Los estados y catálogos fijos están modelados como `enum` en `src/enums`.

## Tecnologías

- **Node.js** + **TypeScript** (`strict: true`)
- **http** nativo (servidor sin frameworks)
- **PostgreSQL** vía [`pg`](https://www.npmjs.com/package/pg) (Pool de conexiones)
- **Zod** para validación de esquemas
- **tsx** para ejecutar TypeScript directamente en desarrollo
- **pnpm** como gestor de paquetes

## Instalación y uso

### Requisitos previos

- Node.js
- pnpm
- PostgreSQL corriendo localmente con una base de datos creada (ver `src/config/database.ts`)

### Pasos

```bash
pnpm install

pnpm run dev
```

El servidor arranca en `http://localhost:3000`.

## Manejo de errores

Todas las respuestas de error siguen un formato consistente gracias a `handleError`:

```json
{
  "status": "fail",
  "errors": [
    { "message": "El nombre debe tener al menos 2 caracteres", "field": "nombreCargo" }
  ]
}
```

| Error | Status HTTP |
|---|---|
| `ValidationError` | 400 |
| `NotFoundError` | 404 |
| `ConflictError` | 409 |
| `DatabaseError` | 500 |
| Error no controlado | 500 |

## Estructura del proyecto

```
src/
├── api/            # Routers HTTP + helpers (readBody, sendJSON, server)
├── config/         # Configuración de conexión a PostgreSQL
├── data/           # Repositories (queries SQL)
├── enums/          # Enums de estados y catálogos
├── errors/         # Jerarquía de errores personalizados
├── models/         # Interfaces TypeScript del dominio
├── service/        # Lógica de negocio
├── utils/          # Helpers (manejo de errores, try/catch envolvente)
├── validations/     # Schemas de Zod por entidad
└── index.ts        # Punto de entrada del servidor
```