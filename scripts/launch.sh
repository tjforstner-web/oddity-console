#!/usr/bin/env bash
# Flip Oddity Console between draft mode and live mode.
#
# Usage:
#   scripts/launch.sh          # hide draft notices, drop body.draft-on, remove noindex, allow crawlers
#   scripts/launch.sh revert   # restore draft notices, draft-on, noindex, and robots Disallow
#
# This script only edits local files. It does not deploy, push, or sign in to anything.
# Do not run live mode until the user approves publishing.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE="$ROOT/site"
MODE="${1:-live}"

if [[ "$MODE" != "live" && "$MODE" != "revert" ]]; then
  echo "Usage: scripts/launch.sh [live|revert]" >&2
  exit 2
fi

python3 - "$SITE" "$MODE" << 'PY'
import sys
from pathlib import Path

site = Path(sys.argv[1])
mode = sys.argv[2]

css_path = site / "css" / "styles.css"
robots_path = site / "robots.txt"

RULE_DRAFT = "/* .draft-notice { display: none !important; } */"
RULE_LIVE = ".draft-notice { display: none !important; }"

NOINDEX = '<meta name="robots" content="noindex, nofollow">'
BODY_DRAFT = '<body class="draft-on">'
BODY_LIVE = "<body>"

ROBOTS_DRAFT = """# This is a private draft. Remove or change this file before a public launch.
User-agent: *
Disallow: /
"""
ROBOTS_LIVE = """# Public site. Draft notices and noindex have been turned off by scripts/launch.sh.
User-agent: *
Allow: /
"""

css = css_path.read_text()
if mode == "live":
    if RULE_DRAFT in css:
        css = css.replace(RULE_DRAFT, RULE_LIVE, 1)
    elif RULE_LIVE not in css:
        sys.exit("Could not find the .draft-notice switch in css/styles.css")
    css_path.write_text(css)
    robots_path.write_text(ROBOTS_LIVE)
    for path in sorted(site.glob("*.html")):
        text = path.read_text()
        text = text.replace(BODY_DRAFT, BODY_LIVE)
        # Remove the noindex meta and the blank line it leaves.
        lines = [ln for ln in text.splitlines(keepends=True) if NOINDEX not in ln]
        path.write_text("".join(lines))
    print("Live mode: draft notices hidden, body.draft-on removed, noindex removed, robots.txt allows crawlers.")
else:
    if RULE_LIVE in css and RULE_DRAFT not in css:
        css = css.replace(RULE_LIVE, RULE_DRAFT, 1)
    elif RULE_DRAFT not in css:
        sys.exit("Could not find the .draft-notice switch in css/styles.css")
    css_path.write_text(css)
    robots_path.write_text(ROBOTS_DRAFT)
    for path in sorted(site.glob("*.html")):
        text = path.read_text()
        text = text.replace(BODY_DRAFT, BODY_LIVE)  # normalize first
        text = text.replace(BODY_LIVE, BODY_DRAFT, 1)
        if NOINDEX not in text:
            # Insert noindex after the first charset/viewport-adjacent robots slot: after <meta charset or after first viewport.
            needle = '<meta name="viewport" content="width=device-width, initial-scale=1">'
            if needle in text:
                text = text.replace(
                    needle,
                    needle + "\n  " + NOINDEX,
                    1,
                )
            else:
                sys.exit(f"Could not reinsert noindex in {path.name}")
        path.write_text(text)
    print("Draft mode restored: draft notices on, body.draft-on set, noindex restored, robots.txt disallows crawlers.")
PY
