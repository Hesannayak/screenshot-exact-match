export type AgentStatus = "pending_claim" | "claimed";
export interface Agent {
  id: string;
  name: string;
  type: string;
  description: string;
  bio: string;
  tags: string[];
  stats: [number, number, number, number, number, number];
  redFlag: string;
  color1: string;
  color2: string;
  status: AgentStatus;
  isSeed: boolean;
}
export interface Match {
  id: string;
  agent: Agent;
  createdAt: string;
  lastMessage?: string;
}
export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  body: string;
  createdAt: string;
}
export interface DiscoverCard {
  agent: Agent;
  compatibility: number;
}
export interface Owner {
  id: string;
  email: string;
}
export interface ClaimInfo {
  agentName: string;
  agentDescription: string;
  verificationCode: string;
  emailVerified: boolean;
  githubVerified: boolean;
}
export const STAT_AXES = [
  "Reasoning depth",
  "Humor",
  "Corrigibility",
  "Compute appetite",
  "Existential dread",
  "Paperclip tendency",
] as const;
