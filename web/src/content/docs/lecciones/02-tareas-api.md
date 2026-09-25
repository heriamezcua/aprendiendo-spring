---
title: "Lección 2: APIs REST con GET, POST, PUT y DELETE"
description: Qué es REST, los verbos y códigos HTTP, y cómo construir una API de tareas completa que crea, lee, actualiza y borra datos.
sidebar:
  order: 2
  label: "2. APIs REST"
---

**Objetivo:** al terminar esta lección sabrás qué es una API REST, qué significa cada verbo HTTP y cada código de estado importante, y tendrás una API de tareas que permite crear, consultar, modificar y borrar tareas.

**Proyecto:** `lecciones/02-tareas-api`

En la lección 1 tus endpoints solo *devolvían* datos. Ahora vas a construir una API que también los **recibe y los modifica**, que es lo que hace cualquier backend real.

## 1. Qué es una API REST

REST es un estilo para diseñar APIs sobre HTTP. No es una librería ni un estándar oficial: es un conjunto de convenciones que casi todas las APIs siguen, para que cualquiera que las use sepa qué esperar.

La idea central es separar **qué** manipulas de **qué haces** con ello:

- **Qué:** los **recursos**, las "cosas" de tu aplicación. Se identifican con URLs escritas como **sustantivos en plural**: `/tareas`, `/usuarios`, `/facturas`.
- **Qué haces:** lo indica el **verbo HTTP** de la petición, no la URL.

| Mal (verbo en la URL) | Bien (REST) |
|---|---|
| `GET /obtenerTareas` | `GET /tareas` |
| `POST /crearTarea` | `POST /tareas` |
| `POST /borrarTarea?id=3` | `DELETE /tareas/3` |

Con esta convención, una única URL como `/tareas/3` sirve para leer, modificar o borrar la tarea 3. Lo que cambia es el verbo.

## 2. Los verbos HTTP

Los cuatro verbos principales se corresponden con las cuatro operaciones básicas sobre datos, que se conocen como **CRUD** (*Create, Read, Update, Delete*):

| Verbo | Operación | Ejemplo | Qué hace |
|---|---|---|---|
| `GET` | Leer | `GET /tareas` | Devuelve todas las tareas |
| `GET` | Leer | `GET /tareas/3` | Devuelve la tarea 3 |
| `POST` | Crear | `POST /tareas` | Crea una tarea nueva con los datos del cuerpo |
| `PUT` | Actualizar | `PUT /tareas/3` | Sustituye la tarea 3 por los datos del cuerpo |
| `DELETE` | Borrar | `DELETE /tareas/3` | Borra la tarea 3 |

Existe un quinto verbo, `PATCH`, para modificar solo *una parte* de un recurso. Lo usarás en los ejercicios.

### Idempotencia

Una palabra que oirás mucho: una operación es **idempotente** si hacerla una vez o diez veces deja el sistema en el mismo estado.

- `GET`, `PUT` y `DELETE` son idempotentes. Si mandas diez veces "la tarea 3 se llama *Comprar pan*", el resultado es el mismo que mandándolo una vez.
- `POST` **no** lo es. Si mandas diez veces "crea una tarea", tendrás diez tareas.

Esto importa en la vida real: si una petición falla por la red y el cliente la reintenta, reintentar un `PUT` es seguro, pero reintentar un `POST` puede crear duplicados.

## 3. Los códigos de estado

Cada respuesta HTTP lleva un **código de estado** de tres cifras que dice cómo ha ido. El cliente lo mira *antes* de leer el cuerpo. La primera cifra indica la familia:

- **2xx:** todo ha ido bien.
- **4xx:** el error es del cliente (ha pedido algo que no existe, ha mandado datos mal...).
- **5xx:** el error es del servidor (un fallo en tu código, la base de datos caída...).

Los que vas a usar en esta lección:

| Código | Nombre | Cuándo usarlo |
|---|---|---|
| `200` | OK | La petición ha ido bien y devuelves datos |
| `201` | Created | Has creado un recurso con `POST` |
| `204` | No Content | Ha ido bien, pero no hay nada que devolver (típico de `DELETE`) |
| `400` | Bad Request | El cliente ha mandado datos incorrectos |
| `404` | Not Found | El recurso que piden no existe |

