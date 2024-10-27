"use client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RefreshToken from "@/components/refresh-token";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      //tắt cái tự động refetch khi focus vào tab
      refetchOnWindowFocus: false,
      //tắt cái tự động refetch khi mount component
      refetchOnMount: false,
    },
  },
});

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <RefreshToken />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
