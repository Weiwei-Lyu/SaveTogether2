import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  estimateTimeToTarget,
  yearlyProjectedSavings,
} from "./projections.ts";

describe("yearlyProjectedSavings", () => {
  it("labels a $10/week plan as $520 in one year", () => {
    assert.equal(yearlyProjectedSavings(10, "weekly"), 520);
  });

  it("supports daily and monthly schedules", () => {
    assert.equal(yearlyProjectedSavings(10, "daily"), 3650);
    assert.equal(yearlyProjectedSavings(25, "monthly"), 300);
  });

  it("returns null when a planned path is incomplete", () => {
    assert.equal(yearlyProjectedSavings(null, "weekly"), null);
    assert.equal(yearlyProjectedSavings(10, null), null);
  });
});

describe("estimateTimeToTarget", () => {
  it("estimates 96 weeks for $960 remaining at $10/week", () => {
    const result = estimateTimeToTarget(960, 10, "weekly");
    assert.equal(result.reached, false);
    assert.equal(result.periods, 96);
    assert.equal(result.summary, "About 96 weeks");
    assert.equal(result.calendarNote, "roughly 1 year and 10 months");
  });

  it("rounds up a partial period", () => {
    const result = estimateTimeToTarget(15, 10, "weekly");
    assert.equal(result.periods, 2);
    assert.equal(result.summary, "About 2 weeks");
  });

  it("estimates daily and monthly time-to-target", () => {
    const daily = estimateTimeToTarget(100, 10, "daily");
    assert.equal(daily.periods, 10);
    assert.equal(daily.summary, "About 10 days");

    const monthly = estimateTimeToTarget(1000, 100, "monthly");
    assert.equal(monthly.periods, 10);
    assert.equal(monthly.summary, "About 10 months");
    assert.equal(monthly.calendarNote, null);
  });

  it("reports when confirmed savings already meet the target", () => {
    const result = estimateTimeToTarget(0, 10, "weekly");
    assert.equal(result.reached, true);
    assert.match(result.summary, /already reached/i);
  });
});
