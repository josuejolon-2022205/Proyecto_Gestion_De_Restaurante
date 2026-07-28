create type "estado_enum" as enum ('ACTIVO', 'INACTIVO', 'BLOQUEADO');

create type "estado_mesa_enum" as enum ('OCUPADA', 'RESERVADA', 'LIBRE');

create type "estado_pedido_enum" as enum ('PREPARACION', 'ENTREGADO', 'CANCELADO');

create type "estado_reserva_enum" as enum ('ACTIVO', 'INACTIVO', 'CANCELADO');

create type "roles_enum" as enum ('ADMIN', 'USER');

create type "metodo_pago_enum" as enum ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA');

create type "tipo_movimiento_enum" as enum ('ENTRADA', 'SALIDA');

create table "rol" (
    "idRol" serial primary key not null,
    "nombre" varchar(50),
    "descripcion" varchar(50),
    "roles" "roles_enum" not null default 'USER'
);

create table "cargo" (
    "idCargo" serial primary key not null,
    "nombreCargo" varchar(50),
    "descripcionCargo" text
);

create table "categoriaProducto" (
    "idCategoriaProducto" serial primary key not null,
    "nombreCategoria" varchar(50),
    "descripcionCategoria" text
);

create table "proveedor" (
    "idProveedor" serial primary key not null,
    "nombreProveedor" varchar(100),
    "telefonoProveedor" varchar(20),
    "correoProveedor" varchar(90),
    "direccion" varchar(200)
);

create table "ingrediente" (
    "idIngrediente" serial primary key not null,
    "nombreIngrediente" varchar(100),
    "stockActual" decimal(10, 2),
    "stockMinimo" decimal(10, 2),
    "fkIdProveedor" int,
    constraint "fk_ingrediente_proveedor" 
        foreign key ("fkIdProveedor") references "proveedor"("idProveedor") 
        on delete cascade
);

create table "producto" (
    "idProducto" serial primary key not null,
    "nombreProducto" varchar(100),
    "descripcionProducto" text,
    "precio" decimal(10, 2),
    "disponibilidad" smallint,
    "fkIdCategoria" int,
    constraint "fk_producto_categoria" 
        foreign key ("fkIdCategoria") references "categoriaProducto"("idCategoriaProducto") 
        on delete cascade
);

create table "productoIngrediente" (
    "idProductoIngrediente" serial primary key not null,
    "cantidadUtilizada" decimal(10, 2),
    "fkIdProducto" int,
    "fkIdIngrediente" int,
    constraint "fk_productoIngrediente_producto" 
        foreign key ("fkIdProducto") references "producto"("idProducto"),
    constraint "fk_productoIngrediente_ingrediente" 
        foreign key ("fkIdIngrediente") references "ingrediente"("idIngrediente")
);

create table "cliente" (
    "idCliente" serial primary key not null,
    "nombreCliente" varchar(50),
    "apellidosCliente" varchar(50),
    "telefonoCliente" varchar(10),
    "correoCliente" varchar(80)
);

create table "mesa" (
    "idMesa" serial primary key not null,
    "estadoMesa" "estado_mesa_enum" not null default 'LIBRE',
    "numeroMesa" int,
    "capacidad" int
);

create table "usuario" (
    "idUsuario" serial primary key not null,
    "nombreUsuario" varchar(50),
    "correo" varchar(80),
    "contrasena" varchar(80),
    "estado" "estado_enum" not null default 'ACTIVO',
    "fkIdRol" int,
    constraint "fk_usuario_rol" 
        foreign key ("fkIdRol") references "rol"("idRol") 
        on delete cascade
);

create table "empleado" (
    "idEmpleado" serial primary key not null,
    "nombreEmpleado" varchar(100),
    "apellidoEmpleado" varchar(100),
    "telefonoEmpleado" varchar(10),
    "direccionEmpleado" varchar(150),
    "salarioEmpleado" decimal(10, 2),
    "fkIdCargo" int,
    "fkIdUsuario" int,
    constraint "fk_empleado_cargo" 
        foreign key ("fkIdCargo") references "cargo"("idCargo") 
        on delete cascade,
    constraint "fk_empleado_usuario" 
        foreign key ("fkIdUsuario") references "usuario"("idUsuario") 
        on delete cascade
);

create table "pedido" (
    "idPedido" serial primary key not null,
    "fechaPedido" date,
    "horaPedido" time,
    "estadoPedido" "estado_pedido_enum" not null default 'PREPARACION',
    "total" decimal(10, 2),
    "fkIdCliente" int,
    "fkIdMesa" int,
    "fkIdEmpleado" int,
    constraint "fk_pedido_cliente" 
        foreign key ("fkIdCliente") references "cliente"("idCliente") 
        on delete cascade,
    constraint "fk_pedido_mesa" 
        foreign key ("fkIdMesa") references "mesa"("idMesa") 
        on delete cascade,
    constraint "fk_pedido_empleado" 
        foreign key ("fkIdEmpleado") references "empleado"("idEmpleado") 
        on delete cascade
);

create table "detallePedido" (
    "idDetallePedido" serial primary key not null,
    "cantidad" int,
    "precioUnitario" decimal(10, 2),
    "subtotal" decimal(10, 2),
    "fkIdPedido" int,
    "fkIdProducto" int,
    constraint "fk_detallePedido_pedido" 
        foreign key ("fkIdPedido") references "pedido"("idPedido"),
    constraint "fk_detallePedido_producto" 
        foreign key ("fkIdProducto") references "producto"("idProducto")
);

create table "pago" (
    "idPago" serial primary key not null,
    "fechaPago" timestamp,
    "monto" decimal(10, 2),
    "metodoPago" "metodo_pago_enum" not null default 'EFECTIVO',
    "fkIdPedido" int,
    constraint "fk_pago_pedido" 
        foreign key ("fkIdPedido") references "pedido"("idPedido")
);

create table "factura" (
    "idFactura" serial primary key not null,
    "numeroFactura" varchar(50),
    "fechaFactura" timestamp,
    "nitCliente" varchar(20),
    "nombreFacturacion" varchar(100),
    "totalFactura" decimal(10, 2),
    "fkIdPago" int,
    constraint "fk_factura_pago" 
        foreign key ("fkIdPago") references "pago"("idPago")
);

create table "reserva" (
    "idReserva" serial primary key not null,
    "fechaReserva" date,
    "horaReserva" time,
    "cantidadPersonas" int,
    "estado" "estado_reserva_enum" not null default 'ACTIVO',
    "fkIdCliente" int,
    "fkIdMesa" int,
    constraint "fk_reserva_cliente" 
        foreign key ("fkIdCliente") references "cliente"("idCliente") 
        on delete cascade,
    constraint "fk_reserva_mesa" 
        foreign key ("fkIdMesa") references "mesa"("idMesa") 
        on delete cascade
);

create table "movimientoInventario" (
    "idMovimiento" serial primary key not null,
    "tipoMovimiento" "tipo_movimiento_enum" not null default 'ENTRADA',
    "cantidad" decimal(10, 2),
    "fechaMovimiento" timestamp,
    "descripcion" text,
    "fkIdIngrediente" int,
    constraint "fk_movimientoInventario_ingrediente" 
        foreign key ("fkIdIngrediente") references "ingrediente"("idIngrediente")
);