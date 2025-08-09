FROM eclipse-temurin:20-jdk  # or 17-jdk if you change Gradle to sourceCompatibility=17

WORKDIR /app

COPY gradlew .
COPY gradle ./gradle
COPY app/build.gradle ./app/
COPY settings.gradle ./
COPY app/src ./app/src


RUN chmod +x gradlew
# Build the Spring Boot executable jar
RUN ./gradlew bootJar -x test --no-daemon

# Run the fat jar (exclude *-plain.jar)
CMD ["sh", "-c", "java -jar $(ls build/libs/*.jar | grep -v plain | head -n 1)"]




