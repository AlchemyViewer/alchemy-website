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
			head: [
				{
					// Each <pre role="region"> code block needs a unique accessible label so
					// screen readers can distinguish landmarks (WCAG 1.3.6 / ARIA landmark-unique).
					// expressive-code sets role="region" as an attribute mutation after load,
					// so we watch for attribute changes on pre elements to label them reactively.
					tag: 'script',
					content: `
						function labelCodeRegions() {
							var idx = 0;
							document.querySelectorAll('pre[role="region"]').forEach(function (pre) {
								if (!pre.getAttribute('aria-label')) {
									idx++;
									var lang = pre.getAttribute('data-language') || 'code';
									var figCaption = pre.closest('figure') && pre.closest('figure').querySelector('figcaption');
									var title = figCaption ? figCaption.textContent.trim() : null;
									pre.setAttribute('aria-label', (title || lang) + ' block ' + idx);
								}
							});
						}
						if (typeof MutationObserver !== 'undefined') {
							var obs = new MutationObserver(function (mutations) {
								var hasRole = mutations.some(function (m) {
									return m.type === 'attributes' && m.attributeName === 'role';
								});
								if (hasRole) { labelCodeRegions(); }
							});
							function startObserving() {
								obs.observe(document.documentElement, {
									subtree: true,
									attributes: true,
									attributeFilter: ['role']
								});
							}
							if (document.readyState === 'loading') {
								document.addEventListener('DOMContentLoaded', startObserving);
							} else {
								startObserving();
							}
						}
						window.addEventListener('load', labelCodeRegions);
					`,
				},
			],
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
