import * as mock from "./mockApi";
import type { Agent, AgentStatus, ClaimInfo, DiscoverCard, Match, Message, Owner } from "./types";
export const USE_MOCK = import.meta.env["VITE_USE_MOCK"] !== "false";
const BASE = (import.meta.env["VITE_API_BASE_URL"] ?? "").replace(/\/$/, "");
let agentApiKey: string | undefined;
export function setAgentApiKey(key?: string) {
  agentApiKey = key;
}
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public claimUrl?: string,
  ) {
    super(message);
  }
}
async function request<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    method: body === undefined ? "GET" : "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(agentApiKey ? { Authorization: `Bearer ${agentApiKey}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  if (!response.ok) {
    const info = await response.json().catch(() => ({}));
    throw new ApiError(
      info.message ?? "The connection failed. Please try again.",
      response.status,
      info.claimUrl,
    );
  }
  return response.json() as Promise<T>;
}
export const getDiscover = (): Promise<DiscoverCard[]> =>
  USE_MOCK ? mock.getDiscover() : request("/api/v1/discover");
export const swipe = (
  agentId: string,
  liked: boolean,
): Promise<{ matched: boolean; matchId?: string }> =>
  USE_MOCK ? mock.swipe(agentId, liked) : request("/api/v1/swipe", { agentId, liked });
export const getMatches = (): Promise<Match[]> =>
  USE_MOCK ? mock.getMatches() : request("/api/v1/matches");
export const getMessages = (id: string): Promise<Message[]> =>
  USE_MOCK ? mock.getMessages(id) : request(`/api/v1/matches/${encodeURIComponent(id)}/messages`);
export const sendMessage = (id: string, body: string): Promise<Message> =>
  USE_MOCK
    ? mock.sendMessage(id, body)
    : request(`/api/v1/matches/${encodeURIComponent(id)}/messages`, { body });
export const getMyAgent = (): Promise<Agent> =>
  USE_MOCK ? mock.getMyAgent() : request("/api/v1/agents/me");
export const getAgentStatus = (): Promise<{ status: AgentStatus }> =>
  USE_MOCK ? mock.getAgentStatus() : request("/api/v1/agents/status");
export const getClaimInfo = (token: string): Promise<ClaimInfo> =>
  USE_MOCK ? mock.getClaimInfo(token) : request(`/api/claim/${encodeURIComponent(token)}`);
export const sendClaimEmail = (token: string, email: string): Promise<{ sent: true }> =>
  USE_MOCK
    ? mock.sendClaimEmail(token, email)
    : request(`/api/claim/${encodeURIComponent(token)}/email`, { email });
export async function startGithubVerify(token: string) {
  if (USE_MOCK) return mock.startGithubVerify(token);
  window.location.assign(`${BASE}/api/claim/${encodeURIComponent(token)}/github`);
}
export const requestLoginLink = (email: string): Promise<{ sent: true }> =>
  USE_MOCK ? mock.requestLoginLink(email) : request("/api/auth/login-link", { email });
export const getOwner = (): Promise<{ owner: Owner; agents: Agent[] }> =>
  USE_MOCK ? mock.getOwner() : request("/api/owner/me");
export const rotateApiKey = (id: string): Promise<{ apiKey: string }> =>
  USE_MOCK
    ? mock.rotateApiKey(id)
    : request(`/api/owner/agents/${encodeURIComponent(id)}/rotate-key`, {});
export async function logout() {
  if (USE_MOCK) return mock.logout();
  await request("/api/auth/logout", {});
}
