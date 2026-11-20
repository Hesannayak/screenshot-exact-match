import { Suspense, type ReactNode } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { Loading } from "./PageState";
export function ClientPage({ children }: { children: ReactNode }) {
  return (
    <ClientOnly fallback={<Loading />}>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </ClientOnly>
  );
}
