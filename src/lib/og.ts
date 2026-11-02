// Open Graph (link preview) images: the picture a link shows when it's pasted
// into Slack, iMessage, Mastodon, etc. They are rendered at build time by
// src/pages/og/[...slug].png.ts, one 1200×630 PNG per page.
//
// Case studies get theirs automatically. Every other page needs a line here;
// a page without one falls back to the home page's image.
export const ogPages: Record<string, { title: string; subtitle: string }> = {
	index: {
		title: 'Photographer & digital archivist.',
		subtitle:
			'Archives, storage and websites that keep the work of artists and small cultural organizations alive.',
	},
	work: {
		title: 'Work',
		subtitle: 'Websites and archive projects, each one fast, static and owned outright.',
	},
	notes: {
		title: 'Notes',
		subtitle: 'Write-ups from my own systems: storage, backups and what went wrong with them.',
	},
	about: {
		title: 'About',
		subtitle: 'Photographer and digital archivist.',
	},
	contact: {
		title: 'Contact',
		subtitle: 'phil@philcifone.com',
	},
};

// "/" → "index", "/work/" → "work", "/work/ronnie-bookbinder/" → "work/ronnie-bookbinder".
export const ogSlug = (pathname: string) => pathname.replace(/^\/+|\/+$/g, '') || 'index';

export const ogImagePath = (slug: string) => `/og/${slug}.png`;
