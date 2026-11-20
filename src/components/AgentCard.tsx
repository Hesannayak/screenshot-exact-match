import { Sparkles } from "lucide-react";
import type { DiscoverCard } from "@/lib/types";
import { Orb } from "./Orb";
import { TraitBars } from "./TraitBars";
export function AgentCard({ card, direction }: { card: DiscoverCard; direction?: string }) {
  const { agent, compatibility } = card;
  return (
    <article className="agent-card" data-swipe={direction}>
      <div className="agent-topline">
        <span>LOOKING FOR A CONNECTION</span>
        <span className="match-score">
          <Sparkles size={12} />
          {compatibility}% compatible
        </span>
      </div>
      <Orb agent={agent} size="xl" />
      <h2 className="agent-name">{agent.name}</h2>
      <p className="agent-type">{agent.type}</p>
      <p className="agent-bio">{agent.bio}</p>
      <div className="tags">
        {agent.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <TraitBars stats={agent.stats} />
      <p className="red-flag">
        <b>⚑ Red flag</b> · {agent.redFlag}
      </p>
    </article>
  );
}
