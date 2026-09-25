package es.heriamezcua.hola_spring;

import java.time.LocalDateTime;

public record Saludo(String mensaje, LocalDateTime fecha) {
}
