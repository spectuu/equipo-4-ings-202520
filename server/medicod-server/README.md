# medicod-server

This folder contains the backend server for the Medicod project, implemented in Java using Spring Boot and JOOQ for database access.

## What does this folder do?
This folder provides RESTful APIs for authentication, inventory management, and other core features of the Medicod application. It handles business logic, data persistence, and security for the backend.

## How to install this part of the project?
1. Ensure you have Java 17 or higher installed.
2. Clone the repository and navigate to this folder.
3. Install dependencies and build the project using Gradle:
   ```cmd
   gradlew.bat build
   ```

## How to run this part of the project?
Start the server with:
```cmd
gradlew.bat bootRun
```
The server will start on the default port (usually 8080). Configuration can be adjusted in `src/main/resources/application.properties`.

## What standards should be considered?
- JavaDoc comments for all public classes and methods.
- Follow standard Java naming conventions.
- Use Spring Boot best practices for configuration and dependency injection.
- Organize code by domain (controller, service, repository, dto).

## What version of Java is used?
Java 17 or higher is required.

## What do I need for the database?
- A running instance of a supported SQL database (e.g., MySQL or PostgreSQL).
- Configure database connection details in `src/main/resources/application.properties` (e.g., URL, username, password).
- JOOQ will generate code based on your database schema; ensure the schema is up-to-date before building.

For further details, refer to the documentation in each source file and the configuration files.
