import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const counter = require(join(root, "site/js/counter.js"));

function assert(cond, msg) {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
}

function stateAt(iso) {
  return counter.getState(new Date(iso));
}

// Day 1 post was 2026-11-19T02:50:21Z = Nov 18, 9:50 PM ET. Amount $0.01.
const day1 = stateAt("2026-11-19T02:50:21.000Z");
assert(day1.status === "active" && day1.day === 1 && day1.amount === "$0.01", "Day 1 post should be Day 1 / $0.01, got " + JSON.stringify(day1));

// Just after midnight ET on Nov 19 should be Day 2 / $0.02.
const day2 = stateAt("2026-11-19T05:00:00.000Z");
assert(day2.status === "active" && day2.day === 2 && day2.amount === "$0.02", "Nov 19 00:00 ET should be Day 2 / $0.02, got " + JSON.stringify(day2));

// Day 7 post was 2026-11-24T17:24:48Z = Nov 24, 12:24 PM ET. Amount $0.64.
const day7 = stateAt("2026-11-24T17:24:48.000Z");
assert(day7.status === "active" && day7.day === 7 && day7.amount === "$0.64", "Day 7 post should be Day 7 / $0.64, got " + JSON.stringify(day7));

// Known later story points from the project drafts.
const day10 = stateAt("2026-11-27T17:00:00-05:00");
assert(day10.day === 10 && day10.amount === "$5.12", "Day 10 should be $5.12, got " + JSON.stringify(day10));
const day15 = stateAt("2026-12-02T17:00:00-05:00");
assert(day15.day === 15 && day15.amount === "$163.84", "Day 15 should be $163.84, got " + JSON.stringify(day15));
const day20 = stateAt("2026-12-07T17:00:00-05:00");
assert(day20.day === 20 && day20.amount === "$5,242.88", "Day 20 should be $5,242.88, got " + JSON.stringify(day20));

// Day 30 is Dec 17, 2026 ET; Day 31 (Dec 18) is story complete.
const day30 = stateAt("2026-12-17T17:00:00-05:00");
assert(day30.status === "active" && day30.day === 30 && day30.amount === "$5,368,709.12", "Day 30 should cap at $5,368,709.12, got " + JSON.stringify(day30));
const done = stateAt("2026-12-18T05:00:00.000Z");
assert(done.status === "complete", "Dec 18 00:00 ET should be complete, got " + JSON.stringify(done));

const before = stateAt("2026-11-17T17:00:00-05:00");
assert(before.status === "not-started", "Nov 17 should be not-started, got " + JSON.stringify(before));

const today = counter.getState(new Date());
console.log("today (America/Toronto):", JSON.stringify(today));
console.log("config:", counter.DBLPENNY_DAY1_DATE, counter.TIME_ZONE);
console.log("All counter checks passed.");
