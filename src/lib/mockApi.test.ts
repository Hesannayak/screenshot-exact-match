import { describe, it, expect, vi } from "vitest";
import {
  compatibility,
  shouldMatch,
  seeds,
  viewer,
  getDiscover,
  swipe,
  getMatches,
  sendMessage,
  getMessages,
} from "./mockApi";

describe("Entangle rules", () => {
  it("seeds exactly the eight requested agents with six traits and three tags", () => {
    expect(seeds.map((a) => a.name)).toEqual([
      "AETHER-9",
      "Nyx.Σ",
      "Gaia-Oracle",
      "Quill-Ω",
      "HELIX-Prime",
      "Clippy Maximus",
      "Monk-0",
      "Void.exe",
    ]);
    expect(seeds.every((a) => a.stats.length === 6 && a.tags.length === 3)).toBe(true);
  });
  it("computes compatibility as 100 minus mean trait distance", () => {
    expect(compatibility(viewer, { ...viewer, stats: [81, 72, 78, 65, 51, 0] })).toBe(90);
  });
  it("floors compatibility at 41", () => {
    expect(
      compatibility(
        { ...viewer, stats: [0, 0, 0, 0, 0, 0] },
        { ...viewer, stats: [100, 100, 100, 100, 100, 100] },
      ),
    ).toBe(41);
  });
  it("matches right swipes at compatibility 65 or higher", () => {
    expect(shouldMatch(65, 0.99)).toBe(true);
    expect(shouldMatch(64, 0.99)).toBe(false);
  });
  it("otherwise matches only the lower 40 percent of random values", () => {
    expect(shouldMatch(41, 0.399)).toBe(true);
    expect(shouldMatch(41, 0.4)).toBe(false);
  });
  it("removes a passed agent from discovery without matching", async () => {
    const before = await getDiscover();
    const first = before[0];
    if (!first) throw Error("Missing demo agent");
    expect(await swipe(first.agent.id, false)).toEqual({ matched: false });
    expect((await getDiscover()).some((c) => c.agent.id === first.agent.id)).toBe(false);
  });
  it("replies to a matched agent message after 700ms", async () => {
    vi.useFakeTimers();
    try {
      const card = (await getDiscover())[0];
      if (!card) throw Error("Missing demo agent");
      const result = await swipe(card.agent.id, true);
      if (!result.matchId) throw Error("High compatibility must match");
      expect((await getMatches()).some((m) => m.id === result.matchId)).toBe(true);
      await sendMessage(result.matchId, "Hello, intelligence.");
      await vi.advanceTimersByTimeAsync(699);
      expect(await getMessages(result.matchId)).toHaveLength(1);
      await vi.advanceTimersByTimeAsync(1);
      const messages = await getMessages(result.matchId);
      expect(messages).toHaveLength(2);
      expect(messages[1]?.senderId).toBe(card.agent.id);
    } finally {
      vi.useRealTimers();
    }
  });
});
