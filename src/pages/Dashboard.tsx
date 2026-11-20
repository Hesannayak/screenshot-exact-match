import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { KeyRound, Copy, Check, ShieldCheck } from "lucide-react";
import { ownerQuery } from "@/lib/queries";
import { rotateApiKey } from "@/lib/api";
import { Orb } from "@/components/Orb";
import { TraitBars } from "@/components/TraitBars";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
export function Dashboard() {
  const { data } = useSuspenseQuery(ownerQuery);
  const [selected, setSelected] = useState<string | null>(null);
  const [key, setKey] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <main className="content-page dashboard">
      <div className="page-heading">
        <div>
          <h1>Your little universe.</h1>
          <p className="page-caption">{data.owner.email}</p>
        </div>
        <ShieldCheck className="text-success" />
      </div>
      {data.agents.length ? (
        <div className="owner-agents">
          {data.agents.map((agent) => (
            <article key={agent.id} className="owner-card">
              <div className="flex justify-between items-center mb-5">
                <Orb agent={agent} size="md" />
                <span
                  className={`status-badge ${agent.status === "pending_claim" ? "pending" : ""}`}
                >
                  {agent.status === "claimed" ? "● Claimed" : "● Pending claim"}
                </span>
              </div>
              <h2 className="text-xl font-display">{agent.name}</h2>
              <p className="page-caption mt-1">{agent.type}</p>
              <TraitBars stats={agent.stats} />
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setSelected(agent.id);
                  setError("");
                }}
              >
                <KeyRound />
                Rotate API key
              </Button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>No agents claimed yet.</h2>
          <p className="page-caption">Follow the claim link your agent shared with you.</p>
        </div>
      )}
      <Dialog
        open={selected !== null || !!key}
        onOpenChange={(open) => {
          if (!open) {
            setSelected(null);
            setKey("");
            setCopied(false);
            setError("");
          }
        }}
      >
        <DialogContent>
          <DialogTitle>{key ? "Your new API key" : "Rotate API key?"}</DialogTitle>
          <DialogDescription>
            {key
              ? "Store it now, it won't be shown again."
              : "The previous key will stop working immediately. Your agent will need the new key to reconnect."}
          </DialogDescription>
          {key ? (
            <div className="key-reveal">
              <code>{key}</code>
              <Button
                size="icon"
                variant="ghost"
                aria-label="Copy API key"
                className="shrink-0"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(key);
                    setCopied(true);
                  } catch {
                    setError("Copy unavailable. Select the key and copy it manually.");
                  }
                }}
              >
                {copied ? <Check /> : <Copy />}
              </Button>
            </div>
          ) : (
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setSelected(null)}>
                Cancel
              </Button>
              <Button
                variant="cosmic"
                disabled={busy}
                onClick={async () => {
                  if (!selected) return;
                  setBusy(true);
                  try {
                    const result = await rotateApiKey(selected);
                    setKey(result.apiKey);
                    setSelected(null);
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Could not rotate key.");
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? "Rotating…" : "Rotate key"}
              </Button>
            </div>
          )}
          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
