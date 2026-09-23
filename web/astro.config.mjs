// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
	site: 'https://spring.heriamezcua.es',
	integrations: [
		starlight({
			title: 'Aprendiendo Spring',
			description: 'Curso práctico de Spring Boot, desde cero hasta nivel profesional, construyendo proyectos reales.',
			locales: {
				root: { label: 'Español', lang: 'es' },
			},
			social: [
				// Cambia la URL por la de tu repositorio
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/TU_USUARIO/aprendiendo-spring' },
			],
			customCss: ['./src/styles/custom.css'],
			lastUpdated: true,
			sidebar: [
				{ label: 'Inicio', link: '/' },
				{
					label: 'Lecciones',
					items: [{ autogenerate: { directory: 'lecciones' } }],
				},
			],
		}),
	],
});
