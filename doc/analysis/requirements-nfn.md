# Requisitos No Funcionales

Los siguientes requisitos no funcionales aseguran la calidad, seguridad y usabilidad del sistema.

---

## Feature: Disponibilidad y seguridad

NREQ-001 – Disponibilidad del sistema del 99%
Descripción/justificación: El sistema debe garantizar una disponibilidad mínima del 99% para no interrumpir el seguimiento de medicamentos.
Criterios de aceptación:
  Given el sistema está en funcionamiento
  When se mide la disponibilidad en un periodo mensual
  Then el uptime debe ser igual o superior al 99%
Prioridad: [P0]

NREQ-002 – Cifrado de información personal y médica
Descripción/justificación: Toda la información personal y médica debe estar cifrada tanto en tránsito como en almacenamiento local para proteger la privacidad del usuario.
Criterios de aceptación:
  Given el usuario ingresa o consulta información personal o médica
  When los datos son transmitidos o almacenados
  Then se debe aplicar cifrado en tránsito y en almacenamiento local
Prioridad: [P0]

NREQ-003 – Emisión puntual de notificaciones
Descripción/justificación: El sistema debe emitir notificaciones en el momento exacto programado, evitando retrasos que puedan comprometer el tratamiento.
Criterios de aceptación:
  Given el usuario tiene una notificación programada
  When llega la hora establecida
  Then la notificación se envía en un margen de ±5 segundos respecto a la hora programada
Prioridad: [P0]

---

## Feature: Usabilidad y rendimiento

NREQ-004 – Interfaz accesible para adultos mayores
Descripción/justificación: La interfaz debe ser legible y de fácil navegación para adultos mayores, con tipografía clara y elementos interactivos grandes.
Criterios de aceptación:
  Given el usuario navega en la aplicación
  When visualiza textos y botones
  Then el tamaño de letra debe ser legible y los elementos interactivos fácilmente seleccionables
Prioridad: [P1]

NREQ-005 – Optimización para dispositivos de bajos recursos
Descripción/justificación: El sistema debe funcionar de forma fluida en dispositivos con limitaciones de memoria y procesador.
Criterios de aceptación:
  Given el usuario utiliza un dispositivo con bajos recursos
  When ejecuta la aplicación
  Then la app debe mantener un tiempo de respuesta menor a 2 segundos en las operaciones principales
Prioridad: [P1]

NREQ-006 – Confirmación en acciones críticas
Descripción/justificación: La aplicación debe mostrar un mensaje de confirmación al realizar acciones críticas, como eliminar medicamentos, para prevenir errores.
Criterios de aceptación:
  Given el usuario intenta realizar una acción crítica
  When selecciona "Eliminar" o una opción irreversible
  Then el sistema muestra un mensaje de confirmación antes de proceder
Prioridad: [P1]

NREQ-007 – Exportación de datos en PDF y JSON
Descripción/justificación: El sistema debe permitir al usuario exportar su información personal y médica en formato PDF y JSON.
Criterios de aceptación:
  Given el usuario solicita exportar su información
  When selecciona el formato PDF o JSON
  Then el sistema genera el archivo en el formato elegido y lo pone disponible para descarga
Prioridad: [P1]

---

## Feature: Experiencia del usuario

NREQ-008 – Consejos y tutoriales para nuevos usuarios
Descripción/justificación: La aplicación debe mostrar consejos o tutoriales cortos que faciliten el aprendizaje y uso de la plataforma.
Criterios de aceptación:
  Given el usuario inicia sesión por primera vez
  When accede a la aplicación
  Then el sistema muestra consejos o tutoriales breves sobre el uso de las funciones principales
Prioridad: [P2]

NREQ-009 – Ajuste de tamaño de texto
Descripción/justificación: La aplicación debe permitir modificar el tamaño del texto en toda la interfaz, para adaptarse a las necesidades del usuario.
Criterios de aceptación:
  Given el usuario accede a la configuración de la aplicación
  When modifica el tamaño del texto
  Then toda la interfaz ajusta la tipografía al tamaño seleccionado
Prioridad: [P2]

NREQ-010 – Consistencia de diseño entre dispositivos
Descripción/justificación: La interfaz debe mantener el mismo diseño y comportamiento en dispositivos de diferentes marcas y resoluciones.
Criterios de aceptación:
  Given el usuario utiliza la aplicación en diferentes dispositivos
  When navega por las funciones
  Then el diseño, colores, iconos y distribución se mantienen consistentes
Prioridad: [P2]
