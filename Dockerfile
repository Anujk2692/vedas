# Stage 1 — Angular website
FROM node:20-alpine AS web
WORKDIR /web
COPY vedas-web/package*.json ./
RUN npm ci
COPY vedas-web/ .
RUN npm run build

# Stage 2 — Spring Boot API + static site
FROM maven:3.9-eclipse-temurin-17-alpine AS api
WORKDIR /app
COPY vedas-backend/pom.xml .
COPY vedas-backend/src ./src
COPY --from=web /web/dist/vedas-web/browser ./src/main/resources/static
RUN mvn -q clean package -DskipTests

# Stage 3 — runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=api /app/target/vedas-backend-1.0.0.jar app.jar
ENV PORT=8080
EXPOSE 8080
CMD ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
