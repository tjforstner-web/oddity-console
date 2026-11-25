# Oddity Console (draft)

A static first draft of **Oddity Console**, the dashboard and transparency hub for **Compile Oddity**.

**Compile Oddity** is the parent project (“Different by design.”). **Oddity Console** is the dashboard and transparency hub for Compile Oddity (“Three identities. Two accounts. One evolving story.”). The three identities are StillComp (The Process), DoublePenny (The Growth), and CHOMP (The Watchdog).

The project folder lives at `/workspace/project/oddity-console-site/`. The public site files are in `site/`. A symlink at `/workspace/project/compile-hq-site` points at this project folder so older paths still work. This is a private draft on the shared computer. **Do not publish, deploy, or post it until the user approves.**

Every page currently includes `<meta name="robots" content="noindex, nofollow">`, and `site/robots.txt` disallows all crawlers. Draft notices are on. Use `scripts/launch.sh` when you are actually ready to go live — do not run it yet.

Planned hosting, once accounts are connected and the user approves: a **private GitHub repository** for the code, and **Netlify** (free tier) for hosting. This folder is prepared for that. No remote has been added, and nothing has been pushed or deployed.

## Folder layout

| Path | Purpose |
|---|---|
| `site/` | Publish directory (the only files Netlify should serve) |
| `site/index.html` | Home: static three-column hero, identity cards, live story counter, transparency link |
| `site/projects.html` | StillComp, DoublePenny, CHOMP |
| `site/gallery.html` | The Oddity Gallery: original mascots, oddity variants, and shared-universe scenes |
| `site/story.html` | How the identities connect |
| `site/updates.html` | Dated public posts and on-chain events |
| `site/disclosure.html` | Risk wording, disclosure, and the Transparency section |
| `site/faq.html` | Common questions |
| `site/404.html` | Custom not-found page (wired in `netlify.toml`) |
| `site/css/`, `site/js/`, `site/fonts/`, `site/images/` | Styles, JS, self-hosted fonts, hero stills, CHOMP art, icons |
| `site/robots.txt` | Currently disallows all crawlers |
| `scripts/launch.sh` | Flip to live mode, or `scripts/launch.sh revert` to restore the draft |
| `scripts/test-counter.mjs` | Checks the story-counter formula against the Day 1 and Day 7 posts |
| `netlify.toml` | Publish dir `site`, no build command, 404, security and cache headers |
| `archive/hero-source.mp4` | Original hero clip (not used on the site, not in the publish dir) |
| `screenshots/` | Desktop and mobile captures (not in the publish dir) |
| `README.md` | This file (not in the publish dir) |

CHOMP art is copied from `/workspace/chomp/` (token v2, background removed). The StillComp CRT still is cropped from the archived source clip. The DoublePenny still is a single coin stack and plaque from that clip, without a growth arrow or rising chart.

## DoublePenny story counter

The day and amount are computed in the browser from one config value in `site/js/counter.js`:

```js
var DBLPENNY_DAY1_DATE = "2026-11-18";
```

That is the calendar date of Day 1 in **America/Toronto** (ET). The formula is:

**amount = $0.01 × 2^(day − 1)**

Day is 1 plus the number of ET calendar days since 2026-11-18. The counter caps at **Day 30** (2026-12-17 ET, $5,368,709.12). After that it shows “Story complete / Future chapters are undecided” and does not keep doubling.

This is a fictional story counter, not the token’s price. That wording sits next to the number. Pages that show the counter also include a `<noscript>` fallback so the date, the disclaimer, and a prompt to enable JavaScript still appear if scripts are off.

The formula was checked against public @DBLPENNY posts:

- Day 1 post (Nov 18, 2026, 9:50 PM ET): “Day 1 of 30. One penny — $0.01.”
- Day 7 post (Nov 24, 2026, 12:24 PM ET): “DAY 7… $0.64.” ($0.01 × 2^6 = $0.64)

Because the math runs in the browser, the displayed day can change at midnight ET without a new deploy.

To change the start date later, edit only `DBLPENNY_DAY1_DATE` and keep the `YYYY-MM-DD` form. Run `node scripts/test-counter.mjs` to re-check the known data points.

Dated Update entries (for example the Day 7 post itself) stay as historical records and are not live counters.

## Draft notices and the launch switch

