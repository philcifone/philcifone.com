// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static output is Astro's default. Redirects (dev.philcifone.com → /work/)
// live in the nginx config under deploy/, not here.
export default defineConfig({
	site: 'https://philcifone.com',
	integrations: [
		// sitemap-index.xml for search engines. The 404 page is left out.
		sitemap({ filter: (page) => !page.includes('/404') }),
	],
});
