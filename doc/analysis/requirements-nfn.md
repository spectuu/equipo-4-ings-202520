# Requisitos No Funcionales

Los siguientes requisitos no funcionales aseguran la calidad, seguridad y usabilidad del sistema.

---

## [P0] Críticos

1. El sistema debe garantizar una disponibilidad del 99% para no interrumpir el seguimiento de medicamentos.  
2. Toda la información personal y médica debe estar cifrada en tránsito y en almacenamiento local.  
3. El sistema debe emitir notificaciones puntuales con una tolerancia máxima de 5 segundos respecto a la hora programada.

---

## [P1] Importantes

4. La interfaz debe ser accesible y usable para adultos mayores, con fuentes legibles y navegación intuitiva.  
5. El sistema debe estar optimizado para funcionar en dispositivos con bajos recursos (RAM < 2 GB).  
6. La aplicación debe funcionar sin conexión para registrar tomas y actualizar inventario; los datos se sincronizan al recuperar conexión.  
7. El sistema debe permitir exportar la información del usuario en formato PDF y JSON.  
8. El sistema debe realizar copias de seguridad automáticas (locales o en la nube) cada 24 horas, si el usuario lo permite.

---

## [P2] Deseables

9. La aplicación debe permitir personalizar la interfaz con temas claros u oscuros según preferencia del usuario.  
10. Las actualizaciones de la app no deben superar los 100 MB para facilitar su descarga en redes móviles lentas.
