FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

COPY gradlew gradlew.bat ./
COPY gradle ./gradle
COPY settings.gradle ./
COPY app/build.gradle ./app/

# Make gradlew executable
RUN chmod +x gradlew

RUN ./gradlew dependencies --no-daemon || return 0

COPY app/src ./app/src

RUN ./gradlew clean build -x test --no-daemon

CMD ["sh", "-c", "java -jar $(ls app/build/libs/*.jar | head -n 1)"]