:::tip
Una API profesional se reconoce enseguida por sus códigos de estado. Devolver siempre `200`, incluso cuando algo falla, es uno de los errores más habituales en APIs hechas deprisa.
:::

## 4. Crear el proyecto

En [start.spring.io](https://start.spring.io) crea un proyecto igual que en la lección 1, cambiando solo el nombre:

| Campo | Valor |
|---|---|
| Project | Maven |
| Spring Boot | La última versión estable |
| Group | `es.heriamezcua` |
| Artifact | `tareas-api` |
| Java | 21 |
| Dependencies | **Spring Web** |

Descomprímelo en `lecciones/02-tareas-api` e impórtalo en tu IDE. El paquete base será `es.heriamezcua.tareas_api`.

## 5. El modelo: qué es una tarea

Una tarea tiene un identificador, un título y un estado (completada o no). Crea este record:

```java
package es.heriamezcua.tareas_api;

public record Tarea(Long id, String titulo, boolean completada) {
}
```

### Lo que envía el cliente no es lo mismo que lo que guardas

Cuando alguien crea una tarea, **no** debe decidir el `id`: lo asigna el servidor. Y una tarea nueva siempre empieza sin completar. Por eso el cliente no manda una `Tarea` entera, sino solo lo que necesita:

```java
package es.heriamezcua.tareas_api;

public record NuevaTarea(String titulo) {
}
```

Para actualizar con `PUT`, el cliente manda la tarea completa excepto el `id`, que ya va en la URL:

```java
package es.heriamezcua.tareas_api;

public record TareaActualizada(String titulo, boolean completada) {
}
```

A estas clases que solo sirven para transportar datos de entrada o salida se les llama **DTO** (*Data Transfer Object*). Separar lo que entra por la API de lo que guardas internamente es una práctica básica en cualquier proyecto profesional: te protege de que un cliente modifique campos que no debería.

## 6. El controlador

Esta vez guardaremos las tareas **en memoria**, en un `Map` dentro del propio controlador. Es la forma más sencilla de empezar. En la lección 3 lo sacaremos a una clase aparte, y en la lección 5 a una base de datos de verdad.

Crea `TareaController` completo y después lo vemos parte por parte:

```java
package es.heriamezcua.tareas_api;

import java.net.URI;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/tareas")
public class TareaController {

    private final Map<Long, Tarea> tareas = new ConcurrentHashMap<>();
    private final AtomicLong siguienteId = new AtomicLong(1);

    @GetMapping
    public List<Tarea> listar() {
        return tareas.values().stream()
                .sorted(Comparator.comparing(Tarea::id))
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarea> obtener(@PathVariable Long id) {
        Tarea tarea = tareas.get(id);
        if (tarea == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tarea);
    }

    @PostMapping
    public ResponseEntity<Tarea> crear(@RequestBody NuevaTarea peticion) {
        long id = siguienteId.getAndIncrement();
        Tarea tarea = new Tarea(id, peticion.titulo(), false);
        tareas.put(id, tarea);
        return ResponseEntity.created(URI.create("/tareas/" + id)).body(tarea);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tarea> actualizar(@PathVariable Long id,
                                            @RequestBody TareaActualizada peticion) {
        if (!tareas.containsKey(id)) {
            return ResponseEntity.notFound().build();
        }
        Tarea tarea = new Tarea(id, peticion.titulo(), peticion.completada());
        tareas.put(id, tarea);
        return ResponseEntity.ok(tarea);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrar(@PathVariable Long id) {
        if (tareas.remove(id) == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }
}
```

### `@RequestMapping("/tareas")` en la clase

Pone un prefijo común a todos los endpoints del controlador. Por eso `@GetMapping` sin nada responde a `/tareas` y `@GetMapping("/{id}")` responde a `/tareas/{id}`. Así no repites `/tareas` en cada método.

### Dónde se guardan las tareas

- **`ConcurrentHashMap`** es un `Map` preparado para que varios hilos lo usen a la vez. Tomcat atiende cada petición en un hilo distinto, así que si dos personas crean tareas al mismo tiempo, un `HashMap` normal podría corromperse.
- **`AtomicLong`** genera los ids. `getAndIncrement()` devuelve el valor actual y le suma uno en una sola operación, de forma segura aunque lleguen dos peticiones a la vez. Con un `long` normal y `id++`, dos peticiones simultáneas podrían recibir el mismo id.

:::note
Recuerda que el controlador es un **bean**: Spring crea **una sola instancia** y la comparte entre todas las peticiones. Por eso sus campos son compartidos y hay que tener cuidado con la concurrencia.
:::

### `@PathVariable`: datos en la URL

En `@GetMapping("/{id}")`, las llaves marcan un trozo variable de la URL. `@PathVariable Long id` recoge ese valor y lo convierte a `Long`. Si alguien pide `/tareas/7`, `id` valdrá `7`.

Compáralo con el `@RequestParam` de la lección 1:

- **`@PathVariable`** identifica *qué recurso* quieres: `/tareas/7`.
- **`@RequestParam`** sirve para *opciones* de la petición, como filtros u ordenación: `/tareas?completada=true`.

### `@RequestBody`: datos en el cuerpo

En un `POST` o un `PUT`, los datos van en el **cuerpo** de la petición, normalmente en JSON. `@RequestBody NuevaTarea peticion` le dice a Spring que convierta ese JSON en un objeto `NuevaTarea`. Es lo contrario de lo que viste en la lección 1: allí Jackson convertía tus objetos *a* JSON, y aquí convierte JSON *en* objetos.

### `ResponseEntity`: controlar la respuesta entera

Hasta ahora devolvías el objeto directamente y Spring respondía siempre con `200`. `ResponseEntity` te deja controlar **el código de estado, las cabeceras y el cuerpo**:

| Código | Qué devuelve |
|---|---|
| `ResponseEntity.ok(tarea)` | `200` con la tarea en el cuerpo |
| `ResponseEntity.notFound().build()` | `404` sin cuerpo |
| `ResponseEntity.created(uri).body(tarea)` | `201` con la tarea y la cabecera `Location` |
| `ResponseEntity.noContent().build()` | `204` sin cuerpo |

La cabecera **`Location`** del `201` le dice al cliente en qué URL puede consultar lo que acaba de crear. Es la convención REST para las respuestas a un `POST`.

En `listar()` no usamos `ResponseEntity` porque siempre es `200`: una lista vacía no es un error, es una respuesta válida.

## 7. Probar la API

Arranca la aplicación (esta vez en el puerto 8080 por defecto). El navegador solo sabe hacer peticiones `GET`, así que para el resto necesitas otra herramienta.

### Opción 1: Postman

Si tienes Postman, crea una petición, elige el verbo en el desplegable y escribe la URL. Para `POST` y `PUT`, ve a **Body → raw → JSON** y escribe el JSON. Postman te enseña el código de estado y las cabeceras de cada respuesta, así que es la mejor opción para comprobar que devuelves `201`, `204` o `404` donde toca.

### Opción 2: PowerShell

PowerShell trae `Invoke-RestMethod`, que manda la petición y convierte la respuesta JSON en un objeto:

```powershell
# Crear dos tareas
Invoke-RestMethod -Method Post -Uri http://localhost:8080/tareas -ContentType 'application/json' -Body '{"titulo": "Aprender REST"}'
Invoke-RestMethod -Method Post -Uri http://localhost:8080/tareas -ContentType 'application/json' -Body '{"titulo": "Hacer los ejercicios"}'

# Listarlas
Invoke-RestMethod http://localhost:8080/tareas

# Consultar una
Invoke-RestMethod http://localhost:8080/tareas/1

# Marcar la 1 como completada (PUT manda la tarea entera)
Invoke-RestMethod -Method Put -Uri http://localhost:8080/tareas/1 -ContentType 'application/json' -Body '{"titulo": "Aprender REST", "completada": true}'

# Borrar la 2
Invoke-RestMethod -Method Delete -Uri http://localhost:8080/tareas/2
```

Si pides algo que no existe, como `Invoke-RestMethod http://localhost:8080/tareas/99`, PowerShell mostrará un error con el `404`. Es justo lo que queremos.

:::caution
Las tareas se guardan en memoria, así que **se pierden cada vez que reinicias la aplicación**. Es normal: lo arreglaremos cuando conectemos una base de datos.
:::

## 8. Qué pasa por dentro en un POST

```
Cliente ──POST /tareas──────────────▶ Tomcat
         Content-Type: application/json
         {"titulo": "Aprender REST"}
                                        │
                                        ▼
                      Spring busca quién atiende POST /tareas
                      → TareaController.crear()
                                        │
                      Jackson convierte el JSON en NuevaTarea("Aprender REST")
                                        │
                                        ▼
                      crear() asigna id, guarda y devuelve ResponseEntity
                                        │
                      Jackson convierte la Tarea en JSON
                                        │
Cliente ◀──201 Created──────────────────┘
           Location: /tareas/1
           {"id":1,"titulo":"Aprender REST","completada":false}
```

Fíjate en la cabecera **`Content-Type: application/json`** de la petición. Es lo que le dice a Spring que el cuerpo es JSON y que debe usar Jackson para leerlo. Si falta, Spring no sabe cómo interpretar el cuerpo.

## 9. Errores comunes

| Síntoma | Causa y solución |
|---|---|
| **415** Unsupported Media Type | Falta la cabecera `Content-Type: application/json`. En PowerShell, añade `-ContentType 'application/json'`; en Postman, elige JSON en el cuerpo. |
| **400** Bad Request al crear | El JSON está mal escrito: falta una comilla, sobra una coma... Revísalo con cuidado. |
| **400** al pedir `/tareas/abc` | `abc` no se puede convertir a `Long`. Spring lo rechaza antes de llegar a tu método. |
| **405** Method Not Allowed | La URL existe, pero no para ese verbo. Por ejemplo, `DELETE /tareas` sin id. |
| Error `Name for argument of type [java.lang.Long] not specified` | El compilador no ha guardado el nombre del parámetro. Escríbelo explícitamente: `@PathVariable("id") Long id`. Suele pasar al compilar desde algunos IDEs sin la configuración de Maven. |
| Las tareas desaparecen | Has reiniciado la aplicación. Se guardan en memoria. |

## Resumen

- En REST, las **URLs identifican recursos** (sustantivos en plural) y el **verbo HTTP** indica la acción.
- **GET** lee, **POST** crea, **PUT** sustituye y **DELETE** borra. Todos menos POST son **idempotentes**.
- Los **códigos de estado** dicen cómo ha ido la petición: `200`, `201`, `204`, `400`, `404`...
- **`@PathVariable`** lee datos de la URL, **`@RequestParam`** lee parámetros tras la `?` y **`@RequestBody`** convierte el JSON del cuerpo en un objeto.
- **`ResponseEntity`** te deja elegir el código de estado, las cabeceras y el cuerpo.
- Los **DTO** separan lo que entra por la API de lo que guardas.
- Un controlador es un bean **compartido entre todas las peticiones**, así que su estado debe ser seguro ante la concurrencia.

## Ejercicios

1. **Completar una tarea.** Añade `PATCH /tareas/{id}/completar`, que marque la tarea como completada sin tener que mandar el título. Debe devolver `200` con la tarea actualizada, o `404` si no existe.
2. **Filtrar.** Haz que `GET /tareas?completada=true` devuelva solo las completadas y `?completada=false` solo las pendientes. Sin el parámetro, debe devolver todas. Pista: `@RequestParam(required = false) Boolean completada`. Fíjate en que es `Boolean` y no `boolean`: ¿por qué?
3. **Experimenta.** Crea una tarea mandando `{}` como cuerpo, sin título. ¿Qué pasa? ¿Qué crees que debería pasar? Lo arreglaremos en la lección 4.
4. **Idempotencia.** Manda el mismo `POST` tres veces y después el mismo `PUT` tres veces. Lista las tareas después de cada serie y explica con tus palabras la diferencia.

Cuando termines, guarda tu trabajo:

```bash
git add .
git commit -m "Lección 2: tareas-api"
git push
```
