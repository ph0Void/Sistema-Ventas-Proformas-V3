
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

COPY mvnw pom.xml ./
COPY .mvn .mvn

RUN chmod +x mvnw

RUN ./mvnw dependency:go-offline

COPY src ./src

RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

# nombre : backend-proyecto-venta-prpoforma

# escribir en terminal
# corre docker y lo guarda
#docker build -t backend-proyecto-venta-prpoforma .

# actualizar contenedor
# docker-compose up
