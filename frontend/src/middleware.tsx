// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { decodeJwt, hasAnyRole, type AuthPayload } from "./lib/auth/jwtAuth";

const TOKEN_COOKIE = "token";

const AUTH_PROTECTED: RegExp[] = [
  /^\/$/,
  /^\/home(\/.*)?$/,
  /^\/turmas(\/.*)?$/,
  /^\/professores(\/.*)?$/,
  /^\/cursos(\/.*)?$/,
  /^\/ranking(\/.*)?$/,
  /^\/admin(\/.*)?$/,
];

const ROLE_RULES: Array<{ pattern: RegExp; roles: string[] }> = [
  { pattern: /^\/dashboard(\/.*)?$/, roles: ["ADMIN"] },
  { pattern: /^\/reports(\/.*)?$/, roles: ["MANAGER", "ADMIN"] },
];

function matches(path: string, patterns: RegExp[]) {
  return patterns.some((re) => re.test(path));
}

function rolesFor(path: string): string[] | null {
  const rule = ROLE_RULES.find((r) => r.pattern.test(path));
  return rule ? rule.roles : null;
}

function authGuard(req: NextRequest): {
  ok: boolean;
  user: AuthPayload | null;
  response?: NextResponse;
} {
  const { pathname } = req.nextUrl;
  if (!matches(pathname, AUTH_PROTECTED)) return { ok: true, user: null };

  const token = req.cookies.get(TOKEN_COOKIE)?.value;

  const user = decodeJwt(token);

  if (!user) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    const res = NextResponse.redirect(url);
    res.cookies.set(TOKEN_COOKIE, "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      secure: true,
    });
    return { ok: false, user: null, response: res };
  }

  return { ok: true, user };
}

function roleGuard(
  req: NextRequest,
  user: AuthPayload | null
): NextResponse | null {
  const { pathname } = req.nextUrl;
  const needed = rolesFor(pathname);
  if (!needed) return null;

  if (!user || !hasAnyRole(user, needed)) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return null;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }

  const auth = authGuard(req);
  if (!auth.ok) return auth.response!;

  const roleResult = roleGuard(req, auth.user);
  if (roleResult) return roleResult;

  const res = NextResponse.next();
  if (auth.user) {
    res.headers.set("x-user-id", auth.user.sub || "");
    res.headers.set("x-user-roles", (auth.user.roles ?? []).join(","));
  }
  return res;
}

export const config = {
  matcher: [
    "/",
    "/home/:path*",
    "/turmas/:path*",
    "/alunos/:path*",
    "/cursos/:path*",
    "/admin/:path*",
    "/ranking/:path*",
    "/professores/:path*",
  ],
};
