import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Match } from "@/lib/types";
import { Orb } from "./Orb";
export function MatchList({ matches }: { matches: Match[] }) {
  return (
    <div>
      {matches.map((match) => (
        <Link key={match.id} to="/matches/$id" params={{ id: match.id }} className="match-row">
          <Orb agent={match.agent} size="md" />
          <div className="flex-1 min-w-0">
            <h2>{match.agent.name}</h2>
            <p>{match.lastMessage || "A new connection. An unwritten story."}</p>
          </div>
          <ArrowUpRight size={15} className="text-muted-foreground" />
        </Link>
      ))}
    </div>
  );
}
