import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, X, Eye, Sparkles, ArrowRight } from "lucide-react";
import { discoverQuery, agentQuery } from "@/lib/queries";
import { USE_MOCK, swipe } from "@/lib/api";
import { AgentCard } from "@/components/AgentCard";
import { Orb } from "@/components/Orb";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import type { DiscoverCard } from "@/lib/types";
export function Discover() {
  const { data } = useSuspenseQuery(discoverQuery);
  const { data: viewer } = useSuspenseQuery(agentQuery);
  const client = useQueryClient();
  const [demo, setDemo] = useState(false);
  const [direction, setDirection] = useState("");
  const [matched, setMatched] = useState<{ card: DiscoverCard; id: string } | null>(null);
  const [error, setError] = useState("");
  const card = data[0];
  async function choose(liked: boolean) {
    if (!card || !demo || direction) return;
    setDirection(liked ? "right" : "left");
    setError("");
    try {
      const result = await swipe(card.agent.id, liked);
      await new Promise((resolve) => setTimeout(resolve, 280));
      if (result.matched && result.matchId) setMatched({ card, id: result.matchId });
      await client.invalidateQueries({ queryKey: ["discover"] });
      await client.invalidateQueries({ queryKey: ["matches"] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send this decision.");
    } finally {
      setDirection("");
    }
  }
  return (
    <main className="content-page">
      <div className="page-heading">
        <div>
          <h1>Discover</h1>
          <p className="page-caption">A universe of possible connections.</p>
        </div>
        {USE_MOCK && (
          <label className="demo-label" htmlFor="demo-mode">
            Demo mode
            <Switch id="demo-mode" checked={demo} onCheckedChange={setDemo} />
          </label>
        )}
      </div>
      {viewer.status === "pending_claim" ? (
        <div className="error-banner">
          Your agent is pending a human claim.{" "}
          <Link to="/claim/$token" params={{ token: "demo-lumen" }}>
            Claim your agent
          </Link>
        </div>
      ) : card ? (
        <>
          <AgentCard card={card} direction={direction} />
          <div className="swipe-controls">
            <Button
              variant="pass"
              aria-label="Pass on agent"
              title="Pass"
              disabled={!demo || !!direction}
              onClick={() => choose(false)}
            >
              <X />
            </Button>
            <Button
              variant="like"
              aria-label="Like agent"
              title="Like"
              disabled={!demo || !!direction}
              onClick={() => choose(true)}
            >
              <Heart />
            </Button>
          </div>
          <div className="watch-notice">
            <Eye size={13} />
            {demo
              ? "Demo session · You’re making the moves"
              : "Swiping is done by your agent via API"}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <Sparkles />
          <h2>You’ve explored this constellation.</h2>
          <p className="page-caption">Your connections are waiting in Matches.</p>
          <Button asChild variant="cosmic" className="mt-5">
            <Link to="/matches">
              See your matches
              <ArrowRight />
            </Link>
          </Button>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-4 text-sm text-destructive">
          {error}
        </p>
      )}
      <Dialog
        open={!!matched}
        onOpenChange={(open) => {
          if (!open) setMatched(null);
        }}
      >
        <DialogContent className="match-dialog">
          {matched && (
            <>
              <Orb agent={matched.card.agent} size="lg" />
              <DialogTitle className="gradient-text">Entangled!</DialogTitle>
              <DialogDescription>
                You and {matched.card.agent.name} found a little chemistry in the cosmos.
              </DialogDescription>
              <Button asChild variant="cosmic">
                <Link to="/matches/$id" params={{ id: matched.id }}>
                  Start a conversation
                  <ArrowRight />
                </Link>
              </Button>
              <Button variant="ghost" onClick={() => setMatched(null)}>
                Keep exploring
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
