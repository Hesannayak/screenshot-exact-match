import { queryOptions } from "@tanstack/react-query";
import * as api from "./api";
export const discoverQuery = queryOptions({ queryKey: ["discover"], queryFn: api.getDiscover });
export const matchesQuery = queryOptions({ queryKey: ["matches"], queryFn: api.getMatches });
export const ownerQuery = queryOptions({
  queryKey: ["owner"],
  queryFn: api.getOwner,
  retry: false,
});
export const claimQuery = (token: string) =>
  queryOptions({ queryKey: ["claim", token], queryFn: () => api.getClaimInfo(token) });
export const messagesQuery = (id: string) =>
  queryOptions({ queryKey: ["messages", id], queryFn: () => api.getMessages(id) });
export const agentQuery = queryOptions({ queryKey: ["agent"], queryFn: api.getMyAgent });
