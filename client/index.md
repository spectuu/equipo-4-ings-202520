# Testing y Calidad - Frontend

## Smoke Test - Puntos Críticos

A continuación se presentan 5 puntos críticos del frontend que deben ser probados en cada despliegue para garantizar el correcto funcionamiento de la aplicación MEDICOD.

---

### 1. El formulario de registro valida los requisitos de contraseña correctamente

**¿Qué flujo cubre y por qué debe hacer parte del smoke test?**

Este flujo cubre el registro de nuevos usuarios en la aplicación. Es crítico porque la seguridad de las cuentas de usuario depende de que las contraseñas cumplan con los requisitos mínimos establecidos (8 caracteres, mayúsculas, minúsculas, números y caracteres especiales). Si este flujo falla, se podrían crear cuentas con contraseñas débiles, comprometiendo la seguridad de los datos médicos de los usuarios.

**¿Cómo se ejecuta?**

- Navegar a la página de registro (`/signup`)
- Ingresar un nombre de usuario y email válidos
- Intentar ingresar una contraseña que no cumpla con los requisitos
- Verificar que se muestren los indicadores visuales de requisitos no cumplidos (en rojo)
- Intentar enviar el formulario y verificar que el botón esté deshabilitado
- Ingresar una contraseña que cumpla todos los requisitos
- Verificar que todos los indicadores se pongan en verde
- Confirmar que el botón de registro se habilite
- Enviar el formulario y verificar que se cree la cuenta exitosamente

**¿Qué tipo de test lo prueba?**

Integration test (e2e) - Ya que prueba la integración completa del componente de registro con sus validaciones en tiempo real y la interacción del usuario con el formulario.

---

### 2. El formulario de login autentica usuarios correctamente y redirige al dashboard

**¿Qué flujo cubre y por qué debe hacer parte del smoke test?**

Este flujo cubre la autenticación de usuarios existentes. Es el punto de entrada principal a la aplicación y es crítico porque sin un login funcional, los usuarios no pueden acceder a ninguna funcionalidad de MEDICOD. Además, maneja el almacenamiento del token de sesión que permite mantener al usuario autenticado.

**¿Cómo se ejecuta?**

- Navegar a la página de login (`/login`)
- Ingresar credenciales válidas (username y password)
- Hacer clic en "Iniciar sesión"
- Verificar que se muestre el estado de carga
- Verificar que se almacene el token en el localStorage
- Verificar que se redirija al dashboard principal (`/`)
- Verificar que el usuario permanezca autenticado al recargar la página

**¿Qué tipo de test lo prueba?**

Integration test (e2e) - Prueba la integración del formulario con la API de autenticación, el manejo de estado, y la navegación entre páginas.

---

### 3. El inventario muestra correctamente los medicamentos con sus estados (vencidos, por vencer, pocas unidades)

**¿Qué flujo cubre y por qué debe hacer parte del smoke test?**

Este flujo cubre la funcionalidad principal de MEDICOD: la gestión del inventario de medicamentos. Es crítico porque los usuarios dependen de esta información para saber qué medicamentos tienen disponibles, cuáles están próximos a vencer y cuáles tienen stock bajo. Una falla aquí podría llevar a que los usuarios tomen medicamentos vencidos o se queden sin medicamentos necesarios.

**¿Cómo se ejecuta?**

- Iniciar sesión en la aplicación
- Navegar a la página de inventario (`/inventory`)
- Verificar que se cargue la lista de medicamentos
- Verificar que los medicamentos vencidos se marquen visualmente con fondo rojo y badge "Vencido"
- Verificar que los medicamentos por vencer (≤30 días) se marquen con fondo amarillo y badge "Por vencer"
- Verificar que los medicamentos con pocas unidades (≤5) se marquen con fondo azul y badge "Pocas unidades"
- Verificar que los resúmenes numéricos al final de la página sean correctos
- Hacer clic en cada filtro y verificar que se muestren solo los medicamentos correspondientes

**¿Qué tipo de test lo prueba?**

Integration test - Prueba la integración entre la carga de datos, el cálculo de estados basados en fechas y cantidades, y la renderización visual de los diferentes estados.

---

### 4. El buscador de inventario filtra medicamentos en tiempo real

**¿Qué flujo cubre y por qué debe hacer parte del smoke test?**

Este flujo cubre la funcionalidad de búsqueda en el inventario. Es crítico especialmente para usuarios con muchos medicamentos, ya que les permite encontrar rápidamente un medicamento específico. Si falla, los usuarios con inventarios grandes tendrían que buscar manualmente entre todos sus medicamentos.

**¿Cómo se ejecuta?**

- Navegar a la página de inventario (`/inventory`)
- Esperar a que cargue la lista completa de medicamentos
- Escribir un término de búsqueda en el campo del buscador (ej: "Ibuprofeno")
- Verificar que la tabla se actualice en tiempo real (debounce de 350ms)
- Verificar que solo se muestren los medicamentos que coincidan con el término
- Borrar el término de búsqueda usando el botón "×"
- Verificar que se muestren nuevamente todos los medicamentos
- Probar con términos que no coincidan y verificar que se muestre mensaje apropiado

**¿Qué tipo de test lo prueba?**

Integration test - Prueba la integración del input de búsqueda con el debounce, la llamada a la API y la actualización del estado de la lista.

---

### 5. El formulario de añadir medicamento valida campos obligatorios y previene cantidad cero

**¿Qué flujo cubre y por qué debe hacer parte del smoke test?**

Este flujo cubre la creación de nuevos registros en el inventario. Es crítico porque asegura la integridad de los datos del inventario. Si se permitiera guardar medicamentos sin nombre, sin cantidad o con cantidad cero, el inventario contendría datos inválidos que podrían causar confusión o errores en otras funcionalidades.

**¿Cómo se ejecuta?**

- Navegar a la página de inventario (`/inventory`)
- Hacer clic en el botón "Añadir"
- Verificar que se abra el modal de registro
- Intentar enviar el formulario vacío
- Verificar que aparezcan mensajes de validación en español: "Por favor, completa este campo"
- Llenar el nombre del medicamento
- Intentar ingresar cantidad 0 o negativa
- Verificar que el campo tenga la restricción `min="1"`
- Seleccionar una unidad del dropdown (no permitir texto libre)
- Verificar que la unidad sea obligatoria (marcada con asterisco rojo)
- Llenar todos los campos obligatorios correctamente
- Enviar el formulario
- Verificar que aparezca un mensaje de éxito en la parte superior central de la pantalla
- Verificar que el medicamento aparezca en la lista

**¿Qué tipo de test lo prueba?**

Integration test - Prueba la integración del formulario con las validaciones HTML5 personalizadas, validaciones JavaScript, llamada a la API, actualización del estado y feedback visual al usuario.

---

## Notas de Implementación

- Todos los mensajes de validación están en español para mejorar la experiencia del usuario
- Las validaciones se ejecutan tanto en el cliente (frontend) como en el servidor (backend) para mayor seguridad
- Los mensajes de éxito/error se muestran en posición fija superior para garantizar visibilidad
- Se implementó debounce en el buscador para optimizar las llamadas a la API
