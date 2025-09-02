# Requisitos Funcionales

A continuación se listan los 20 requisitos funcionales del sistema MEDICOD, escritos en notación Gherkin y clasificados por prioridad.

---

## Inventario de medicamentos

```gherkin

Feature: Inventario de medicamentos

RF-INV-001 – Registrar un nuevo medicamento
Descripción/justificación: Permite al usuario agregar un medicamento al inventario personal, registrando nombre, dosis y cantidad, para mantener un control actualizado del stock.
Criterios de aceptación: 
  Given el usuario está en la sección de inventario
  When ingresa el nombre, dosis y cantidad
  Then el medicamento se agrega al inventario personal
Prioridad: [P0]
Notas de implementación: Validar campos obligatorios y que la cantidad sea un número positivo.
Puntos: 1 

RF-INV-002 – Editar un medicamento existente
Descripción/justificación: Permite modificar la información de un medicamento ya registrado, para actualizar dosis, nombre o cantidad.
Criterios de aceptación:
  Given el usuario tiene medicamentos registrados
  When selecciona un medicamento y actualiza la información
  Then el sistema guarda los cambios en el inventario
Prioridad: [P1]
Puntos: 1

RF-INV-003 – Eliminar un medicamento del inventario
Descripción/justificación: Permite retirar medicamentos que ya no se usan o que se han agotado, manteniendo el inventario limpio.
Criterios de aceptación:
  Given el usuario tiene medicamentos registrados
  When presiona "Eliminar" sobre un medicamento
  Then el medicamento se elimina del inventario
Prioridad: [P1]
Puntos: 1

RF-INV-004 – Visualizar medicamentos en inventario
Descripción/justificación: Muestra al usuario la lista completa de medicamentos con sus cantidades y dosis para un control rápido.
Criterios de aceptación:
  Given el usuario tiene medicamentos registrados
  When accede al módulo de inventario
  Then ve una lista con todos los medicamentos y su cantidad restante
Prioridad: [P0]
Puntos: 2

RF-INV-005 – Detectar medicamentos por agotarse
Descripción/justificación: Identifica y alerta sobre medicamentos con menos de 3 unidades para evitar quedarse sin tratamiento.
Criterios de aceptación:
  Given el usuario tiene medicamentos con menos de 3 unidades restantes
  When accede al inventario
  Then el sistema debe mostrar una alerta de "medicamento por agotarse"
Prioridad: [P0]
Notas de implementación: El umbral debe ser configurable por el usuario.
Puntos: 2

RF-INV-006 – Buscar un medicamento en el inventario
Descripción/justificación: Permite localizar rápidamente un medicamento mediante un buscador por nombre o principio activo.
Criterios de aceptación:
  Given el usuario tiene varios medicamentos registrados
  When escribe el nombre del medicamento en el buscador
  Then el sistema muestra los resultados que coinciden con la búsqueda
Prioridad: [P2]
Puntos: 1

## Recordatorios y alarmas

Feature: Recordatorios y alarmas

RF-REC-001 – Configurar un recordatorio diario
Descripción/justificación: Permite programar alarmas diarias para tomar medicamentos a horarios específicos.
Criterios de aceptación:
  Given el usuario tiene medicamentos activos
  When selecciona un horario y activa el recordatorio
  Then el sistema programa una alarma diaria para ese medicamento
Prioridad: [P0]
Puntos: 3

RF-REC-002 – Recibir una notificación de toma
Descripción/justificación: Envía una alerta en el momento exacto para tomar el medicamento y garantizar cumplimiento del tratamiento.
Criterios de aceptación:
  Given hay un recordatorio programado
  When llega la hora programada
  Then el sistema envía una notificación al dispositivo
Prioridad: [P0]
Puntos: 3

RF-REC-003 – Confirmar la toma del medicamento
Descripción/justificación: Registra la confirmación de que un medicamento fue tomado.
Criterios de aceptación:
  Given el usuario recibe un recordatorio
  When presiona "Confirmar toma"
  Then el sistema registra que el medicamento fue tomado
Prioridad: [P0]
Puntos: 1

RF-REC-004 – Reportar que se olvidó tomar un medicamento
Descripción/justificación: Registra los casos en que el usuario omite una dosis para análisis de adherencia.
Criterios de aceptación:
  Given el usuario no tomó el medicamento
  When presiona "Omitir toma"
  Then el sistema registra el evento como "no tomado"
Prioridad: [P1]
Puntos: 1

RF-REC-005 – Ver historial de tomas
Descripción/justificación: Permite consultar un registro histórico de tomas y omisiones con fecha y hora.
Criterios de aceptación:
  Given el usuario ha confirmado tomas en días anteriores
  When accede al historial
  Then el sistema muestra fechas, horas y estado de cada toma
Prioridad: [P1]
Puntos: 3

RF-REC-006 – Desactivar un recordatorio
Descripción/justificación: Detiene las notificaciones de un medicamento sin eliminarlo del inventario.
Criterios de aceptación:
  Given el usuario tiene un recordatorio activo
  When selecciona la opción "Desactivar"
  Then el sistema detiene las notificaciones para ese medicamento
Prioridad: [P2]
Puntos: 1

## Reseñas de medicamentos

Feature: Reseñas de medicamentos

RF-RES-001 – Calificar un medicamento
Descripción/justificación: Permite asignar una puntuación de 1 a 5 estrellas según la experiencia con el medicamento.
Criterios de aceptación:
  Given el usuario ha estado usando un medicamento por al menos 7 días
  When accede a la opción de calificar
  Then puede dejar una puntuación de 1 a 5 estrellas
Prioridad: [P1]
Puntos: 2

RF-RES-002 – Escribir una reseña
Descripción/justificación: Permite escribir un comentario sobre la experiencia con un medicamento ya calificado.
Criterios de aceptación:
  Given el usuario ha calificado un medicamento
  When accede al formulario de reseña
  Then puede escribir una opinión y guardarla
Prioridad: [P1]
Puntos: 1

RF-RES-003 – Ver reseñas anteriores
Descripción/justificación: Permite consultar y editar comentarios previos sobre medicamentos.
Criterios de aceptación:
  Given el usuario ha dejado reseñas
  When accede a la sección de reseñas
  Then puede ver y editar sus comentarios anteriores
Prioridad: [P2]
Puntos: 1

RF-RES-004 – Ver resumen de satisfacción
Descripción/justificación: Muestra el promedio de calificaciones y porcentaje de satisfacción de los usuarios.
Criterios de aceptación:
  Given el sistema tiene varias calificaciones
  When el usuario consulta estadísticas
  Then puede ver el promedio de estrellas y porcentaje de satisfacción
Prioridad: [P2]
Puntos: 2

##Seguridad y acceso

Feature: Seguridad y acceso

RF-SEG-001 – Iniciar sesión en la aplicación
Descripción/justificación: Permite acceder a la aplicación mediante correo y contraseña para usuarios registrados.
Criterios de aceptación:
  Given el usuario tiene una cuenta registrada
  When ingresa su correo y contraseña correctos
  Then el sistema permite el acceso a la aplicación
Prioridad: [P0]
Puntos: 5

RF-SEG-002 – Cerrar sesión
Descripción/justificación: Permite finalizar la sesión activa y regresar a la pantalla de inicio.
Criterios de aceptación:
  Given el usuario está autenticado
  When selecciona "Cerrar sesión"
  Then el sistema finaliza la sesión y regresa a la pantalla de inicio
Prioridad: [P1]
Puntos: 5
 
RF-SEG-003 – Recuperar contraseña
Descripción/justificación: Permite restablecer la contraseña en caso de olvido mediante un enlace enviado por correo.
Criterios de aceptación:
  Given el usuario olvidó su contraseña
  When solicita restablecerla e ingresa su correo
  Then el sistema envía un enlace para crear una nueva contraseña
Prioridad: [P2]
Puntos: 5

## Historial de reportes

Feature: Historial de reportes

RF-HIS-001 – Generar reporte mensual
Descripción/justificación: Genera un documento PDF con el resumen mensual de tomas, omisiones y calificaciones de medicamentos.
Criterios de aceptación:
  Given el usuario ha usado la app por más de un mes
  When solicita un reporte
  Then el sistema genera un PDF con tomas, omisiones y calificaciones
Prioridad: [P1]
Puntos: 2
```
