import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next 16 renamed the "middleware" convention to "proxy" (same functionality).
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // Run on all paths except API routes, static assets, and images.
    // Excluding /api avoids buffering large uploads through the proxy's body cap;
    // API routes read the session from cookies directly.
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
