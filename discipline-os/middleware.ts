import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/register"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes through
    if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Check for token in cookies (set by apiClient after login)
    const token = request.cookies.get("discipline_token")?.value
        ?? request.headers.get("authorization")?.replace("Bearer ", "");

    // No token → redirect to login once, cleanly
    if (!token) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Protect all routes except Next.js internals and static files
        "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.svg).*)",
    ],
};
