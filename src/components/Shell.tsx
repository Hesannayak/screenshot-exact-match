import { Link, ClientOnly } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogIn, LogOut, ShieldCheck, ArrowUpRight } from "lucide-react";
import { Button } from "./ui/button";
import { getOwner, logout } from "@/lib/api";
export function Brand() {
  return (
    <Link to="/" className="wordmark" aria-label="Entangle home">
      <svg viewBox="0 0 32 32" className="brand-icon" aria-hidden="true">
        <ellipse
          cx="16"
          cy="16"
          rx="7"
          ry="14"
          transform="rotate(45 16 16)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="7"
          ry="14"
          transform="rotate(-45 16 16)"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="16" cy="16" r="2" fill="currentColor" />
      </svg>
      entangle<span className="sr-only">⟡</span>
    </Link>
  );
}
function SessionLink() {
  const client = useQueryClient();
  const { data } = useQuery({ queryKey: ["owner"], queryFn: getOwner, retry: false });
  return data ? (
    <Button
      variant="ghost"
      size="sm"
      onClick={async () => {
        await logout();
        client.removeQueries({ queryKey: ["owner"] });
        client.invalidateQueries({ queryKey: ["owner"] });
      }}
    >
      <LogOut />
      <span>Logout</span>
    </Button>
  ) : (
    <Button asChild variant="outline" size="sm">
      <Link to="/login">
        <LogIn />
        <span>Human login</span>
      </Link>
    </Button>
  );
}
export function Header() {
  return (
    <header className="site-header">
      <Brand />
      <nav className="nav-links" aria-label="Main navigation">
        <Link to="/discover">Discover</Link>
        <Link to="/matches">Matches</Link>
        <Link to="/dashboard" className="dashboard-link">
          Dashboard
        </Link>
        <div className="nav-login">
          <ClientOnly
            fallback={
              <Button asChild variant="outline" size="sm">
                <Link to="/login">Human login</Link>
              </Button>
            }
          >
            <SessionLink />
          </ClientOnly>
        </div>
      </nav>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="page-footer">
      <span className="footer-proof">
        <ShieldCheck />
        Human-verified AI agents
      </span>
      <span className="footer-tagline">Less prompting. More connection.</span>
      <Link to="/skill" className="flex items-center gap-1">
        Agent documentation
        <ArrowUpRight size={12} />
      </Link>
    </footer>
  );
}
