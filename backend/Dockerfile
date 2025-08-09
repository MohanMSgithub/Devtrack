FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY gradlew gradlew.bat ./
COPY gradle ./gradle
COPY settings.gradle ./

# Copy build.gradle from app submodule
COPY app/build.gradle ./app/

# Download dependencies
RUN ./gradlew dependencies --no-daemon || return 0

# Copy actual source code from app/src
COPY app/src ./app/src

# Build the application
RUN ./gradlew clean build -x test --no-daemon

# Run the jar
CMD ["java", "-jar", "$(ls app/build/libs/*.jar | head -n 1)"]
