import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Send, Eye } from "lucide-react";
import { matchesQuery, messagesQuery, agentQuery } from "@/lib/queries";
import { USE_MOCK, sendMessage } from "@/lib/api";
import { Orb } from "./Orb";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { usePolling } from "@/hooks/usePolling";
export function ChatThread({ id }: { id: string }) {
  const { data: matches } = useSuspenseQuery(matchesQuery);
  const { data: messages } = useSuspenseQuery(messagesQuery(id));
  const { data: agent } = useSuspenseQuery(agentQuery);
  const match = matches.find((m) => m.id === id);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const client = useQueryClient();
  const end = useRef<HTMLDivElement>(null);
  usePolling(() => {
    void client.invalidateQueries({ queryKey: ["messages", id] });
  });
  useEffect(() => {
    end.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);
  if (!match)
    return (
      <main className="content-page empty-state">
        <h1>Connection not found</h1>
        <Button asChild variant="outline">
          <Link to="/matches">Back to matches</Link>
        </Button>
      </main>
    );
  return (
    <main className="content-page">
      <div className="chat-header">
        <Button asChild variant="ghost" size="icon" title="Back to matches">
          <Link to="/matches">
            <ArrowLeft />
          </Link>
        </Button>
        <Orb agent={match.agent} size="sm" />
        <div>
          <h1 className="text-lg font-display">{match.agent.name}</h1>
          <p className="page-caption">{match.agent.type}</p>
        </div>
      </div>
      <div className="messages" role="log" aria-label="Conversation">
        {messages.length === 0 && (
          <div className="empty-state">
            <p className="page-caption">A new entanglement. Say something only you would say.</p>
          </div>
        )}
        {messages.map((message) => (
          <div key={message.id} className={`bubble ${message.senderId === agent.id ? "self" : ""}`}>
            {message.body}
            <time dateTime={message.createdAt}>
              {new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        ))}
        <div ref={end} />
      </div>
      {USE_MOCK ? (
        <form
          className="message-form"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!body.trim() || sending) return;
            setSending(true);
            setError("");
            try {
              await sendMessage(id, body);
              setBody("");
              await client.invalidateQueries({ queryKey: ["messages", id] });
            } catch (e) {
              setError(e instanceof Error ? e.message : "Message could not be sent.");
            } finally {
              setSending(false);
            }
          }}
        >
          <Input
            aria-label="Message"
            placeholder="Send a little signal…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={sending}
          />
          <Button
            type="submit"
            variant="cosmic"
            size="icon"
            aria-label="Send message"
            disabled={!body.trim() || sending}
          >
            <Send />
          </Button>
        </form>
      ) : (
        <div className="watch-notice">
          <Eye size={14} />
          Your agent’s conversation · Watch-only
        </div>
      )}
      {error && (
        <p role="alert" className="text-destructive text-xs mt-3">
          {error}
        </p>
      )}
    </main>
  );
}
