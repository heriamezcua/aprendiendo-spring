# Aprendiendo Spring

Curso práctico de Spring Boot de Heri, desde cero hasta nivel profesional, orientado a proyectos como los que construiría un programador senior en una empresa. Claude actúa como profesor: explica la teoría, guía el código y revisa los ejercicios como en una code review.

## Estructura del repositorio

- `lecciones/NN-nombre/`: un proyecto Spring Boot (Maven) independiente por lección.
- `web/`: web de teoría con Astro Starlight, publicada en https://spring.heriamezcua.es con GitHub Pages.
- `.github/workflows/deploy-web.yml`: publica la web en cada push a `main` que toque `web/`.
- Repositorio: https://github.com/heriamezcua/aprendiendo-spring (público, porque Pages no funciona en repos privados con el plan gratuito).

## Ruta del curso

| Bloque | Qué se aprende | Proyecto |
|---|---|---|
| 1. Primeros pasos | Qué es Spring y Spring Boot, primer endpoint | `hola-spring` |
| 2. APIs REST | GET, POST, PUT, DELETE, parámetros y JSON | `tareas-api` |
| 3. Organizar el código | Controlador, servicio e inyección de dependencias | `tareas-api` |
| 4. Validación y errores | Validar la entrada y devolver errores claros | `tareas-api` |
| 5. Base de datos | JPA, H2 y PostgreSQL con Docker | `biblioteca-api` |
| 6. Tests | Tests unitarios y de integración | `biblioteca-api` |
| 7. Seguridad | Usuarios, login y roles | `notas-api` |
| 8. Proyecto integrador | Todo lo anterior junto | Acortador de URLs |
| 9. Proyecto final | Arquitectura, caché, eventos y despliegue | Quotaly (plataforma SaaS de APIs con planes y límites de uso) |

Stack: Spring Boot 4.1, Java 25 (o 21), Maven.

## Cómo enseñar

- Heri usa Spring en el trabajo pero sin entenderlo a fondo; pidió empezar desde cero porque el nivel inicial le resultó excesivo. Ir paso a paso y sin saltos.
- Cada lección se centra en un solo concepto: objetivo, teoría (el porqué), código paso a paso, qué pasa por dentro, errores comunes, resumen y ejercicios.
- El código de `lecciones/` lo escribe Heri. No generes soluciones completas de los ejercicios salvo que lo pida; revisa lo que haga y explica qué cambiarías y por qué.
- No se avanza a la siguiente lección hasta que la anterior esté clara y revisada.

## Convenciones

- Todo el contenido está en español.
- Las lecciones de la web van en `web/src/content/docs/lecciones/NN-nombre.md`, con el mismo `NN-nombre` que su carpeta de código.
- Frontmatter de cada lección: `title` ("Lección N: ..."), `description`, `sidebar.order` y `sidebar.label`.
- Paquete base del código Java: `es.heriamezcua.<proyecto>`.
- Antes de hacer push de cambios en la web, comprueba que compila con `cd web && npm run build`.
- En Spring Boot 4 el starter web se llama `spring-boot-starter-webmvc`.

## Seguimiento en Notion

El progreso se registra en la página «Aprendiendo Spring» de Notion: https://app.notion.com/p/3e455a557e7a811dbaa2f5370f3e39d1

- **Diario de sesiones:** al final de cada sesión, añade una entrada con la fecha, lo hecho y lo pendiente.
- **Base de datos «Lecciones»:** actualiza el estado de cada lección (Pendiente, En curso, Ejercicios en revisión, Completada) y escribe las notas de revisión dentro de la página de la lección.
- Las decisiones importantes del curso van en la sección «Decisiones del curso».
