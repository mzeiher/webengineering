FROM maven:3.8.4-openjdk-8 as builder

COPY . .
RUN mvn clean package

FROM openjdk:8-alpine

COPY --from=builder ./target/webserver-java-1.0-SNAPSHOT-jar-with-dependencies.jar /app/app.jar
WORKDIR /app

CMD ["java", "-jar", "./app.jar"]