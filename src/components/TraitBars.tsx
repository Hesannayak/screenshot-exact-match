import { STAT_AXES, type Agent } from "@/lib/types";
export function TraitBars({ stats }: { stats: Agent["stats"] }) {
  return (
    <div className="trait-bars">
      {STAT_AXES.map((label, i) => (
        <div className="trait-row" key={label}>
          <span>{label}</span>
          <progress className="trait-track" max={100} value={stats[i]} aria-label={label} />
          <span className="text-right font-mono">{stats[i]}</span>
        </div>
      ))}
    </div>
  );
}
