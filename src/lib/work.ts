import { getCollection, type CollectionEntry } from 'astro:content';

export type WorkEntry = CollectionEntry<'work'>;

// All work entries in contact-sheet order (the `order` field, then title).
export async function getWork({ featuredOnly = false } = {}) {
	const entries = await getCollection('work', ({ data }) => !featuredOnly || data.featured);
	return entries.sort(
		(a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
	);
}

// A project gets its own /work/<slug> page only once its case study is written.
export const hasCaseStudy = (entry: WorkEntry) => Boolean(entry.body?.trim());

export const caseStudyHref = (entry: WorkEntry) => `/work/${entry.id}/`;

// "03", the number printed on the frame.
export const frameNumber = (entry: WorkEntry) => String(entry.data.order).padStart(2, '0');

// "ronniebookbinder.com", for captions and default alt text.
export const hostname = (url: string) => new URL(url).hostname.replace(/^www\./, '');

export function screenshotAlt(entry: WorkEntry, { mobile = false } = {}) {
	const alt =
		entry.data.screenshot_alt ?? `Screenshot of the ${hostname(entry.data.url)} home page`;
	return mobile ? `${alt}, on a phone` : alt;
}
