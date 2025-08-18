FROM gradle:8.10.2-jdk21 AS build
WORKDIR /app

COPY settings.gradle build.gradle gradle.properties gradlew gradle/ ./
COPY src ./src

RUN --mount=type=cache,target=/root/.gradle \
    ./gradlew --no-daemon --stacktrace --info clean bootJar -x test

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]