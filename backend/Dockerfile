FROM eclipse-temurin:20-jdk

WORKDIR /app

COPY gradlew .
COPY gradle ./gradle
COPY build.gradle settings.gradle ./
COPY src ./src

RUN chmod +x gradlew
# Build the Spring Boot executable jar
RUN ./gradlew bootJar -x test --no-daemon

# Run the fat jar (exclude *-plain.jar)
CMD ["sh", "-c", "java -jar $(ls build/libs/*.jar | grep -v plain | head -n 1)"]
