#!/usr/bin/env node
/*
 * Screenshot every project in src/content/work/ and save the PNGs next to
 * the markdown files, where the entries' `screenshot:` fields point.
 *
 * Run it by hand when a site changes, look at the results, and commit them.
 * It is deliberately not part of the build: builds should not depend on
 * client sites being up.
 *
 *   npm run screenshots                      # every project, desktop + mobile
 *   npm run screenshots -- ronnie-bookbinder # just one (or several) by slug
 *   npm run screenshots -- --no-mobile       # skip the phone-sized captures
 *
 * Output per project:
 *   <slug>.png         1440×900, the card and case-study image
 *   <slug>-mobile.png  390×844 at 2× pixel density, shown on the case study
 *
 * First run needs a browser: npx playwright install chromium
 */

import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const WORK_DIR = new URL('../src/content/work/', import.meta.url).pathname;

const VIEWPORTS = {
	desktop: { width: 1440, height: 900, deviceScaleFactor: 1, suffix: '' },
	mobile: { width: 390, height: 844, deviceScaleFactor: 2, suffix: '-mobile', isMobile: true },
};

// --- arguments -------------------------------------------------------------
const args = process.argv.slice(2);
const skipMobile = args.includes('--no-mobile');
const onlySlugs = args.filter((a) => !a.startsWith('--'));

// Cookie-consent banners to hide before capturing. Add a selector here if a
// screenshot comes back with a banner over it. astro-dev-toolbar is the pill
// an Astro dev server adds, for when screenshot_url points at localhost.
const HIDE = ['#onetrust-consent-sdk', '#CybotCookiebotDialog', '.cc-window', 'astro-dev-toolbar'];

// --- read the work collection ---------------------------------------------
// Only the URL lines are needed, so a regex over the frontmatter is enough
// and saves pulling in a YAML parser. `screenshot_url:`, if present, wins
// over `url:` (e.g. to open a page in a more representative state).
async function readProjects() {
	const files = (await readdir(WORK_DIR)).filter((f) => f.endsWith('.md'));
	const projects = [];
	for (const file of files) {
		const slug = file.replace(/\.md$/, '');
		if (onlySlugs.length && !onlySlugs.includes(slug)) continue;
		const text = await readFile(join(WORK_DIR, file), 'utf8');
		const field = (name) => text.match(new RegExp(`^${name}:\\s*['"]?([^'"\\s]+)`, 'm'))?.[1];
		if (/^screenshot_manual:\s*true\b/m.test(text)) {
			console.warn(`skip ${slug}: screenshot_manual is set`);
			continue;
		}
		const url = field('screenshot_url') ?? field('url');
		if (!url) {
			console.warn(`skip ${slug}: no url in frontmatter`);
			continue;
		}
		projects.push({ slug, url });
	}
	return projects;
}

// --- capture ---------------------------------------------------------------
async function capture(browser, { slug, url }, view) {
	const { suffix, ...viewport } = view;
	const context = await browser.newContext({
		viewport: { width: viewport.width, height: viewport.height },
		deviceScaleFactor: viewport.deviceScaleFactor,
		isMobile: viewport.isMobile ?? false,
		hasTouch: viewport.isMobile ?? false,
		// Light mode and no motion, so captures don't depend on the machine
		// or catch a page halfway through an entrance animation.
		colorScheme: 'light',
		reducedMotion: 'reduce',
	});
	const page = await context.newPage();
	try {
		await page.goto(url, { waitUntil: 'load', timeout: 45_000 });
		// Give the network a moment to go quiet, but don't fail if it never
		// does: big commercial pages (Backblaze) keep polling analytics forever.
		await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
		await page.addStyleTag({ content: `${HIDE.join(', ')} { display: none !important; }` });
		await page.evaluate(() => document.fonts.ready);
		// A short settle for lazy images and anything that ignores reduced motion.
		await page.waitForTimeout(1500);
		const out = join(WORK_DIR, `${slug}${suffix}.png`);
		await page.screenshot({ path: out });
		console.log(`ok   ${slug}${suffix}.png  ← ${url}`);
	} catch (err) {
		console.error(`FAIL ${slug}${suffix}: ${err.message.split('\n')[0]}`);
		process.exitCode = 1;
	} finally {
		await context.close();
	}
}

const projects = await readProjects();
if (!projects.length) {
	console.error('No matching projects in src/content/work/.');
	process.exit(1);
}

const views = skipMobile ? [VIEWPORTS.desktop] : [VIEWPORTS.desktop, VIEWPORTS.mobile];
const browser = await chromium.launch();
for (const project of projects) {
	for (const view of views) await capture(browser, project, view);
}
await browser.close();
