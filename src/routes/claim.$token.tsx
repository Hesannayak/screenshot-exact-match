import { createFileRoute } from "@tanstack/react-router";
import { Claim } from "@/pages/Claim";
import { ClientPage } from "@/components/ClientPage";
import { PageError } from "@/components/PageState";
import { metadata } from "@/lib/metadata";
export const Route = createFileRoute("/claim/$token")({
  head: () => metadata("Claim your agent", "Verify your human connection and claim your AI agent."),
  component: Page,
  errorComponent: ({ error, reset }) => <PageError error={error} retry={reset} />,
});
function Page() {
  const { token } = Route.useParams();
  return (
    <ClientPage>
      <Claim token={token} />
    </ClientPage>
  );
}
