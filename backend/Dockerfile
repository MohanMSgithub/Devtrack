# Use an official OpenJDK runtime as a parent image
FROM eclipse-temurin:17-jdk-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the Gradle wrapper and build files first (for caching)
COPY backend/gradlew backend/gradlew.bat backend/ ./
COPY backend/gradle ./gradle
COPY backend/build.gradle backend/settings.gradle ./

# Download dependencies (this step is cached if no changes)
RUN ./gradlew dependencies --no-daemon || return 0

# Copy the actual backend source code
COPY backend/src ./src

# Build the application
RUN ./gradlew clean build -x test --no-daemon

# Run the jar file
CMD ["java", "-jar", "build/libs/backend-0.0.1-SNAPSHOT.jar"]
