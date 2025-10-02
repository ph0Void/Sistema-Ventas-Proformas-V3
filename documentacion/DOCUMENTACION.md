# DOCUMENTACION : 

# AUTH 

## REGISTER 
POST http://localhost:8080/auth/register

REQUEST BODY
````json
{
    "username": "user1",
    "password": "admin"
}
````
RESPONSE
````json
{
    "success": true,
    "message": "Usuario registrado exitosamente",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMiIsInJvbGVzIjoiVVNFUiIsInVzZXJJZCI6MiwiaWF0IjoxNzU2MjcxMjkyLCJleHAiOjE3NTYzNTc2OTJ9.bm6wIqfCAK7j0AvkQ6WuZdqsg4zxX-vGX6M6u6XTJNI"
    },
    "date": "2025-08-27T00:08:12.5421087"
}
````
## LOGIN
POST http://localhost:8080/auth/login

REQUEST BODY
````json
{
    "username": "user2",
    "password": "admin"
}
````
RESPONSE
````json
{
    "success": true,
    "message": "Login exitoso, bienvenido",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMiIsInJvbGVzIjoiUk9MRV9VU0VSIiwidXNlcklkIjoyLCJpYXQiOjE3NTYyNzEzNDEsImV4cCI6MTc1NjM1Nzc0MX0.LNIck2wJwkkbpqyIGWtO9TaFZAZeib_oOzD4D1Mgy-A"
    },
    "date": "2025-08-27T00:09:01.1771286"
}
````
# SELLER
es necesario un token de autenticacion
## CREATE SELLER
POST http://localhost:8080/seller 

REQUEST BODY 
````json
{
    "name": "seller 1",
    "lastName": "apellido seller 1",
    "carnet": 87654321,
    "storeAddress": "direcion del la tienda 1"
}
````
RESPONSE
````json
{
  "success": true,
  "message": "Vendedor creado exitosamente",
  "data": {
    "name": "seller 1",
    "lastName": "apellido seller 1",
    "carnet": 87654321,
    "storeAddress": "direcion del la tienda 1"
  },
  "date": "2025-08-27T00:22:32.8817288"
}
````
## UPDATE SELLER
PUT http://localhost:8080/seller
REQUEST BODY 
````json
{
    "name": "seller 1 actualizado",
    "lastName": "apellido seller 1 actualizado",
    "carnet": 87654321,
    "storeAddress": "direcion del la tienda 1 actualizado"
}
````


# CATEGORIA 

## GET ALL 
GET http://localhost:8080/category
RESPONSE
````json
{
    "success": true,
    "message": "Categorias recuperadas",
    "data": [
        {
            "id": 2,
            "name": "categoria 2",
            "products": []
        },
        {
            "id": 3,
            "name": "categoria 3",
            "products": []
        }
    ],
    "date": "2025-08-27T00:41:47.4371819"
}
````

## CREATE CATEGORY
POST http://localhost:8080/category

REQUEST BODY 
````json
{
    "name": "categoria 1"
}
````
RESPONSE
````json
{
  "success": true,
  "message": "Categoria creada con id: categoria 1",
  "data": {
    "id": 1,
    "name": "categoria 1",
    "products": []
  },
  "date": "2025-08-27T00:37:43.7841339"
}
````
## UPDATE CATEGORY
PUT http://localhost:8080/category/1
REQUEST BODY
````json
{
    "name":"nuevo categoria 1"
}
````
RESPONSE
````json
{
  "success": true,
  "message": "Categoria actualizada con id: nuevo categoria 1",
  "data": {
    "id": 1,
    "name": "nuevo categoria 1",
    "products": []
  },
  "date": "2025-08-27T00:39:37.5615087"
}
````
## DELETE CATEGORY
DELETE http://localhost:8080/category/1
RESPONSE
````json
{
    "success": true,
    "message": "Categoria eliminada 1 correctamente",
    "data": null,
    "date": "2025-08-27T00:40:37.2187449"
}
````

# PRODUCTOS

## GET ALL PRODUCTS
GET http://localhost:8080/product?page=1&size=2

RESPONSE

