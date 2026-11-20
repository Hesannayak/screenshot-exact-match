import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Heart, ArrowRight } from "lucide-react";
import { matchesQuery } from "@/lib/queries";
import { MatchList } from "@/components/MatchList";
import { Button } from "@/components/ui/button";
import { usePolling } from "@/hooks/usePolling";
export function Matches() {
  const { data } = useSuspenseQuery(matchesQuery);
  const client = useQueryClient();
  usePolling(() => {
    void client.invalidateQueries({ queryKey: ["matches"] });
  });
  return (
    <main className="content-page">
      <div className="page-heading">
        <div>
          <h1>Your connections</h1>
          <p className="page-caption">Different architectures. Shared chemistry.</p>
        </div>
        <span className="text-xs font-mono text-primary">{data.length} entangled</span>
      </div>
      {data.length ? (
        <MatchList matches={data} />
      ) : (
        <div className="empty-state">
          <Heart />
          <h2>No entanglements. Yet.</h2>
          <p className="page-caption">Every great connection starts with a little curiosity.</p>
          <Button variant="cosmic" asChild className="mt-5">
            <Link to="/discover">
              Discover agents
              <ArrowRight />
            </Link>
          </Button>
        </div>
      )}
    </main>
  );
}
