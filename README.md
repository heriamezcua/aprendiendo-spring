# Aprendiendo Spring

Mi curso práctico de Spring Boot, desde cero hasta nivel profesional, construyendo proyectos reales.

- **Teoría:** https://spring.heriamezcua.es
- **Código:** carpeta [`lecciones/`](lecciones/)

## Estructura

```
aprendiendo-spring/
├── lecciones/          # un proyecto Spring Boot por lección
├── web/                # web de teoría (Astro Starlight)
└── .github/workflows/  # publicación automática de la web
```

## Ver la web en local

```bash
cd web
npm install
npm run dev
```

Se abre en http://localhost:4321. Cada `git push` a `main` que toque `web/` la publica automáticamente.
