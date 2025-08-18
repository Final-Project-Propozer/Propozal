# syntax=docker/dockerfile:1.6
FROM gradle:8.10.2-jdk21 AS build
WORKDIR /app

COPY propozal-backend/settings.gradle propozal-backend/build.gradle propozal-backend/gradle.properties propozal-backend/gradlew propozal-backend/gradle/ ./ 
RUN --mount=type=cache,target=/home/gradle/.gradle \
    ./gradlew --no-daemon --version

COPY propozal-backend/ ./
RUN --mount=type=cache,target=/home/gradle/.gradle \
    ./gradlew --no-daemon bootJar -x test

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]