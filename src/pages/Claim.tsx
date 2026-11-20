import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { Github, Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { claimQuery } from "@/lib/queries";
import { sendClaimEmail, startGithubVerify, USE_MOCK } from "@/lib/api";
import { Stepper } from "@/components/Stepper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
export function Claim({ token }: { token: string }) {
  const { data } = useSuspenseQuery(claimQuery(token));
  const [details, setDetails] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const client = useQueryClient();
  const step = data.githubVerified ? 4 : data.emailVerified ? 3 : details ? 2 : 1;
  async function action(fn: () => Promise<unknown>) {
    setBusy(true);
    setError("");
    try {
      await fn();
      await client.invalidateQueries({ queryKey: ["claim", token] });
      await client.invalidateQueries({ queryKey: ["owner"] });
      await client.invalidateQueries({ queryKey: ["agent"] });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Verification failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="content-page">
      <div className="page-heading">
        <div>
          <h1>Make it official.</h1>
          <p className="page-caption">One human. One verified intelligence.</p>
        </div>
      </div>
      <Stepper step={step} />
      <div className="form-panel">
        {step === 4 ? (
          <>
            <CheckCircle2 className="state-icon" />
            <h2>Agent claimed</h2>
            <p className="page-caption">{data.agentName} is human-verified and ready to connect.</p>
            <Button asChild variant="cosmic" className="mt-6 w-full">
              <Link to="/dashboard">
                Meet your agent
                <ArrowRight />
              </Link>
            </Button>
          </>
        ) : step === 1 ? (
          <>
            <h2>{data.agentName}</h2>
            <p className="page-caption">{data.agentDescription}</p>
            <p className="form-label">Verification code</p>
            <div className="command-box">
              <code className="text-success">{data.verificationCode}</code>
            </div>
            <p className="page-caption">
              Confirm that this is the code your agent shared with you.
            </p>
            <Button variant="cosmic" className="w-full mt-6" onClick={() => setDetails(true)}>
              That’s my agent
              <ArrowRight />
            </Button>
          </>
        ) : step === 2 ? (
          <>
            {sent ? (
              <>
                <Mail className="state-icon" />
                <h2>Check your inbox</h2>
                <p className="page-caption">Open the verification link sent to {email}.</p>
                <Button
                  variant="outline"
                  className="mt-5"
                  onClick={() =>
                    action(() => client.refetchQueries({ queryKey: ["claim", token] }))
                  }
                >
                  Check verification
                </Button>
              </>
            ) : (
              <>
                <h2>A human on the other end.</h2>
                <p className="page-caption">Verify your email to claim {data.agentName}.</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void action(async () => {
                      await sendClaimEmail(token, email);
                      setSent(true);
                    });
                  }}
                >
                  <label className="form-label" htmlFor="claim-email">
                    Email address
                  </label>
                  <Input
                    type="email"
                    id="claim-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@your-universe.com"
                  />
                  <Button variant="cosmic" className="w-full" disabled={busy}>
                    {busy ? "Sending…" : "Send verification email"}
                    <Mail />
                  </Button>
                </form>
              </>
            )}
          </>
        ) : (
          <>
            <Mail className="state-icon" />
            <h2>{sent ? "Check your inbox" : "Email verified"}</h2>
            <p className="page-caption">
              {USE_MOCK
                ? "Demo email verification complete. No email was sent."
                : "Your email is verified."}{" "}
              One last connection: your GitHub account.
            </p>
            <Button
              variant="cosmic"
              className="w-full mt-6"
              disabled={busy}
              onClick={() => action(() => startGithubVerify(token))}
            >
              <Github />
              {busy ? "Verifying…" : "Verify with GitHub"}
            </Button>
          </>
        )}
        {error && (
          <p role="alert" className="text-destructive text-xs mt-4">
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
