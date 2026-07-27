import { describe, it, expect } from "vitest";

// Re-derive the state machine from InboxAgentDemo to test transition logic.

type Phase =
  | "state1"
  | "sam-arriving"
  | "sam-unread"
  | "to-sam"
  | "state2"
  | "to-cancel"
  | "loading"
  | "state4-canceled"
  | "state4-sent";

const TIMING = {
  STATE1_DWELL: 750,
  SAM_ARRIVAL: 350,
  SAM_UNREAD_DWELL: 600,
  CURSOR_TRAVEL_TO_SAM: 400,
  CLICK_PULSE: 100,
  STATE2_DWELL: 1500,
  CURSOR_TRAVEL_TO_CANCEL: 450,
  LOADING: 650,
  STATE4_CANCELED_DWELL: 700,
  STATE4_SENT_DWELL: 1500,
};

const transitions: Record<Phase, [Phase, number]> = {
  state1: ["sam-arriving", TIMING.STATE1_DWELL],
  "sam-arriving": ["sam-unread", TIMING.SAM_ARRIVAL],
  "sam-unread": ["to-sam", TIMING.SAM_UNREAD_DWELL],
  "to-sam": ["state2", TIMING.CURSOR_TRAVEL_TO_SAM + TIMING.CLICK_PULSE],
  state2: ["to-cancel", TIMING.STATE2_DWELL],
  "to-cancel": [
    "loading",
    TIMING.CURSOR_TRAVEL_TO_CANCEL + TIMING.CLICK_PULSE,
  ],
  loading: ["state4-canceled", TIMING.LOADING],
  "state4-canceled": ["state4-sent", TIMING.STATE4_CANCELED_DWELL],
  "state4-sent": ["state1", TIMING.STATE4_SENT_DWELL],
};

function nextPhase(current: Phase): Phase {
  return transitions[current][0];
}

function phaseDuration(current: Phase): number {
  return transitions[current][1];
}

describe("InboxAgentDemo state machine", () => {
  it("has exactly 9 states", () => {
    expect(Object.keys(transitions).length).toBe(9);
  });

  it("every state has a defined successor", () => {
    for (const phase of Object.keys(transitions) as Phase[]) {
      const [next] = transitions[phase];
      expect(next).toBeTruthy();
      expect(transitions).toHaveProperty(next);
    }
  });

  it("forms a cycle back to state1", () => {
    let current: Phase = "state1";
    const visited = new Set<Phase>();
    while (!visited.has(current)) {
      visited.add(current);
      current = nextPhase(current);
    }
    expect(current).toBe("state1");
    expect(visited.size).toBe(9);
  });

  it("all durations are positive", () => {
    for (const phase of Object.keys(transitions) as Phase[]) {
      expect(phaseDuration(phase)).toBeGreaterThan(0);
    }
  });

  it("total cycle duration is reasonable (< 10s)", () => {
    let total = 0;
    for (const phase of Object.keys(transitions) as Phase[]) {
      total += phaseDuration(phase);
    }
    expect(total).toBeLessThan(10000);
    expect(total).toBeGreaterThan(1000);
  });

  it("follows the expected sequence", () => {
    const expected: Phase[] = [
      "state1",
      "sam-arriving",
      "sam-unread",
      "to-sam",
      "state2",
      "to-cancel",
      "loading",
      "state4-canceled",
      "state4-sent",
    ];
    let current: Phase = "state1";
    for (let i = 0; i < expected.length; i++) {
      expect(current).toBe(expected[i]);
      current = nextPhase(current);
    }
    expect(current).toBe("state1");
  });
});

describe("InboxAgentDemo derived state flags", () => {
  function showsSam(phase: Phase): boolean {
    return phase !== "state1";
  }

  function samSelected(phase: Phase): boolean {
    return (
      phase === "state2" ||
      phase === "to-cancel" ||
      phase === "loading" ||
      phase === "state4-canceled" ||
      phase === "state4-sent"
    );
  }

  function samUnread(phase: Phase): boolean {
    return showsSam(phase) && !samSelected(phase);
  }

  it("Sam is not shown in state1", () => {
    expect(showsSam("state1")).toBe(false);
  });

  it("Sam is shown from sam-arriving onward", () => {
    const phasesWithSam: Phase[] = [
      "sam-arriving",
      "sam-unread",
      "to-sam",
      "state2",
      "to-cancel",
      "loading",
      "state4-canceled",
      "state4-sent",
    ];
    for (const p of phasesWithSam) {
      expect(showsSam(p)).toBe(true);
    }
  });

  it("Sam is selected only from state2 onward", () => {
    expect(samSelected("state1")).toBe(false);
    expect(samSelected("sam-arriving")).toBe(false);
    expect(samSelected("sam-unread")).toBe(false);
    expect(samSelected("to-sam")).toBe(false);
    expect(samSelected("state2")).toBe(true);
    expect(samSelected("state4-sent")).toBe(true);
  });

  it("Sam is unread only between sam-arriving and to-sam", () => {
    expect(samUnread("state1")).toBe(false);
    expect(samUnread("sam-arriving")).toBe(true);
    expect(samUnread("sam-unread")).toBe(true);
    expect(samUnread("to-sam")).toBe(true);
    expect(samUnread("state2")).toBe(false);
    expect(samUnread("state4-sent")).toBe(false);
  });
});
