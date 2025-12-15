# ────────────────
# FASE 1: Build con Maven + Java 17
# ────────────────
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copiamos solo pom.xml primero para aprovechar cache
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw

# Descargar dependencias (cache)
RUN ./mvnw dependency:go-offline -B

# Ahora copiamos el código fuente
COPY src ./src

# Construimos el JAR
RUN ./mvnw clean package -DskipTests

# ────────────────
# FASE 2: Imagen final con Java 17
# ────────────────
FROM openjdk:17-jdk-slim
WORKDIR /app

# Render usa la variable de entorno PORT (obligatorio)
ENV PORT=8080

# Copiamos el JAR generado en la fase anterior
COPY --from=build /app/target/*.jar app.jar

# Exponemos el puerto (Render lo ignora pero está bien ponerlo)
EXPOSE ${PORT}

# Comando de ejecución
CMD ["java", "-jar", "app.jar"]