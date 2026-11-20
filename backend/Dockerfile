FROM maven:3.9-eclipse-temurin-25 AS build

WORKDIR /workspace
COPY pom.xml ./
COPY src ./src
RUN mvn --batch-mode package

FROM eclipse-temurin:25-jre

WORKDIR /app
COPY --from=build --chown=10001:10001 /workspace/target/mediturno-backend-0.1.0-SNAPSHOT.jar app.jar

USER 10001:10001
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=60.0", "-jar", "/app/app.jar"]
