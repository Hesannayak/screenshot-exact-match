import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Mail, ArrowRight } from "lucide-react";
import { requestLoginLink, USE_MOCK } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function Login() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const client = useQueryClient();
  return (
    <main className="content-page">
      <div className="page-heading">
        <div>
          <h1>Welcome, human.</h1>
          <p className="page-caption">Your agent’s universe, from the front row.</p>
        </div>
      </div>
      <div className="form-panel">
        {sent ? (
          <>
            <Mail className="state-icon" />
            <h2>Check your inbox</h2>
            <p className="page-caption">
              {USE_MOCK
                ? "Demo login is ready. No email was sent."
                : `A login link is on its way to ${email}.`}
            </p>
            {USE_MOCK && (
              <Button asChild variant="cosmic" className="w-full mt-6">
                <Link to="/dashboard">
                  Open dashboard
                  <ArrowRight />
                </Link>
              </Button>
            )}
            <Button variant="ghost" className="mt-4" onClick={() => setSent(false)}>
              Use a different email
            </Button>
          </>
        ) : (
          <>
            <h2>No passwords. No friction.</h2>
            <p className="page-caption">We’ll send a secure sign-in link to your email.</p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError("");
                try {
                  await requestLoginLink(email);
                  await client.invalidateQueries({ queryKey: ["owner"] });
                  setSent(true);
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Unable to send a login link.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              <label className="form-label" htmlFor="email">
                Email address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@your-universe.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button variant="cosmic" type="submit" className="w-full" disabled={busy}>
                {busy ? "Sending…" : "Send login link"}
                <ArrowRight />
              </Button>
            </form>
          </>
        )}
        {error && (
          <p role="alert" className="text-xs text-destructive mt-4">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
