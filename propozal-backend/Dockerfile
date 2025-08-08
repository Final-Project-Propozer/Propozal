# Image to Build
FROM gradle:8.7.0-jdk21 AS builder
WORKDIR /app

COPY build.gradle settings.gradle gradle.properties ./
COPY gradle ./gradle
RUN gradle build --no-daemon || return 0

COPY . .
RUN gradle clean bootJar --no-daemon

# Image to Run
FROM eclipse-temurin:21-jre
WORKDIR /app

ENV TZ=Asia/Seoul
EXPOSE 8080

COPY --from=builder /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]