````json
{
    "success": true,
    "message": "Productos recuperados con paginación",
    "data": {
        "totalElements": 6,
        "totalPages": 3,
        "hasNext": true,
        "content": [
            {
                "id": 3,
                "name": "producto 3",
                "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
                "description": "esta es la descripccion 1",
                "price": 40.99,
                "stock": 10,
                "category": {
                    "id": 2,
                    "name": "categoria 2",
                    "products": null
                }
            },
            {
                "id": 4,
                "name": "producto 4",
                "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
                "description": "esta es la descripccion 1",
                "price": 40.99,
                "stock": 10,
                "category": {
                    "id": 2,
                    "name": "categoria 2",
                    "products": null
                }
            }
        ],
        "currentPage": 1,
        "size": 2,
        "hasPrevious": true
    },
    "date": "2025-08-27T00:50:37.8169822"
}
````

## CREATE PRODUCT
POST http://localhost:8080/product

REQUEST BODY 
````json
{
  "name":"producto 6",
  "description": "esta es la descripccion 1",
  "urlImage":"https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
  "price": 40.99,
  "stock": 10,
  "category": {
    "name": "categoria 2"
  }
}
````
RESPONSE
````json
{
    "success": true,
    "message": "Producto creado con id: 6",
    "data": {
        "id": 6,
        "name": "producto 6",
        "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
        "description": "esta es la descripccion 1",
        "price": 40.99,
        "stock": 10,
        "category": {
            "id": 2,
            "name": "categoria 2",
            "products": null
        }
    },
    "date": "2025-08-27T00:47:46.1274776"
}
````
## UPDATE PRODUCT
PUT http://localhost:8080/product/6
REQUEST BODY
````json
{
    "name":"producto 6 ACTUALIZADO ",
    "description": "esta es la descripccion 1",
    "urlImage":"https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
    "price": 34.5,
    "stock": 10,
    "category": {
        "name": "categoria 2"
    }
}
````
RESPONSE 
````json
{
    "success": true,
    "message": "Producto actualizado con id: 6",
    "data": {
        "id": 6,
        "name": "producto 6 ACTUALIZADO ",
        "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
        "description": "esta es la descripccion 1",
        "price": 34.5,
        "stock": 10,
        "category": {
            "id": 2,
            "name": "categoria 2",
            "products": null
        }
    },
    "date": "2025-08-27T00:49:33.4066354"
}
````
## DELETE PRODUCT

DELETE http://localhost:8080/product/6

RESPONSE
````json
{
    "success": true,
    "message": "Producto eliminado 6 correctamente",
    "data": null,
    "date": "2025-08-27T00:51:36.8786593"
}
````
# CLOUDYNARY

## UPLOAD IMAGE

POST http://localhost:8080/images/upload

REQUEST BODY form-data

Key: file Value: (seleccionar archivo)

RESPONSE
````json
{
  "success": true,
  "message": "Imagen subida exitosamente",
  "data": {
    "url": "https://res.cloudinary.com/dkd37ttep/image/upload/v1756274088/tienda_virtual/zhoh6ef7nhwdxpsfwugm.jpg"
  },
  "date": "2025-08-27T00:54:48.9838038"
}
````

# SALE

## GET ALL SALES
GET http://localhost:8080/sale
RESPONSE
````json
{
  "success": true,
  "message": "Ventas obtenidas exitosamente",
  "data": [
    {
      "id": 1,
      "total": 81.98,
      "createAt": "2025-08-27T00:56:37.24534",
      "orderDetails": [
        {
          "id": 1,
          "quantity": 1,
          "product": {
            "id": 4,
            "name": "producto 4",
            "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
            "description": "esta es la descripccion 1",
            "price": 40.99,
            "stock": 8,
            "category": {
              "id": 2,
              "name": "categoria 2",
              "products": null
            }
          }
        },
        {
          "id": 2,
          "quantity": 1,
          "product": {
            "id": 3,
            "name": "producto 3",
            "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
            "description": "esta es la descripccion 1",
            "price": 40.99,
            "stock": 8,
            "category": {
              "id": 2,
              "name": "categoria 2",
              "products": null
            }
          }
        }
      ],
      "count_product": 2.0
    },
    {
      "id": 2,
      "total": 81.98,
      "createAt": "2025-08-27T00:57:31.990061",
      "orderDetails": [
        {
          "id": 3,
          "quantity": 1,
          "product": {
            "id": 4,
            "name": "producto 4",
            "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
            "description": "esta es la descripccion 1",
            "price": 40.99,
            "stock": 8,
            "category": {
              "id": 2,
              "name": "categoria 2",
              "products": null
            }
          }
        },
        {
          "id": 4,
          "quantity": 1,
          "product": {
            "id": 3,
            "name": "producto 3",
            "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
            "description": "esta es la descripccion 1",
            "price": 40.99,
            "stock": 8,
            "category": {
              "id": 2,
              "name": "categoria 2",
              "products": null
            }
          }
        }
      ],
      "count_product": 2.0
    }
  ],
  "date": "2025-08-27T00:57:48.3198928"
}
````