Every page currently shows a draft banner and a draft sentence in the footer (both use the class `draft-notice`). The notices are **on**. The CSS switch in `site/css/styles.css` is still commented:

```css
/* .draft-notice { display: none !important; } */
```

When the user approves a public launch, run this from the project folder (not yet):

```bash
scripts/launch.sh
```

That script:

1. Uncomments the `.draft-notice { display: none !important; }` rule so the banner and footer sentence are hidden.
2. Removes `body.draft-on` from every page.
3. Removes the `noindex, nofollow` meta tag from every page.
4. Changes `site/robots.txt` so crawlers are allowed.

To put the draft markings back:

```bash
scripts/launch.sh revert
```

The script only edits local files. It does not deploy, push, or sign in to anything.

## Preview

From the **`site/`** folder:

```bash
cd site
python3 -m http.server 8080 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8080/>.

No build step. Plain HTML, CSS, and a little JavaScript.

## Placeholders the user must fill

There are no remaining fill-in placeholders on the site.

Wallets are shown only in truncated form, never in full: `DBRs5LZJ…` is the creator of $DBLPENNY; `9ZwDsyEB…` is the creator of $CHOMP and the creator’s trading wallet (it buys and sells $DBLPENNY and $CHOMP). The user confirmed both are theirs.

$STILLCOMP is not launched, so its contract is marked “Not launched, no contract,” its creator wallet is marked “Not launched, no wallet yet,” its trading wallet is marked “Not applicable,” and its initial purchase is marked “Not launched. No purchase.” Those are facts, not placeholders.

The two public mints are already filled in:

- $DBLPENNY: `ERnmvq4trQicjf7w8bBEWBbthBJwubFP5gShfAcepump`
- $CHOMP: `6mTjRgytN55oxrE67MyYXDd7oeNBbgpGFP6Z8QP9pump`

## Hero

The Home hero is a static three-column still: the StillComp CRT, a neutral single-stack $DBLPENNY plaque (no arrow and no rising chart), and official CHOMP art. The live story counter sits under the DoublePenny still and again on the $DBLPENNY identity card.

The original 6-second clip is archived at `archive/hero-source.mp4` and is **not** used on the site. It could not be cleaned up cleanly: a growth arrow and label move across a large, changing part of the frame, the $DBLPENNY footer tile has a rising-chart icon, and the baked-in footer line does not match the official tagline. Covering those areas with boxes would have hidden the coins or the CRT. A checked source frame is in `screenshots/hero-source-frame-checked.jpg`.

The official hub line on the hero is **Three identities. Two accounts. One evolving story.** The site footer is **// PROCESS. BUILD. COMPILE. REPEAT. //**

## Copy rules (do not relax)

In all site copy, including alt text and meta tags, follow the project copy limits in `/workspace/project/README.md` and `DECISIONS.md`. Do not promise price or returns. Do not promise that any token will never be rugged. CHOMP may call rugging stealing, but must not vouch for any token.

Never print the user’s full wallet address. Use only a short prefix such as `9ZwDsyEB…` or `DBRs5LZJ…`. The two public token mints may be shown in full:

- $DBLPENNY: `ERnmvq4trQicjf7w8bBEWBbthBJwubFP5gShfAcepump`
- $CHOMP: `6mTjRgytN55oxrE67MyYXDd7oeNBbgpGFP6Z8QP9pump`

$STILLCOMP is not launched; no contract exists.

## Git and Netlify (after approval only)

Do not deploy this draft as-is: draft notices are still on, and the pages are marked `noindex`.

The intended setup is a **private GitHub repo** for the code and **Netlify** for hosting, connected later. This project has a local git history only — no remote. Never upload wallet private keys or recovery phrases to either platform.

`netlify.toml` is already set up:

- Publish directory: `site` (screenshots, the archived hero clip, scripts, and this README stay out of the deploy)
- No build command
- Unknown paths serve `404.html` with a 404 status
- Security headers (frame denial, nosniff, referrer policy, a same-origin CSP) and short cache on HTML so copy changes show up quickly. The story counter updates in the browser, so it does not need a daily deploy.

When the user approves a public version: connect GitHub and Netlify, run `scripts/launch.sh`, commit that live-mode change, then deploy. Use `scripts/launch.sh revert` if you need the draft markings back first. A custom domain can be connected later, once it is purchased.

## Screenshots

Desktop and mobile captures live in `screenshots/`, outside the publish directory.
