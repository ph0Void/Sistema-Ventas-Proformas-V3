
# PROYECTO DE TIENDA VIRTUAL

## CREAR JSON PERSONALIDAO

````java
@RestController
public class ProductController {
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @GetMapping("/custom-json")
    public ResponseEntity<String> createCustomJson() {
        try {
            ObjectNode response = objectMapper.createObjectNode();
            response.put("status", "success");
            response.put("message", "Datos recuperados");
            
            ArrayNode products = objectMapper.createArrayNode();
            ObjectNode product = objectMapper.createObjectNode();
            product.put("id", 1);
            product.put("name", "Laptop");
            products.add(product);
            
            response.set("data", products);
            
            return ResponseEntity.ok(response.toString());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}
````

Usando jackson
````java
// Crear JSON desde objeto
ObjectMapper mapper = new ObjectMapper();
String json = mapper.writeValueAsString(product);

// Crear JSON manualmente
ObjectNode jsonNode = mapper.createObjectNode();
jsonNode.put("id", 1);
jsonNode.put("name", "Producto");
jsonNode.put("price", 25.99);
String json = mapper.writeValueAsString(jsonNode);
````

## RELACIONES

Orden (1) ↔ OrdenDetail (N): Una venta tiene muchos detalles
Proforma (1) ↔ ProformaDetail (N): Una proforma tiene muchos detalles
Product (1) ↔ OrdenDetail (N): Un producto puede estar en muchas ventas
Product (1) ↔ ProformaDetail (N): Un producto puede estar en muchas proformas
Category (1) ↔ Product (N): Una categoría tiene muchos productos
