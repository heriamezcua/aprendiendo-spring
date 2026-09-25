package es.heriamezcua.hola_spring;

import java.time.LocalDateTime;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HolaController {

	@GetMapping("/hola")
	public String hola() {
		return "Hola, Spring";
	}

	@GetMapping("/saludo")
	public Saludo saludo(@RequestParam(defaultValue = "mundo") String nombre,
			@RequestParam(defaultValue = "es") String idioma) {
		String prefijo = idioma.equalsIgnoreCase("en") ? "Hello, " : "Hola, ";
		return new Saludo(prefijo + nombre, LocalDateTime.now());
	}

}
