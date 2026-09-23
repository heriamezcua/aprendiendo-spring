---
title: "Lección 1: Qué es Spring y tu primer endpoint"
description: Qué problema resuelve Spring, qué añade Spring Boot y cómo crear y arrancar tu primera API.
sidebar:
  order: 1
  label: "1. Hola, Spring"
---

**Objetivo:** al terminar esta lección sabrás qué es Spring, qué es Spring Boot, cómo se crea un proyecto y tendrás una API funcionando que responde en tu navegador.

**Proyecto:** `lecciones/01-hola-spring`

## Antes de empezar

Necesitas tres cosas instaladas:

- **JDK 25** (o como mínimo 21). Comprueba tu versión con `java -version`.
- **Un IDE.** Recomiendo IntelliJ IDEA; la versión Community es gratuita y suficiente.
- **Git**, para guardar cada lección en el repositorio.

No necesitas instalar Maven: el proyecto trae su propio Maven (`mvnw`), como verás más abajo.

## 1. ¿Qué problema resuelve Spring?

Imagina que construyes un backend en Java puro. Además de tu lógica de negocio, tendrías que resolver tú mismo muchas cosas que se repiten en todos los proyectos:

- Levantar un servidor web y convertir peticiones HTTP en llamadas a tus métodos.
- Convertir objetos Java a JSON y al revés.
- Crear todos tus objetos y conectarlos entre sí (el servicio necesita el repositorio, el controlador necesita el servicio...).
- Conectarte a una base de datos, gestionar transacciones, seguridad, configuración...

**Spring es un framework que resuelve todo eso** para que tú te centres en la lógica de tu aplicación.

### Librería frente a framework

Esta diferencia es clave para entender Spring:

- Con una **librería**, *tú* llamas a su código cuando lo necesitas. Por ejemplo, llamas a `Math.sqrt()`.
- Con un **framework**, *el framework* llama a tu código. Tú escribes un método, lo marcas con una anotación y Spring decide cuándo ejecutarlo; por ejemplo, cuando llega una petición a `/hola`.

A esta idea se le llama **inversión de control** (IoC): el control del programa lo tiene el framework, no tú. La verás muchas veces a lo largo del curso.

## 2. Spring frente a Spring Boot

Son dos cosas relacionadas pero distintas:

- **Spring (Spring Framework)** es el núcleo: el contenedor que crea y conecta tus objetos, el soporte web, el acceso a datos... Es muy potente, pero históricamente había que configurarlo todo a mano.
- **Spring Boot** se construye encima de Spring y te da todo preconfigurado con valores razonables.

Una analogía: Spring es una caja enorme de piezas de LEGO. Spring Boot es el mismo LEGO, pero con la base ya montada y unas instrucciones que funcionan, y aun así puedes cambiar cualquier pieza.

Spring Boot aporta, sobre todo, cuatro cosas:

| Qué aporta | Qué significa |
|---|---|
| **Starters** | Paquetes de dependencias. Añades uno para "web" y te trae todo lo necesario en versiones compatibles entre sí. |
| **Autoconfiguración** | Boot mira qué dependencias tienes y configura automáticamente lo que necesitan. |
| **Servidor embebido** | El servidor web (Tomcat) va dentro de tu aplicación. No hay que instalar nada aparte. |
| **JAR ejecutable** | Tu aplicación entera es un único archivo que arrancas con `java -jar`. |

:::note
Hoy en día prácticamente todos los proyectos nuevos usan Spring Boot. Cuando alguien dice "trabajo con Spring", casi siempre se refiere a Spring Boot.
:::

## 3. Crear el proyecto

