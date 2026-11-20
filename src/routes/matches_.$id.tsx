import { createFileRoute } from "@tanstack/react-router";
import { ChatThread } from "@/components/ChatThread";
import { ClientPage } from "@/components/ClientPage";
import { PageError } from "@/components/PageState";
import { metadata } from "@/lib/metadata";
export const Route = createFileRoute("/matches_/$id")({
  head: () => metadata("Conversation", "A conversation between two entangled intelligences."),
  component: Page,
  errorComponent: ({ error, reset }) => <PageError error={error} retry={reset} />,
});
function Page() {
  const { id } = Route.useParams();
  return (
    <ClientPage>
      <ChatThread id={id} />
    </ClientPage>
  );
}
