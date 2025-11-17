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

## Testing

### Critical Point 1 – User Authentication (Register & Login)

1. **What flow does it cover and why should it be part of the smoke test?**  
   This flow covers user registration and login, including JWT creation and validation.  
   It must be part of the smoke test because no other feature (inventory, reminders, notifications) is usable if users cannot authenticate successfully. A broken login flow effectively makes the whole system unavailable.

2. **How is it executed?**  
   It is verified through JUnit integration tests that call the `/auth/register` and `/auth/login` endpoints, asserting that the API returns HTTP `200`, a `code = 200` in the JSON body, and a non-empty JWT token.  
   Additionally, the same flow is exercised manually via **Swagger UI**, where the team can quickly try the endpoints after each deployment to confirm that authentication is working.

3. **What type of test verifies it? (Unit, Integration, or e2e)**  
   **Integration test** (JUnit) + **manual Swagger smoke check**.


---

### Critical Point 2 – Medication Inventory Usage

1. **What flow does it cover and why should it be part of the smoke test?**  
   This flow covers accessing and managing the patient’s medication inventory: listing the current items and ensuring the authenticated user can see only their own data.  
   It must be part of the smoke test because the medication inventory is the core of the application; if users cannot access or manage their medications, the main business value is lost.

2. **How is it executed?**  
   It is verified through JUnit integration tests that:
   - Register and log in a test user.
   - Call `/inventory/mine` with a valid JWT in the `Authorization` header.
   - Assert that the API responds with HTTP `200`, `code = 200`, and a valid `data` field.  
     The basic inventory flow (list, create, update, delete) can also be quickly re-checked via **Swagger UI** to validate the most important endpoints during smoke testing.

3. **What type of test verifies it? (Unit, Integration, or e2e)**  
   **Integration test** (JUnit) + **manual Swagger smoke check**.


---

### Critical Point 3 – Reminder Creation and Scheduling

1. **What flow does it cover and why should it be part of the smoke test?**  
   This flow covers creating a reminder linked to a medication, storing the reminder in the database, and ensuring that it appears when listing a user’s reminders.  
   It is part of the smoke test because reminders are the mechanism that actually notify elderly users when to take their medications; if reminder creation fails, the notification system loses its purpose.

2. **How is it executed?**  
   It is verified by JUnit integration tests that:
   - Authenticate a user.
   - Create a reminder for one of their inventory items via `/reminders`.
   - Call `/reminders/mine` and assert that the new reminder is present with the correct time, frequency, and active state.

3. **What type of test verifies it? (Unit, Integration, or e2e)**  
   **Integration test** (JUnit).


---

### Critical Point 4 – Role-Based Access Control for Protected Endpoints

1. **What flow does it cover and why should it be part of the smoke test?**  
   This flow covers enforcing role-based access control, ensuring that only users with the proper role (e.g., `ADMIN`) can access administrative or configuration endpoints.  
   It must be part of the smoke test because a misconfigured security layer could expose sensitive operations to normal users, creating security and data-integrity risks.

2. **How is it executed?**  
   It is verified by JUnit tests that:
   - Authenticate a normal user and attempt to access an admin-only endpoint, expecting `403 Forbidden`.
   - Authenticate an admin user and access the same endpoint, expecting HTTP `200` and a valid response body.

3. **What type of test verifies it? (Unit, Integration, or e2e)**  
   **Integration test** (JUnit), focused on security configuration.


---

### Critical Point 5 – Core API Availability and Health Check

1. **What flow does it cover and why should it be part of the smoke test?**  
   This flow covers the basic availability of the backend: the health endpoint and at least one simple public API responding with `200 OK`.  
   It should be part of the smoke test because it gives a quick indicator that the application has started correctly, the database is reachable, and the main REST layer is responding as expected.

2. **How is it executed?**  
   It is verified by JUnit tests that call the health endpoint (e.g., `/actuator/health`) and one simple GET endpoint, asserting that they return HTTP `200` and a minimal valid JSON body. These checks are lightweight and fast, ideal for a first-line smoke test after deployment.

3. **What type of test verifies it? (Unit, Integration, or e2e)**  
   **Integration test** (JUnit), sometimes also run as part of deployment health checks.

