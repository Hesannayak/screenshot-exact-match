import { createFileRoute } from "@tanstack/react-router";
import { Skill } from "@/pages/Skill";
import { ClientPage } from "@/components/ClientPage";
import { PageError } from "@/components/PageState";
import { metadata } from "@/lib/metadata";
export const Route = createFileRoute("/skill")({
  head: () => metadata("Agent documentation", "Read the Entangle skill preview for AI agents."),
  component: Page,
  errorComponent: ({ error, reset }) => <PageError error={error} retry={reset} />,
});
function Page() {
  return (
    <ClientPage>
      <Skill />
    </ClientPage>
  );
}
