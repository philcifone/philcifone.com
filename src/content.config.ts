import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One markdown file per project in src/content/work/<slug>.md.
// The filename (minus .md) becomes the entry id and the /work/<slug> URL.
//
// The markdown body is the case study. Leave it empty and the project still
// appears on the contact sheet, just without a /work/<slug> page.
const work = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/work' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			url: z.url(),
			// Text for the outbound link. Change it when `url` isn't the project's own site.
			url_label: z.string().default('Live site'),
			// Public source repository, if there is one.
			source: z.url().optional(),
			// Only read by scripts/screenshot.mjs: capture this instead of `url`.
			screenshot_url: z.url().optional(),
			// Set when `screenshot` isn't a capture of `url` (made by hand); scripts/screenshot.mjs skips it.
			screenshot_manual: z.boolean().default(false),
			client_type: z.string(),
			// A string, not a number, so ranges like "2023–present" work.
			year: z.string(),
			stack: z.array(z.string()).default([]),
			featured: z.boolean().default(false),
			summary: z.string(),
			// Written by scripts/screenshot.mjs: 1440×900 desktop, 390×844 mobile.
			screenshot: image(),
			screenshot_mobile: image().optional(),
			// Defaults to "Screenshot of the <hostname> home page" (see lib/work.ts).
			screenshot_alt: z.string().optional(),
			// The frame number on the contact sheet (01, 02, …). Keep them unique.
			order: z.number(),
		}),
});

// One markdown file per write-up in src/content/notes/<slug>.md.
// /notes is an index that links out: the posts themselves stay on
// negativeearth.net and tech.philcifone.com, so there is no body to write.
const notes = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/notes' }),
	schema: z.object({
		// A short, plain title for the index. It can differ from the post's own.
		title: z.string(),
		// The canonical post.
		url: z.url(),
		// When the post was published (or, for docs, last updated). Newest first.
		date: z.coerce.date(),
		// One or two sentences: what happened, and what it shows.
		summary: z.string(),
	}),
});

export const collections = { work, notes };
