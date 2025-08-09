# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy the Gradle wrapper and build files first
COPY gradlew gradlew.bat ./
COPY gradle ./gradle
COPY build.gradle settings.gradle ./

# Download dependencies
RUN ./gradlew dependencies --no-daemon || return 0

# Copy the actual backend source code
COPY src ./src

# Build the application
RUN ./gradlew clean build -x test --no-daemon

# Run the jar file
CMD ["java", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]
