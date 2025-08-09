# ---------- STAGE 1: Build ----------
FROM eclipse-temurin:20-jdk AS builder

WORKDIR /app

# Copy Gradle wrapper and settings
COPY gradlew gradlew.bat ./
COPY gradle ./gradle
COPY settings.gradle ./
COPY app/build.gradle ./app/

# Make Gradle wrapper executable
RUN chmod +x gradlew

# Pre-download dependencies (cached if unchanged)
RUN ./gradlew dependencies --no-daemon || return 0

# Copy source code
COPY app/src ./app/src

# Build Spring Boot JAR (skip tests)
RUN ./gradlew clean bootJar -x test --no-daemon

# ---------- STAGE 2: Runtime ----------
FROM eclipse-temurin:20-jdk-alpine

WORKDIR /app

# Copy JAR from builder stage
COPY --from=builder /app/app/build/libs/*.jar app.jar

# Run the Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
