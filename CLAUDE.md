# Aprendiendo Spring

Repositorio de aprendizaje de Spring Boot. Contiene dos partes:

- `lecciones/NN-nombre/`: un proyecto Spring Boot (Maven) independiente por lección.
- `web/`: web de teoría con Astro Starlight, publicada en https://spring.heriamezcua.es con GitHub Pages.

## Convenciones

- Todo el contenido está en español.
- Las lecciones de la web van en `web/src/content/docs/lecciones/NN-nombre.md`, con el mismo `NN-nombre` que su carpeta de código.
- Frontmatter de cada lección: `title` ("Lección N: ..."), `description` y `sidebar.order` / `sidebar.label`.
- Estructura de cada lección: objetivo, teoría, código paso a paso, qué pasa por dentro, errores comunes, resumen y ejercicios.
- Paquete base del código Java: `es.heriamezcua.<proyecto>`.
- Antes de hacer push de cambios en la web, comprueba que compila con `cd web && npm run build`.
- El código de `lecciones/` lo escribe el alumno: no generes soluciones completas de los ejercicios salvo que se pida.
