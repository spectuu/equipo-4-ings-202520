# Requisitos Funcionales

A continuación se listan los 20 requisitos funcionales del sistema MEDICOD, escritos en notación Gherkin y clasificados por prioridad.

---

## Inventario de medicamentos

```gherkin

Feature: Inventario de medicamentos

[P0]
Scenario: Registrar un nuevo medicamento
  Given el usuario está en la sección de inventario
  When ingresa el nombre, dosis y cantidad
  Then el medicamento se agrega al inventario personal

[P1]
Scenario: Editar un medicamento existente
  Given el usuario tiene medicamentos registrados
  When selecciona un medicamento y actualiza la información
  Then el sistema guarda los cambios en el inventario

[P1]
Scenario: Eliminar un medicamento del inventario
  Given el usuario tiene medicamentos registrados
  When presiona "Eliminar" sobre un medicamento
  Then el medicamento se elimina del inventario

[P0]
Scenario: Visualizar medicamentos en inventario
  Given el usuario tiene medicamentos registrados
  When accede al módulo de inventario
  Then ve una lista con todos los medicamentos y su cantidad restante

[P0]
Scenario: Detectar medicamentos por agotarse
  Given el usuario tiene medicamentos con menos de 3 unidades restantes
  When accede al inventario
  Then el sistema debe mostrar una alerta de "medicamento por agotarse"

[P2]
Scenario: Buscar un medicamento en el inventario
  Given el usuario tiene varios medicamentos registrados
  When escribe el nombre del medicamento en el buscador
  Then el sistema muestra los resultados que coinciden con la búsqueda

## Recordatorios y alarmas

Feature: Recordatorios y alarmas

[P0]
Scenario: Configurar un recordatorio diario
  Given el usuario tiene medicamentos activos
  When selecciona un horario y activa el recordatorio
  Then el sistema programa una alarma diaria para ese medicamento

[P0]
Scenario: Recibir una notificación de toma
  Given hay un recordatorio programado
  When llega la hora programada
  Then el sistema envía una notificación al dispositivo

[P0]
Scenario: Confirmar la toma del medicamento
  Given el usuario recibe un recordatorio
  When presiona "Confirmar toma"
  Then el sistema registra que el medicamento fue tomado

[P1]
Scenario: Reportar que se olvidó tomar un medicamento
  Given el usuario no tomó el medicamento
  When presiona "Omitir toma"
  Then el sistema registra el evento como "no tomado"

[P1]
Scenario: Ver historial de tomas
  Given el usuario ha confirmado tomas en días anteriores
  When accede al historial
  Then el sistema muestra fechas, horas y estado de cada toma

[P2]
Scenario: Desactivar un recordatorio
  Given el usuario tiene un recordatorio activo
  When selecciona la opción "Desactivar"
  Then el sistema detiene las notificaciones para ese medicamento

## Reseñas de medicamentos

Feature: Reseñas de medicamentos

[P1]
Scenario: Calificar un medicamento
  Given el usuario ha estado usando un medicamento por al menos 7 días
  When accede a la opción de calificar
  Then puede dejar una puntuación de 1 a 5 estrellas

[P1]
Scenario: Escribir una reseña
  Given el usuario ha calificado un medicamento
  When accede al formulario de reseña
  Then puede escribir una opinión y guardarla

[P2]
Scenario: Ver reseñas anteriores
  Given el usuario ha dejado reseñas
  When accede a la sección de reseñas
  Then puede ver y editar sus comentarios anteriores

[P2]
Scenario: Ver resumen de satisfacción
  Given el sistema tiene varias calificaciones
  When el usuario consulta estadísticas
  Then puede ver el promedio de estrellas y porcentaje de satisfacción

##Seguridad y acceso

Feature: Seguridad y acceso

[P0]
Scenario: Iniciar sesión en la aplicación
  Given el usuario tiene una cuenta registrada
  When ingresa su correo y contraseña correctos
  Then el sistema permite el acceso a la aplicación

[P1]
Scenario: Cerrar sesión
  Given el usuario está autenticado
  When selecciona "Cerrar sesión"
  Then el sistema finaliza la sesión y regresa a la pantalla de inicio
 
[P2]
Scenario: Recuperar contraseña
  Given el usuario olvidó su contraseña
  When solicita restablecerla e ingresa su correo
  Then el sistema envía un enlace para crear una nueva contraseña

## Historial de reportes

Feature: Historial de reportes

[P1]
Scenario: Generar reporte mensual
  Given el usuario ha usado la app por más de un mes
  When solicita un reporte
  Then el sistema genera un PDF con tomas, omisiones y calificaciones



