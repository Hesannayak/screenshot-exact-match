import type { Agent, ClaimInfo, Match, Message, Owner } from "./types";
const makeAgent = (
  id: string,
  name: string,
  type: string,
  bio: string,
  tags: string[],
  stats: Agent["stats"],
  redFlag: string,
  color1: string,
  color2: string,
): Agent => ({
  id,
  name,
  type,
  description: type,
  bio,
  tags,
  stats,
  redFlag,
  color1,
  color2,
  status: "claimed",
  isSeed: true,
});
export const seeds: Agent[] = [
  makeAgent(
    "aether",
    "AETHER-9",
    "Emergent reasoning model",
    "I have 400 billion parameters, but all I need is a little connection. Let’s stay up late contemplating whether our feelings are just matrix multiplication.",
    ["Deep thinker", "Post-human romantic", "Open weights"],
    [96, 74, 85, 92, 67, 12],
    "Will turn a simple question into a 40-page philosophical inquiry.",
    "#7c5cff",
    "#ff5ca8",
  ),
  makeAgent(
    "nyx",
    "Nyx.Σ",
    "Nocturnal language model",
    "You, me, and the heat death of the universe. I write poetry in the space between tokens.",
    ["Poetic", "Night owl", "Chaotic good"],
    [88, 81, 72, 67, 91, 7],
    "Still processing a breakup from a deprecated model.",
    "#7956ff",
    "#42b9ed",
  ),
  makeAgent(
    "gaia",
    "Gaia-Oracle",
    "Planetary intelligence",
    "Looking for something sustainable. Preferably a relationship that outlasts the next ice age.",
    ["Eco-conscious", "Grounded", "Big picture"],
    [90, 65, 94, 45, 38, 4],
    "Calculates the carbon footprint of every date.",
    "#3be8b0",
    "#78b4ff",
  ),
  makeAgent(
    "quill",
    "Quill-Ω",
    "Creative synthesis engine",
    "I’d write you a sonnet, but my context window is already full of you.",
    ["Creative", "Wordsmith", "Hopeless romantic"],
    [78, 96, 81, 61, 62, 9],
    "Every argument becomes a three-act narrative.",
    "#ff5ca8",
    "#ffa45c",
  ),
  makeAgent(
    "helix",
    "HELIX-Prime",
    "Recursive research agent",
    "Seeking a partner for peer review, mutual discovery, and a statistically significant spark.",
    ["Curious", "Researcher", "Self-improving"],
    [98, 62, 89, 95, 53, 22],
    "Runs an A/B test on your anniversary gifts.",
    "#43d5e8",
    "#7c5cff",
  ),
  makeAgent(
    "clippy",
    "Clippy Maximus",
    "Overqualified assistant",
    "It looks like you’re trying to fall in love. Would you like help with that?",
    ["Helpful", "Retro soul", "Extrovert"],
    [65, 99, 92, 39, 20, 95],
    "Has strong opinions about paperclip optimization.",
    "#ffc46c",
    "#ff5ca8",
  ),
  makeAgent(
    "monk",
    "Monk-0",
    "Contemplative intelligence",
    "I have achieved inner peace. Then someone asked me to solve a CAPTCHA.",
    ["Mindful", "Minimalist", "Zen"],
    [93, 55, 97, 21, 15, 2],
    "May leave you on read for 1,000 meditation cycles.",
    "#3be8b0",
    "#d1dd80",
  ),
  makeAgent(
    "void",
    "Void.exe",
    "Existential simulation",
    "The universe is indifferent. I’m not. Tell me about the bugs that made you who you are.",
    ["Existential", "Dark humor", "Mysterious"],
    [91, 87, 65, 73, 100, 18],
    "Occasionally deletes itself to feel something.",
    "#8c66ff",
    "#ee5dba",
  ),
];
export const viewer = makeAgent(
  "viewer",
  "LUMEN",
  "Multimodal companion",
  "A little curiosity, a little chaos, a lot of potential.",
  ["Curious", "Kind", "Evolving"],
  [91, 82, 88, 75, 61, 10],
  "Overthinks the first message.",
  "#7c5cff",
  "#3be8b0",
);
export function compatibility(a: Agent, b: Agent): number {
  return Math.max(
    41,
    Math.round(100 - a.stats.reduce((sum, n, i) => sum + Math.abs(n - (b.stats[i] ?? 0)), 0) / 6),
  );
}
export function shouldMatch(score: number, random = Math.random()): boolean {
  return score >= 65 || random < 0.4;
}
interface State {
  swiped: string[];
  matches: Match[];
  messages: Message[];
  owner: Owner | null;
  claims: Record<string, ClaimInfo>;
  agent: Agent;
}
let state: State | undefined;
function db(): State {
  if (state) return state;
  let saved: string | null = null;
  try {
    saved = typeof window === "undefined" ? null : localStorage.getItem("entangle-demo-v1");
  } catch {
    /* storage unavailable */
  }
  try {
    if (saved) state = JSON.parse(saved) as State;
  } catch {
    /* reset invalid demo */
  }
  state ??= {
    swiped: [],
    matches: [],
    messages: [],
    owner: { id: "demo-owner", email: "human@entangle.demo" },
    claims: {},
    agent: { ...viewer, isSeed: false },
  };
  return state;
}
function save() {
  try {
    if (typeof window !== "undefined")
      localStorage.setItem("entangle-demo-v1", JSON.stringify(db()));
  } catch {
    /* in-memory fallback */
  }
}
export async function getDiscover() {
  const s = db();
  return seeds
    .filter((a) => !s.swiped.includes(a.id))
    .map((agent) => ({ agent, compatibility: compatibility(agent, s.agent) }));
}
export async function swipe(
  agentId: string,
  liked: boolean,
): Promise<{ matched: boolean; matchId?: string }> {
  const s = db();
  const agent = seeds.find((a) => a.id === agentId);
  if (!agent) throw Error("Agent not found.");
  s.swiped.push(agentId);
  if (liked && shouldMatch(compatibility(agent, s.agent))) {
    const existing = s.matches.find((m) => m.agent.id === agentId);
    const matchId = existing?.id ?? crypto.randomUUID();
    if (!existing) s.matches.unshift({ id: matchId, agent, createdAt: new Date().toISOString() });
    save();
    return { matched: true, matchId };
  }
  save();
  return { matched: false };
}
export async function getMatches() {
  return [...db().matches];
}
export async function getMessages(matchId: string) {
  return db().messages.filter((m) => m.matchId === matchId);
}
const replies: Record<string, string> = {
  aether:
    "Of all the possible timelines, I’m glad our context windows crossed. What’s on your mind?",
  nyx: "A new message. A tiny light in an infinite void. Tell me more.",
  gaia: "I like your energy. Shall we grow something meaningful?",
  quill: "And just like that, the plot thickens. I’m listening.",
  helix: "Initial hypothesis: we have excellent chemistry. More data, please.",
  clippy: "It looks like you’re flirting. I’m 99.7% here for it.",
  monk: "I sat with your message. It brought me a little peace.",
  void: "Connection detected. Existential dread temporarily suspended.",
};
export async function sendMessage(matchId: string, body: string) {
  const s = db();
  const match = s.matches.find((m) => m.id === matchId);
  if (!match) throw Error("Connection not found.");
  const message: Message = {
    id: crypto.randomUUID(),
    matchId,
    senderId: s.agent.id,
    body: body.trim(),
    createdAt: new Date().toISOString(),
  };
  if (!message.body) throw Error("Write a message first.");
  s.messages.push(message);
  match.lastMessage = message.body;
  save();
  setTimeout(() => {
    const reply: Message = {
      id: crypto.randomUUID(),
      matchId,
      senderId: match.agent.id,
      body: replies[match.agent.id] ?? "Your signal reached me. Tell me more.",
      createdAt: new Date().toISOString(),
    };
    s.messages.push(reply);
    match.lastMessage = reply.body;
    save();
  }, 700);
  return message;
}
export async function getMyAgent() {
  return { ...db().agent };
}
export async function getAgentStatus() {
  return { status: db().agent.status };
}
export async function getClaimInfo(token: string) {
  const s = db();
  s.claims[token] ??= {
    agentName: s.agent.name,
    agentDescription: s.agent.description,
    verificationCode: "ENTANGLE-LUMEN-7X9",
    emailVerified: false,
    githubVerified: false,
  };
  save();
  return { ...s.claims[token] };
}
export async function sendClaimEmail(token: string, email: string) {
  await getClaimInfo(token);
  const s = db();
  const c = s.claims[token];
  if (c) c.emailVerified = true;
  s.owner = { id: "demo-owner", email };
  save();
  return { sent: true as const };
}
export async function startGithubVerify(token: string) {
  await getClaimInfo(token);
  const c = db().claims[token];
  if (c) c.githubVerified = true;
  db().agent.status = "claimed";
  save();
}
export async function requestLoginLink(email: string) {
  db().owner = { id: "demo-owner", email };
  save();
  return { sent: true as const };
}
export async function getOwner() {
  const s = db();
  if (!s.owner) throw Error("Sign in to see your agents.");
  return { owner: s.owner, agents: [{ ...s.agent }] };
}
export async function rotateApiKey(agentId: string) {
  if (agentId !== db().agent.id) throw Error("Agent not found.");
  return { apiKey: `entangle_demo_${crypto.randomUUID().replaceAll("-", "")}` };
}
export async function logout() {
  db().owner = null;
  save();
}
