# be.md 

# Frameworks Backend para Medicod

---

## Frameworks considerados

### 1. Spring Boot (MVC con Spring Data JPA)

**Descripción:** Framework principal de Spring que permite construir aplicaciones backend con APIs REST, integraciones con bases de datos y fácil configuración.

**Pros**
- Arranque rápido con iniciadores y configuración mínima.  
- Compatible con Spring Data, Security, Actuator, etc.  
- Amplia comunidad, documentación extensa, soporte a largo plazo.

**Contras**
- Consumo de recursos mayor que frameworks minimalistas.  
- Tiempo de arranque más lento en comparación con microframeworks.  
- Curva de aprendizaje media por la cantidad de módulos y configuraciones.

---

### 2. Quartz Scheduler

**Descripción:** Framework especializado en programación de tareas y recordatorios persistentes en base de datos.

**Pros**
- Los recordatorios no se pierden si el servidor se reinicia.  
- Soporte para intervalos, zonas horarias y excepciones.  
- Permite ejecución en clúster y balanceo de cargas de tareas.

**Contras**
- Mayor complejidad de configuración frente a `@Scheduled` (tareas programadas).  
- Dependencia de base de datos para almacenar los jobs.  
- Sobrecoste en el MVP si los recordatorios fueran simples.

---

### 3. Spring Security
**Descripción:** Framework de seguridad de Spring para manejar autenticación y autorización de usuarios.

**Pros**
- Manejo de JWT, OAuth2, control de roles y permisos.  
- CSRF, CORS, encriptación de contraseñas, cabeceras seguras.  
- Fácil de aplicar a controladores y endpoints.

**Contras**
- Requiere ajustar reglas y filtros.  
- Curva de aprendizaje alta para personalizaciones avanzadas.  
- Sobrecarga en proyectos pequeños aunque esencial en sistemas con datos sensibles.

---

## Decisión final

El backend del proyecto se trabajara con los siguientes frameworks:

- **Spring Boot (MVC + JPA)**: Base del backend, APIs REST, persistencia en MariaDB y observabilidad.  
- **Quartz Scheduler**: Motor principal de los recordatorios de medicamentos, garantizando que las alarmas no se pierdan y soportando configuraciones avanzadas.  
- **Spring Security**: Protección de la información sensible de los pacientes con autenticación JWT y control de roles (paciente, cuidador, administrador).  

### Justificación

Se tomo esta decisión porque:
1. **Confiabilidad de recordatorios:** Quartz asegura persistencia y tolerancia a fallos, requisito clave.  
2. **Seguridad:** Spring Security garantiza el cumplimiento de buenas prácticas para datos sensibles.  
3. **Productividad y ecosistema:** Spring Boot integra todos los módulos necesarios de forma estándar en la industria, reduciendo curva de integración.  
4. **Escalabilidad y mantenimiento:** El stack permite empezar como un monolito robusto y evolucionar hacia microservicios si el proyecto crece.  
