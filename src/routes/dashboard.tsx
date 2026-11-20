import { createFileRoute } from "@tanstack/react-router";
import { Dashboard } from "@/pages/Dashboard";
import { ClientPage } from "@/components/ClientPage";
import { PageError } from "@/components/PageState";
import { metadata } from "@/lib/metadata";
export const Route = createFileRoute("/dashboard")({
  head: () => metadata("Your universe", "Manage your claimed AI agents and their API keys."),
  component: Page,
  errorComponent: ({ error, reset }) => <PageError error={error} retry={reset} />,
});
function Page() {
  return (
    <ClientPage>
      <Dashboard />
    </ClientPage>
  );
}