Los proyectos de Spring Boot se generan con **Spring Initializr**. Entra en [start.spring.io](https://start.spring.io) y rellena:

| Campo | Valor |
|---|---|
| Project | Maven |
| Language | Java |
| Spring Boot | La última versión estable (la que no pone SNAPSHOT ni M) |
| Group | `es.heriamezcua` |
| Artifact | `hola-spring` |
| Packaging | Jar |
| Java | 25 (o 21) |

En **Dependencies** añade solo una: **Spring Web**.

Pulsa **Generate**, descomprime el ZIP y mueve su contenido a la carpeta `lecciones/01-hola-spring` del repositorio. Después abre esa carpeta en IntelliJ.

:::tip
IntelliJ también puede crear proyectos Spring directamente (*New Project → Spring Boot*), pero por dentro usa Initializr igualmente. Usar la web al principio te ayuda a ver qué estás eligiendo.
:::

## 4. Qué se ha generado

```
01-hola-spring/
├── mvnw, mvnw.cmd                  ← Maven incluido en el proyecto
├── pom.xml                         ← dependencias y configuración de compilación
└── src/
    ├── main/
    │   ├── java/es/heriamezcua/holaspring/
    │   │   └── HolaSpringApplication.java   ← punto de entrada
    │   └── resources/
    │       └── application.properties       ← configuración de la app
    └── test/
        └── java/es/heriamezcua/holaspring/
            └── HolaSpringApplicationTests.java
```

Veamos las piezas importantes una a una.

### `pom.xml`

Es el archivo de Maven. Fíjate en dos partes:

- El **`<parent>`** es `spring-boot-starter-parent`. Fija las versiones de cientos de librerías para que sean compatibles entre sí. Por eso tus dependencias no llevan número de versión.
- En **`<dependencies>`** verás el starter web: `spring-boot-starter-webmvc`.

:::caution
Desde Spring Boot 4, el starter web se llama `spring-boot-starter-webmvc`. En tutoriales antiguos lo verás como `spring-boot-starter-web`. No es un error tuyo: es un cambio de nombre.
:::

### `mvnw` (Maven Wrapper)

Es un pequeño script que descarga la versión exacta de Maven que necesita el proyecto. Así cualquiera puede compilarlo sin instalar Maven, y todos usan la misma versión.

### `HolaSpringApplication.java`

```java
package es.heriamezcua.holaspring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HolaSpringApplication {

    public static void main(String[] args) {
        SpringApplication.run(HolaSpringApplication.class, args);
    }
}
```

Es un `main` normal de Java. Toda la magia está en dos sitios:

- **`@SpringBootApplication`** activa tres cosas a la vez: marca la clase como configuración, activa la autoconfiguración y, muy importante, le dice a Spring que **busque tus clases en este paquete y en sus subpaquetes**.
- **`SpringApplication.run(...)`** arranca Spring: crea el contenedor, busca tus clases, lo configura todo y arranca el servidor web.

### `application.properties`

Aquí va la configuración de tu aplicación: el puerto, la base de datos, etc. De momento solo contiene el nombre de la aplicación.

## 5. Tu primer endpoint

Un **endpoint** es una URL de tu API que responde a peticiones. Crea esta clase en el mismo paquete que `HolaSpringApplication`:

```java
package es.heriamezcua.holaspring;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HolaController {

    @GetMapping("/hola")
    public String hola() {
        return "¡Hola, Spring!";
    }
}
```

Solo hay dos anotaciones:

- **`@RestController`** le dice a Spring: "esta clase recibe peticiones HTTP y lo que devuelvan sus métodos es la respuesta".
- **`@GetMapping("/hola")`** conecta este método con las peticiones `GET` a la URL `/hola`.

Fíjate en que nunca haces `new HolaController()`. **Spring lo crea por ti** al arrancar, porque lo encuentra gracias a la anotación. Es la inversión de control en acción.

## 6. Arrancar la aplicación

Desde la terminal, dentro de `lecciones/01-hola-spring`:

```bash
./mvnw spring-boot:run
```

En Windows usa `mvnw.cmd spring-boot:run`. También puedes pulsar el botón ▶ junto al `main` en IntelliJ.

La primera vez tarda porque descarga dependencias. Cuando veas una línea parecida a esta, está lista:

```
Tomcat started on port 8080 (http) with context path '/'
Started HolaSpringApplication in 1.2 seconds
```

Abre [http://localhost:8080/hola](http://localhost:8080/hola) en el navegador, o usa la terminal:

```bash
curl http://localhost:8080/hola
```

Verás `¡Hola, Spring!`. Enhorabuena, tienes tu primera API funcionando.

## 7. Qué ha pasado por dentro

Esto es lo que ha ocurrido cuando has arrancado la aplicación:

1. Se ejecuta tu `main` y llama a `SpringApplication.run`.
2. Spring crea su **contenedor**, el objeto que va a crear y guardar todos los objetos de tu aplicación.
3. Recorre tu paquete buscando clases con anotaciones como `@RestController`. Encuentra `HolaController`, crea una instancia y la guarda en el contenedor.
4. La autoconfiguración ve que tienes el starter web y **arranca un Tomcat** en el puerto 8080.
5. Registra que las peticiones `GET /hola` deben ir a tu método `hola()`.

Y esto es lo que pasa en cada petición:

```
Navegador ──GET /hola──▶ Tomcat ──▶ Spring busca quién atiende /hola
                                          │
                                          ▼
                                HolaController.hola()
                                          │
Navegador ◀──"¡Hola, Spring!"──────────────┘
```

A los objetos que Spring crea y gestiona en su contenedor se les llama **beans**. `HolaController` es tu primer bean. En próximas lecciones veremos esto a fondo.

## 8. Devolver JSON

Las APIs reales no devuelven texto plano, devuelven **JSON**. Spring lo hace automáticamente: si devuelves un objeto, lo convierte a JSON.

Crea un `record` (una clase de datos inmutable de Java moderno):

```java
package es.heriamezcua.holaspring;

import java.time.LocalDateTime;

public record Saludo(String mensaje, LocalDateTime fecha) {
}
```

Y añade este método a `HolaController`:

```java
@GetMapping("/saludo")
public Saludo saludo(@RequestParam(defaultValue = "mundo") String nombre) {
    return new Saludo("Hola, " + nombre, LocalDateTime.now());
}
```

Añade los imports de `RequestParam` y `LocalDateTime`, reinicia la aplicación y prueba:

```bash
curl "http://localhost:8080/saludo?nombre=Heri"
```

```json
{"mensaje":"Hola, Heri","fecha":"2026-09-23T18:30:12.345678"}
```

Dos cosas nuevas:

- **`@RequestParam`** lee un parámetro de la URL (lo que va después de `?`). Con `defaultValue`, si no lo envías, usa `"mundo"`.
- La conversión a JSON la hace **Jackson**, una librería que viene incluida en el starter web. No has tenido que configurar nada: es la autoconfiguración otra vez.

## 9. El test que viene de regalo

Abre `HolaSpringApplicationTests.java`:

```java
@SpringBootTest
class HolaSpringApplicationTests {

    @Test
    void contextLoads() {
    }
}
```

Parece que no hace nada, pero comprueba algo importante: que **la aplicación arranca sin errores**. `@SpringBootTest` levanta Spring completo; si algo está mal configurado, el test falla. Ejecútalo con `./mvnw test`.

## 10. Errores comunes

| Síntoma | Causa y solución |
|---|---|
| `Port 8080 was already in use` | Ya tienes otra aplicación (o esta misma) arrancada. Párala, o cambia el puerto (ejercicio 1). |
| La URL devuelve **404** | Tu controlador está en un paquete **fuera** de `es.heriamezcua.holaspring`, y Spring no lo encuentra. Muévelo dentro. |
| Errores de versión de Java al compilar | Tu JDK es más antiguo que el que elegiste en Initializr. Comprueba `java -version`. |
| Los cambios no se aplican | Tienes que reiniciar la aplicación después de cada cambio. Más adelante veremos cómo evitarlo. |

## Resumen

- **Spring** es un framework: tú escribes el código y Spring decide cuándo llamarlo (inversión de control).
- **Spring Boot** configura Spring por ti con starters, autoconfiguración y un servidor embebido.
- **`@SpringBootApplication`** arranca todo y busca tus clases en su paquete y subpaquetes.
- **`@RestController`** + **`@GetMapping`** crean un endpoint.
- Si devuelves un objeto, Spring lo convierte a **JSON** automáticamente.
- Los objetos que Spring crea y gestiona se llaman **beans**.

## Ejercicios

1. **Cambia el puerto.** Haz que la aplicación arranque en el puerto `8081` añadiendo una línea a `application.properties`. Busca en la documentación de Spring Boot qué propiedad es.
2. **Tira un dado.** Crea un endpoint `GET /dado` que devuelva un número aleatorio del 1 al 6 en JSON, así: `{"resultado": 4}`.
3. **Experimenta.** Quita `@RestController` de `HolaController`, reinicia y llama a `/hola`. ¿Qué pasa? ¿Por qué?
4. **Opcional.** Añade a `/saludo` un parámetro `idioma` que acepte `es` o `en` y cambie el mensaje. Si no se envía, usa español.

Cuando termines, guarda tu trabajo:

```bash
git add .
git commit -m "Lección 1: hola-spring"
git push
```
