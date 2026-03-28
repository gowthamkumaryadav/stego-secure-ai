FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY . .

RUN apk add --no-cache maven

RUN mvn clean package

EXPOSE 8081

CMD ["java", "-jar", "target/*.jar"]