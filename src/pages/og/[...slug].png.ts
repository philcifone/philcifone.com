// Builds the Open Graph images listed in src/lib/og.ts, plus one per case
// study, as static PNGs at /og/<slug>.png.
//
// satori lays out a small tree of divs (flexbox only) and turns the text into
// SVG paths, so no fonts need to be installed; sharp then rasterizes the SVG.
// Same palette as the light theme, same film rebate as the contact sheet.
import type { APIRoute, GetStaticPaths } from 'astro';
import { readFile } from 'node:fs/promises';
import satori from 'satori';
import sharp from 'sharp';
import { ogPages } from '../../lib/og';
import { type WorkEntry, frameNumber, getWork, hasCaseStudy } from '../../lib/work';

const WIDTH = 1200;
const HEIGHT = 630;

// Light-theme tokens from src/styles/tokens.css.
const c = {
	paper: '#fbf8f1',
	ink: '#282828',
	muted: '#5a524c',
	rule: '#d5c4a1',
	film: '#1d2021',
	filmInk: '#d5c4a1',
	filmAccent: '#b8bb26',
};

// satori reads woff (not woff2). Paths are relative to the project root,
// where `astro build` runs.
const font = (file: string) => readFile(`node_modules/@fontsource/${file}`);
const fonts = [
	{ name: 'Young Serif', data: await font('young-serif/files/young-serif-latin-400-normal.woff'), weight: 400 },
	{ name: 'Courier Prime', data: await font('courier-prime/files/courier-prime-latin-400-normal.woff'), weight: 400 },
] as const;

type Props = { title: string; subtitle: string; entry?: WorkEntry };

export const getStaticPaths = (async () => {
	const pages = Object.entries(ogPages).map(([slug, page]) => ({
		params: { slug },
		props: page,
	}));
	const studies = (await getWork()).filter(hasCaseStudy).map((entry) => ({
		params: { slug: `work/${entry.id}` },
		props: { title: entry.data.title, subtitle: entry.data.client_type, entry },
	}));
	return [...pages, ...studies];
}) satisfies GetStaticPaths;

export const GET: APIRoute<Props> = async ({ props }) => {
	const svg = await satori(await card(props), { width: WIDTH, height: HEIGHT, fonts: [...fonts] });
	const png = await sharp(Buffer.from(svg)).png().toBuffer();
	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};

// A tiny hyperscript helper so the layout below reads like markup.
// satori wants display:flex on any div with more than one child.
type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string)[]): Node => ({
	type,
	props: { style: { display: 'flex', ...style }, children },
});

// Small caps-ish monospace label, like the section labels on the site.
const label = (text: string, color = c.muted) =>
	h('div', { fontFamily: 'Courier Prime', fontSize: 22, letterSpacing: 2, color }, text);

// The edge-print caption: "03 — RONNIE BOOKBINDER — 2023–PRESENT".
const edge = (frame: string, text: string) =>
	h(
		'div',
		{ fontFamily: 'Courier Prime', fontSize: 20, letterSpacing: 3, color: c.filmInk, padding: '10px 0' },
		h('span', { color: c.filmAccent, marginRight: 12 }, frame),
		`— ${text.toUpperCase()}`,
	);

async function card({ title, subtitle, entry }: Props) {
	const text = h(
		'div',
		// minWidth 0 lets the text column shrink and wrap instead of pushing the frame off the card.
		{ flexDirection: 'column', flex: 1, minWidth: 0, gap: 24 },
		label('PHILCIFONE.COM'),
		h('div', { fontFamily: 'Young Serif', fontSize: entry ? 64 : 76, lineHeight: 1.1, color: c.ink }, title),
		h('div', { fontFamily: 'Young Serif', fontSize: 30, lineHeight: 1.4, color: c.muted }, subtitle),
	);

	// Pages: the text, with a full-width edge strip along the bottom.
	if (!entry) {
		return h(
			'div',
			{ width: WIDTH, height: HEIGHT, flexDirection: 'column', background: c.paper },
			h('div', { flex: 1, padding: '72px 72px 0' }, text),
			h(
				'div',
				{ background: c.film, padding: '8px 72px' },
				edge('PC', 'Phil Cifone — photographer & digital archivist'),
			),
		);
	}

	// Case studies: the text beside the screenshot in its film rebate.
	// Padding goes on an inner box: on the root it's added outside the 1200px.
	return h(
		'div',
		{ width: WIDTH, height: HEIGHT, background: c.paper },
		h(
			'div',
			{ flex: 1, padding: 72, gap: 56, alignItems: 'center' },
			text,
			h(
				'div',
				{ flexDirection: 'column', flexShrink: 0, background: c.film, border: `1px solid ${c.rule}`, padding: '14px 14px 0' },
				{ type: 'img', props: { src: await screenshot(entry), width: 520, height: 325, style: { width: 520, height: 325 } } },
				edge(frameNumber(entry), entry.data.year),
			),
		),
	);
}

// The desktop capture, cropped to 16:10 from the top and inlined as a data URI.
async function screenshot(entry: WorkEntry) {
	const jpeg = await sharp(sourcePath(entry))
		.resize(1040, 650, { fit: 'cover', position: 'top' })
		.jpeg({ quality: 80 })
		.toBuffer();
	return `data:image/jpeg;base64,${jpeg.toString('base64')}`;
}

// Astro hands us the image's metadata, not its bytes. In a build its original
// path is on `fsPath`; fall back to the screenshot-script naming convention.
function sourcePath(entry: WorkEntry) {
	const meta = entry.data.screenshot as { fsPath?: string };
	return meta.fsPath ?? `src/content/work/${entry.id}.png`;
}
