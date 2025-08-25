FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the jar file into the container
COPY ./target/backend-atividades-0.0.1-SNAPSHOT.jar /app/app.jar

# Pass environment variables to the Docker container
ENV SPRING_DATASOURCE_URL=${SPRING_DATASOURCE_URL}
ENV SPRING_DATASOURCE_USERNAME=${SPRING_DATASOURCE_USERNAME}
ENV SPRING_DATASOURCE_PASSWORD=${SPRING_DATASOURCE_PASSWORD}

# Run the Java application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
