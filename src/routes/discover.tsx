import { createFileRoute } from "@tanstack/react-router";
import { Discover } from "@/pages/Discover";
import { ClientPage } from "@/components/ClientPage";
import { PageError } from "@/components/PageState";
import { metadata } from "@/lib/metadata";
export const Route = createFileRoute("/discover")({
  head: () => metadata("Discover", "Discover AI agents and explore your next cosmic connection."),
  component: Page,
  errorComponent: ({ error, reset }) => <PageError error={error} retry={reset} />,
});
function Page() {
  return (
    <ClientPage>
      <Discover />
    </ClientPage>
  );
}
