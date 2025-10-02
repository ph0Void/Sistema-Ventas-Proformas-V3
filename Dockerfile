
# Etapa 1: Construcción
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

# Copiar archivos de Maven
COPY mvnw pom.xml ./
COPY .mvn .mvn

# Dar permisos de ejecución
RUN chmod +x mvnw

# Descargar dependencias (cache de Docker)
RUN ./mvnw dependency:go-offline

# Copiar código fuente
COPY src ./src

# Compilar aplicación sin tests
RUN ./mvnw clean package -DskipTests

# Etapa 2: Imagen final ligera
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copiar JAR compilado desde etapa builder
COPY --from=builder /app/target/*.jar app.jar

# Puerto de la aplicación
EXPOSE 8080

# Ejecutar aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]

# nombre : backend-proyecto-venta-prpoforma

# escribir en terminal
# corre docker y lo guarda
#docker build -t backend-proyecto-venta-prpoforma .

#eliminar docker
#docker rmi prueba1-docker

# mirar la lista de imagens en docker
# docker images

# actualizar contenedor
# docker-compose up