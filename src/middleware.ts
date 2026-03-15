import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limit semplice in-memory (per istanza)
// In produzione usare Redis/Vercel KV
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 100; // richieste
const WINDOW_MS = 60 * 1000; // 1 minuto

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "anonymous";
  return ip;
}

function isRateLimited(key: string): { limited: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return { limited: false, remaining: RATE_LIMIT - 1 };
  }

  if (record.count >= RATE_LIMIT) {
    return { limited: true, remaining: 0 };
  }

  record.count++;
  return { limited: false, remaining: RATE_LIMIT - record.count };
}

export function middleware(request: NextRequest) {
  // Applica rate limit solo alle API
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Escludi auth routes
    if (request.nextUrl.pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    const key = getRateLimitKey(request);
    const { limited, remaining } = isRateLimited(key);

    if (limited) {
      return NextResponse.json(
        { error: "Troppe richieste. Riprova tra un minuto." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT.toString(),
            "X-RateLimit-Remaining": "0",
            "Retry-After": "60",
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", RATE_LIMIT.toString());
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};