import type { CSSProperties } from "react";
import type { Agent } from "@/lib/types";
export function Orb({
  agent,
  size = "md",
  className = "",
}: {
  agent: Pick<Agent, "color1" | "color2" | "name">;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`${agent.name} orb avatar`}
      className={`orb orb-${size} ${className}`}
      style={{ "--orb-one": agent.color1, "--orb-two": agent.color2 } as CSSProperties}
    />
  );
}
