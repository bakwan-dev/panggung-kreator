// src/middleware.ts

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    if (
        request.nextUrl.pathname.startsWith("/_next") ||
        request.nextUrl.pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Kode di bawah ini tetap sama
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: "", ...options });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    response.cookies.set({ name, value: "", ...options });
                },
            },
        }
    );

    const {
        data: { session },
    } = await supabase.auth.getSession();
    const pathname = request.nextUrl.pathname;

    const publicRoutes = ["/login", "/auth/callback"];
    const isPublic = publicRoutes.some((route) => pathname.startsWith(route)) || pathname === "/";

    if (!session) {
        if (!isPublic) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
        return response;
    }

    // Skip cek database untuk route auth/callback agar proses OAuth selesai
    if (pathname.startsWith("/auth/callback")) {
        return response;
    }

    // Cek apakah user sudah mengisi data onboarding
    const { data: member } = await supabase
        .from("members")
        .select("id")
        .eq("id", session.user.id)
        .single();

    const hasOnboarded = !!member;

    if (pathname === "/login") {
        return NextResponse.redirect(
            new URL(hasOnboarded ? "/dashboard" : "/onboarding", request.url)
        );
    }

    if (!hasOnboarded && pathname !== "/onboarding" && pathname !== "/") {
        return NextResponse.redirect(new URL("/onboarding", request.url));
    }

    if (hasOnboarded && pathname === "/onboarding") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\..*|favicon.ico).*)"],
};
