// Progreso del curso. Es la única fuente de la barra de progreso y del mapa de habilidades de la web.
// Actualiza el estado de un bloque a la vez que en la base de datos «Lecciones» de Notion.

export type Estado = 'Pendiente' | 'En curso' | 'Ejercicios en revisión' | 'Completada';

export interface Bloque {
	numero: number;
	nombre: string;
	aprendes: string;
	proyecto: string;
	estado: Estado;
	/** Slug de la lección en la web (`lecciones/NN-nombre`), si ya está escrita. */
	leccion?: string;
	/** Lo que sabrás hacer al completar el bloque (nodos del mapa de habilidades). */
	habilidades: string[];
	/** Bloques que hay que dominar antes (flechas del mapa de habilidades). */
	requiere: number[];
}

export const bloques: Bloque[] = [
	{
		numero: 1, nombre: 'Primeros pasos', aprendes: 'Qué es Spring y Spring Boot, tu primer endpoint', proyecto: 'hola-spring',
		estado: 'Ejercicios en revisión', leccion: 'lecciones/01-hola-spring',
		habilidades: ['Spring Boot', 'Primer endpoint', 'Arrancar con Maven'], requiere: [],
	},
	{
		numero: 2, nombre: 'APIs REST', aprendes: 'GET, POST, PUT, DELETE, parámetros y JSON', proyecto: 'tareas-api',
		estado: 'En curso', leccion: 'lecciones/02-tareas-api',
		habilidades: ['Verbos HTTP', 'Códigos de estado', 'JSON', 'Parámetros'], requiere: [1],
	},
	{
		numero: 3, nombre: 'Organizar el código', aprendes: 'Controlador, servicio e inyección de dependencias', proyecto: 'tareas-api',
		estado: 'Pendiente',
		habilidades: ['Capas', 'Inyección de dependencias', 'Beans'], requiere: [2],
	},
	{
		numero: 4, nombre: 'Validación y errores', aprendes: 'Validar la entrada y devolver errores claros', proyecto: 'tareas-api',
		estado: 'Pendiente',
		habilidades: ['Bean Validation', 'Gestión global de errores'], requiere: [3],
	},
	{
		numero: 5, nombre: 'Base de datos', aprendes: 'JPA, H2 y PostgreSQL con Docker', proyecto: 'biblioteca-api',
		estado: 'Pendiente',
		habilidades: ['JPA', 'Repositorios', 'PostgreSQL', 'Docker'], requiere: [3],
	},
	{
		numero: 6, nombre: 'Tests', aprendes: 'Tests unitarios y de integración', proyecto: 'biblioteca-api',
		estado: 'Pendiente',
		habilidades: ['JUnit', 'Mockito', 'Tests de integración'], requiere: [5],
	},
	{
		numero: 7, nombre: 'Seguridad', aprendes: 'Usuarios, login y roles', proyecto: 'notas-api',
		estado: 'Pendiente',
		habilidades: ['Spring Security', 'Login', 'Roles'], requiere: [4, 5],
	},
	{
		numero: 8, nombre: 'Proyecto integrador', aprendes: 'Todo lo anterior junto', proyecto: 'Acortador de URLs',
		estado: 'Pendiente',
		habilidades: ['Diseñar una API', 'Proyecto de principio a fin'], requiere: [6, 7],
	},
	{
		numero: 9, nombre: 'Proyecto final', aprendes: 'Arquitectura, caché, eventos y despliegue', proyecto: 'Quotaly',
		estado: 'Pendiente',
		habilidades: ['Arquitectura', 'Caché', 'Eventos', 'Despliegue'], requiere: [8],
	},
];

// Cuánto de un bloque cuenta cada estado: avanzar dentro de un bloque también mueve la barra.
export const avancePorEstado: Record<Estado, number> = {
	Pendiente: 0,
	'En curso': 1 / 3,
	'Ejercicios en revisión': 2 / 3,
	Completada: 1,
};

export const porcentajeCurso = Math.round(
	(bloques.reduce((total, b) => total + avancePorEstado[b.estado], 0) / bloques.length) * 100,
);

export const bloquesCompletados = bloques.filter((b) => b.estado === 'Completada').length;

/** El primer bloque que no está completado: el siguiente hito. */
export const siguienteBloque = bloques.find((b) => b.estado !== 'Completada');

export function bloqueDeLeccion(id: string): Bloque | undefined {
	return bloques.find((b) => b.leccion === id);
}

// --- Mapa de habilidades ---

export type EstadoNodo = 'dominado' | 'en-marcha' | 'disponible' | 'bloqueado';

const porNumero = new Map(bloques.map((b) => [b.numero, b]));

export function estadoNodo(b: Bloque): EstadoNodo {
	if (b.estado === 'Completada') return 'dominado';
	if (b.estado !== 'Pendiente') return 'en-marcha';
	return b.requiere.every((n) => porNumero.get(n)?.estado === 'Completada') ? 'disponible' : 'bloqueado';
}

/** Fila del mapa: un bloque va siempre debajo de todos los que requiere. */
export function nivel(b: Bloque): number {
	return b.requiere.length === 0 ? 0 : 1 + Math.max(...b.requiere.map((n) => nivel(porNumero.get(n)!)));
}

export const habilidadesTotales = bloques.reduce((total, b) => total + b.habilidades.length, 0);

export const habilidadesDominadas = bloques
	.filter((b) => b.estado === 'Completada')
	.reduce((total, b) => total + b.habilidades.length, 0);