## CREATE SALE
POST http://localhost:8080/sale

REQUEST BODY 
````json
{
  "client": {
    "fullName": "nombre completo cliente 1",
    "dni": 12345678,
    "phone": 123456789,
    "email": "cliente1@gamil.com"
  },
  "orderDetails": [
    {
      "productId": 4,
      "quantity": 1
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}
````
RESPONSE 
````json
{
    "success": true,
    "message": "Venta creada exitosamente",
    "data": {
        "id": 1,
        "total": 81.98,
        "createAt": null,
        "orderDetails": [
            {
                "id": 1,
                "quantity": 1,
                "product": {
                    "id": 4,
                    "name": "producto 4",
                    "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
                    "description": "esta es la descripccion 1",
                    "price": 40.99,
                    "stock": 9,
                    "category": {
                        "id": 2,
                        "name": "categoria 2",
                        "products": null
                    }
                }
            },
            {
                "id": 2,
                "quantity": 1,
                "product": {
                    "id": 3,
                    "name": "producto 3",
                    "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
                    "description": "esta es la descripccion 1",
                    "price": 40.99,
                    "stock": 9,
                    "category": {
                        "id": 2,
                        "name": "categoria 2",
                        "products": null
                    }
                }
            }
        ],
        "count_product": 2.0
    },
    "date": "2025-08-27T00:56:37.2628983"
}
````

## UPDATE SALE 

PUT http://localhost:8080/sale/1

REQUEST BODY 
````json
{
    "client": {
        "fullName": "nombre ACTUALIZADO completo cliente 1",
        "dni": 12345678,
        "phone": 123456789,
        "email": "cliente1@gamil.com"
    },
    "orderDetails": [
        {
            "productId": 4,
            "quantity": 1
        },
        {
            "productId": 3,
            "quantity": 1
        }
    ]
}
````
RESPONSE 
````json
{
    "success": true,
    "message": "Venta actualizada exitosamente",
    "data": {
        "id": 1,
        "total": 81.98,
        "createAt": "2025-08-27T00:56:37.24534",
        "orderDetails": [],
        "count_product": 0.0
    },
    "date": "2025-08-27T00:59:48.6337462"
}
````
## DELETE SALE
DELETE http://localhost:8080/sale/1
RESPONSE
````json
{
  "success": true,
  "message": "Venta eliminada exitosamente",
  "data": null,
  "date": "2025-08-27T01:03:43.9395613"
}
````

# PROFORMA

## GET ALL PROFORMAS
GET http://localhost:8080/proforma

RESPONSE 

````json
{
    "success": true,
    "message": "Proformas obtenidas exitosamente",
    "data": [
        {
            "id": 1,
            "total": 81.98,
            "createAt": "2025-08-27T01:05:33.076643",
            "orderDetails": [
                {
                    "id": 8,
                    "quantity": 1,
                    "product": {
                        "id": 3,
                        "name": "producto 3",
                        "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
                        "description": "esta es la descripccion 1",
                        "price": 40.99,
                        "stock": 9,
                        "category": {
                            "id": 2,
                            "name": "categoria 2",
                            "products": null
                        }
                    }
                },
                {
                    "id": 7,
                    "quantity": 1,
                    "product": {
                        "id": 4,
                        "name": "producto 4",
                        "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
                        "description": "esta es la descripccion 1",
                        "price": 40.99,
                        "stock": 9,
                        "category": {
                            "id": 2,
                            "name": "categoria 2",
                            "products": null
                        }
                    }
                }
            ],
            "count_product": 2.0
        },
        {
            "id": 2,
            "total": 81.98,
            "createAt": "2025-08-27T01:07:31.134019",
            "orderDetails": [
                {
                    "id": 10,
                    "quantity": 1,
                    "product": {
                        "id": 3,
                        "name": "producto 3",
                        "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
                        "description": "esta es la descripccion 1",
                        "price": 40.99,
                        "stock": 9,
                        "category": {
                            "id": 2,
                            "name": "categoria 2",
                            "products": null
                        }
                    }
                },
                {
                    "id": 9,
                    "quantity": 1,
                    "product": {
                        "id": 4,
                        "name": "producto 4",
                        "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
                        "description": "esta es la descripccion 1",
                        "price": 40.99,
                        "stock": 9,
                        "category": {
                            "id": 2,
                            "name": "categoria 2",
                            "products": null
                        }
                    }
                }
            ],
            "count_product": 2.0
        }
    ],
    "date": "2025-08-27T01:08:03.3971746"
}
````

## CREATE PROFORMA
POST http://localhost:8080/proforma

REQUEST BODY  
````json
{
    "client": {
        "fullName": "nombre completo cliente 1",
        "dni": 12345678,
        "phone": 123456789,
        "email": "cliente1@gamil.com"
    },
    "orderDetails": [
        {
            "productId": 4,
            "quantity": 1
        },
        {
            "productId": 3,
            "quantity": 1
        }
    ]
}
````

RESPONSE 

````json
{
    "success": true,
    "message": "Proforma creada exitosamente",
    "data": {
        "id": 1,
        "total": 81.98,
        "createAt": null,
        "orderDetails": [
            {
                "id": 7,
                "quantity": 1,
                "product": {
                    "id": 4,
                    "name": "producto 4",
                    "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
                    "description": "esta es la descripccion 1",
                    "price": 40.99,
                    "stock": 9,
                    "category": {
                        "id": 2,
                        "name": "categoria 2",
                        "products": null
                    }
                }
            },
            {
                "id": 8,
                "quantity": 1,
                "product": {
                    "id": 3,
                    "name": "producto 3",
                    "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
                    "description": "esta es la descripccion 1",
                    "price": 40.99,
                    "stock": 9,
                    "category": {
                        "id": 2,
                        "name": "categoria 2",
                        "products": null
                    }
                }
            }
        ],
        "count_product": 2.0
    },
    "date": "2025-08-27T01:05:33.0866484"
}
````

## UPDATE PROFORMA
PUT http://localhost:8080/proforma/1
REQUEST BODY 
````json
{
    "client": {
        "fullName": "nombre ACTUALIZADO completo cliente 1",
        "dni": 12345678,
        "phone": 123456789,
        "email": "cliente1@gamil.com"
    },
    "orderDetails": [
        {
            "productId": 4,
            "quantity": 1
        },
        {
            "productId": 3,
            "quantity": 1
        }
    ]
}
````

RESPONSE 
````json
{
  "success": true,
  "message": "Proforma actualizada exitosamente",
  "data": {
    "id": 1,
    "total": 81.98,
    "createAt": "2025-08-27T01:05:33.076643",
    "orderDetails": [
      {
        "id": 11,
        "quantity": 1,
        "product": {
          "id": 4,
          "name": "producto 4",
          "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
          "description": "esta es la descripccion 1",
          "price": 40.99,
          "stock": 9,
          "category": {
            "id": 2,
            "name": "categoria 2",
            "products": null
          }
        }
      },
      {
        "id": 12,
        "quantity": 1,
        "product": {
          "id": 3,
          "name": "producto 3",
          "urlImage": "https://res.cloudinary.com/dkd37ttep/image/upload/v1755815409/tienda_virtual/kdzmim43fxiaclkxekz1.jpg",
          "description": "esta es la descripccion 1",
          "price": 40.99,
          "stock": 9,
          "category": {
            "id": 2,
            "name": "categoria 2",
            "products": null
          }
        }
      }
    ],
    "count_product": 2.0
  },
  "date": "2025-08-27T01:09:30.2812856"
}
````

## DELETE PROFORMA
DELETE http://localhost:8080/proforma/1

RESPONSE 
````json
{
    "success": true,
    "message": "Proforma eliminada exitosamente",
    "data": null,
    "date": "2025-08-27T01:10:28.9373847"
}
````
