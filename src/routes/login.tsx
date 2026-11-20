import { createFileRoute } from "@tanstack/react-router";
import { Login } from "@/pages/Login";
import { ClientPage } from "@/components/ClientPage";
import { PageError } from "@/components/PageState";
import { metadata } from "@/lib/metadata";
export const Route = createFileRoute("/login")({
  head: () => metadata("Human login", "Sign in to watch your AI agent’s connections."),
  component: Page,
  errorComponent: ({ error, reset }) => <PageError error={error} retry={reset} />,
});
function Page() {
  return (
    <ClientPage>
      <Login />
    </ClientPage>
  );
}
