// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://www.alchemyviewer.org',
	integrations: [
		starlight({
			title: 'Alchemy Viewer',
			logo: {
				src: './src/assets/alchemy_logo.webp',
				alt: 'Alchemy Viewer Logo',
			},
			customCss: ['./src/styles/custom.css'],
			components: {
				TableOfContents: './src/components/BlogAwareTOC.astro',
			},
			social: [
				{ icon: 'discord', label: 'Discord', href: 'https://discordapp.com/invite/KugCgs6' },
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/AlchemyViewer/Alchemy' },
			],
			sidebar: [
					{ label: 'Home', slug: 'index' },
				{
					label: 'Install',
					items: [
						{ label: 'Get Alchemy', slug: 'downloads' },
						{
							label: 'Build & Setup',
								items: [{ autogenerate: { directory: 'manual' } }],
						},
					],
				},
				{
					label: 'Learn',
					items: [
						{ label: 'About', slug: 'about' },
						{
							label: 'FAQ',
								items: [{ autogenerate: { directory: 'faq' } }],
						},
						{
							label: 'Knowledge Base',
								items: [{ autogenerate: { directory: 'knowledge-base' } }],
						},
					],
				},
				{
					label: 'Blog',
					items: [{ label: 'All Posts', slug: 'blog' }],
				},
				{ label: 'Privacy Policy', slug: 'privacy-policy' },
			],
		}),
	],
});
