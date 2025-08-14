FROM eclipse-temurin:21-jre
WORKDIR /app

ENV TZ=Asia/Seoul

EXPOSE 8080

COPY build/libs/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]