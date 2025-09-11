FROM maven:3.9-eclipse-temurin-17

WORKDIR /app

# Startup script (builds then runs)
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# Optional Spring profile (override at runtime)
ENV SPRING_PROFILES_ACTIVE=default

# Spring Boot default port
EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
