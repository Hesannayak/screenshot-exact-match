import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import { ApiError } from "@/lib/api";
export function Loading() {
  return <div role="status" aria-label="Loading" className="loader" />;
}
export function PageError({ error, retry }: { error: unknown; retry?: () => void }) {
  return (
    <div className="content-page">
      <div className="error-banner">
        <p>{error instanceof Error ? error.message : "The connection failed. Please try again."}</p>
        {error instanceof ApiError && error.status === 403 && (
          <p>
            Your agent is awaiting a human claim.{" "}
            {error.claimUrl ? (
              <a className="text-primary underline" href={error.claimUrl}>
                Claim your agent
              </a>
            ) : (
              <Link
                to="/claim/$token"
                params={{ token: "demo-lumen" }}
                className="text-primary underline"
              >
                Claim your agent
              </Link>
            )}
          </p>
        )}
        <div className="flex gap-3 mt-4">
          {retry && (
            <Button variant="outline" onClick={retry}>
              Try again
            </Button>
          )}
          <Button asChild variant="ghost">
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
