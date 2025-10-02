# PROYECTO SISTEMA DE VENTAS Y PROFORMAS (BACKEND)

## Descripción

Este proyecto es un sistema completo para la gestión de ventas y proformas en una tienda virtual. Permite administrar productos, categorías, clientes, vendedores y realizar operaciones de ventas y generación de proformas. El backend está desarrollado en Java con Spring Boot y utiliza PostgreSQL como base de datos principal.

## Características principales

- **Gestión de productos y categorías:** CRUD completo para productos y categorías, con soporte para imágenes usando Cloudinary.
- **Gestión de clientes y vendedores:** Registro y administración de usuarios, clientes y vendedores.
- **Sistema de ventas:** Permite registrar ventas, asociar productos y clientes, calcular totales y mantener el historial.
- **Sistema de proformas:** Generación de proformas (cotizaciones) para clientes, con posibilidad de convertirlas en ventas.
- **Autenticación y autorización:** Seguridad basada en JWT para proteger los endpoints.
- **API RESTful documentada:** Uso de OpenAPI/Swagger para facilitar la integración y pruebas.
- **Base de datos PostgreSQL:** Toda la información se almacena y gestiona en PostgreSQL, asegurando integridad y rendimiento.

## Tecnologías utilizadas

- **Java 21**
- **Spring Boot** (API REST, seguridad, validaciones)
- **Spring Security** (JWT)
- **PostgreSQL** (base de datos relacional)
- **Maven** (gestión de dependencias)
- **Cloudinary** (almacenamiento de imágenes)
- **OpenAPI/Swagger** (documentación interactiva de la API)

## Flujo del sistema de ventas

1. **Registro/Login:** Los usuarios se autentican mediante endpoints protegidos con JWT.
2. **Gestión de productos y categorías:** Los administradores pueden crear, actualizar y eliminar productos y categorías.
3. **Registro de clientes y vendedores:** Se pueden registrar nuevos clientes y vendedores en el sistema.
4. **Creación de proformas:** El usuario puede generar una proforma seleccionando productos y cantidades para un cliente específico. La proforma almacena los detalles y el total, pero no afecta el stock.
5. **Conversión de proforma a venta:** Una proforma puede convertirse en una venta real, lo que descuenta el stock de los productos y registra la transacción.
6. **Gestión de ventas:** Se pueden consultar, actualizar o eliminar ventas, manteniendo el historial y los detalles de cada operación.

## Flujo del sistema de proformas

- Las proformas permiten cotizar productos a un cliente antes de realizar una venta.
- Se almacena el detalle de los productos, cantidades y precios.
- Las proformas pueden ser editadas o eliminadas antes de convertirse en ventas.
- Al confirmar una proforma, se genera una venta y se actualiza el stock de los productos involucrados.


## Documentación de la API

La API está documentada y disponible mediante Swagger en la ruta `/swagger-ui.html` una vez desplegada la aplicación.

## COMANDOS PARA LEVANTAR EN DOCKER

````bash
# Construir y levantar servicios
docker-compose up --build

# Levantar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f spring_app

# Detener servicios
docker-compose down

# Eliminar todo (incluyendo volúmenes)
docker-compose down -v
````