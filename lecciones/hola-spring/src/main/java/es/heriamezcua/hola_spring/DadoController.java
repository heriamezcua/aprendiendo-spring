package es.heriamezcua.hola_spring;

import java.util.concurrent.ThreadLocalRandom;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DadoController {

	@GetMapping("/dado")
	public Tirada tirar() {
		// nextInt(origen, límite): el límite es exclusivo, por eso 7 para obtener de 1 a 6
		return new Tirada(ThreadLocalRandom.current().nextInt(1, 7));
	}

}
