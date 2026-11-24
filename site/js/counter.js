/* DoublePenny fictional story counter.
 * Single config: DBLPENNY_DAY1_DATE (calendar date of Day 1 in America/Toronto).
 * Amount for Day N = $0.01 × 2^(N − 1). Caps at Day 30.
 * This number is a story device, not the token's price.
 */
(function (root) {
  "use strict";

  var DBLPENNY_DAY1_DATE = "2026-11-18";
  var START_CENTS = 1;
  var MAX_DAY = 30;
  var TIME_ZONE = "America/Toronto";

  function dateInZone(date, timeZone) {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  }

  function daysBetweenYMD(start, end) {
    var s = start.split("-").map(Number);
    var e = end.split("-").map(Number);
    var a = Date.UTC(s[0], s[1] - 1, s[2]);
    var b = Date.UTC(e[0], e[1] - 1, e[2]);
    return Math.round((b - a) / 86400000);
  }

  function formatUSDFromCents(cents) {
    return "$" + (cents / 100).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function getState(now) {
    var today = dateInZone(now || new Date(), TIME_ZONE);
    var day = daysBetweenYMD(DBLPENNY_DAY1_DATE, today) + 1;
    if (day < 1) {
      return { status: "not-started", day: day };
    }
    if (day > MAX_DAY) {
      return { status: "complete", day: day, maxDay: MAX_DAY };
    }
    var cents = START_CENTS * Math.pow(2, day - 1);
    return {
      status: "active",
      day: day,
      maxDay: MAX_DAY,
      cents: cents,
      amount: formatUSDFromCents(cents)
    };
  }

  function render(el, state) {
    var dayHtml;
    var amountHtml;
    if (state.status === "not-started") {
      dayHtml = "The 30-day story starts November 18, 2026 (ET).";
      amountHtml = "";
      el.classList.remove("is-complete");
    } else if (state.status === "complete") {
      dayHtml = "Story complete";
      amountHtml = "Future chapters are undecided.";
      el.classList.add("is-complete");
    } else {
      dayHtml = "Day " + state.day + " of " + state.maxDay;
      amountHtml = state.amount;
      el.classList.remove("is-complete");
    }
    var parts = '<p class="story-counter-day">' + dayHtml + "</p>";
    if (amountHtml) {
      parts += '<p class="story-counter-amount">' + amountHtml + "</p>";
    }
    parts += '<p class="story-counter-note">This is a fictional story counter, not the token’s price.</p>';
    el.innerHTML = parts;
  }

  var api = {
    DBLPENNY_DAY1_DATE: DBLPENNY_DAY1_DATE,
    START_CENTS: START_CENTS,
    MAX_DAY: MAX_DAY,
    TIME_ZONE: TIME_ZONE,
    getState: getState,
    formatUSDFromCents: formatUSDFromCents
  };

  root.DBLPENNY_COUNTER = api;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof document !== "undefined") {
    document.querySelectorAll("[data-dblpenny-counter]").forEach(function (el) {
      render(el, getState(new Date()));
    });
  }
})(typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : this);
