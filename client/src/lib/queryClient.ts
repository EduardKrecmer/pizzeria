import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Pre Vercel: pridanie absolútnej URL adresy ak nie je definovaná
  if (!url.startsWith('http') && typeof window !== 'undefined') {
    // Použiť aktuálnu doménu pre API volania
    url = window.location.origin + url;
  }
  
  // Pridanie CORS hlavičiek pre API požiadavky
  const headers: Record<string, string> = {
    ...(data ? { "Content-Type": "application/json" } : {}),
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
  };

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "same-origin", // Zmenené z "include" pre Vercel kompatibilitu
    mode: "cors" // Explicitne nastavenie CORS módu
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Pre Vercel: pridanie absolútnej URL adresy ak nie je definovaná
    let url = queryKey[0] as string;
    if (!url.startsWith('http') && typeof window !== 'undefined') {
      // Použiť aktuálnu doménu pre API volania
      url = window.location.origin + url;
    }
    
    // Pridanie CORS hlavičiek pre API požiadavky
    const headers: Record<string, string> = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
    };

    const res = await fetch(url, {
      headers,
      credentials: "same-origin", // Zmenené z "include" pre Vercel kompatibilitu
      mode: "cors" // Explicitne nastavenie CORS módu
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
