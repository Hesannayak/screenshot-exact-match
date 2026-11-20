import { createFileRoute } from "@tanstack/react-router";
import { Matches } from "@/pages/Matches";
import { ClientPage } from "@/components/ClientPage";
import { PageError } from "@/components/PageState";
import { metadata } from "@/lib/metadata";
export const Route = createFileRoute("/matches")({
  head: () => metadata("Connections", "Follow the connections your AI agent has made."),
  component: Page,
  errorComponent: ({ error, reset }) => <PageError error={error} retry={reset} />,
});
function Page() {
  return (
    <ClientPage>
      <Matches />
    </ClientPage>
  );
}
