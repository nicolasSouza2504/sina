// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { decodeJwtServer, hasAnyRoleServer, type AuthPayload } from "./lib/auth/jwtAuth.middleware";

const TOKEN_COOKIE = "token";

const AUTH_PROTECTED: RegExp[] = [
  /^\/$/, // Página raiz
  /^\/home(\/.*)?$/,
  /^\/aluno(\/.*)?$/,
  /^\/professor(\/.*)?$/,
  /^\/cursos(\/.*)?$/,
  /^\/trilhas(\/.*)?$/,
  /^\/ranking(\/.*)?$/,
  /^\/admin(\/.*)?$/,
  /^\/user(\/.*)?$/,
];

const ROLE_RULES: Array<{ pattern: RegExp; roles: string[] }> = [
  // ========================================
  // TELAS EXCLUSIVAS DO ADMIN (role=1)
  // ========================================
  { pattern: /^\/admin$/, roles: ["ADMIN"] }, // Dashboard Admin
  { pattern: /^\/admin\/admin(\/.*)?$/, roles: ["ADMIN"] }, // Gerenciamento de Administradores
  { pattern: /^\/admin\/teachers(\/.*)?$/, roles: ["ADMIN"] }, // Gerenciamento de Professores
  { pattern: /^\/admin\/students(\/.*)?$/, roles: ["ADMIN", "TEACHER"] }, // Gerenciamento de Alunos
  { pattern: /^\/admin\/class(\/.*)?$/, roles: ["ADMIN", "TEACHER"] }, // Gerenciamento de Turmas

  // ========================================
  // TELAS EXCLUSIVAS DO PROFESSOR (role=2)
  // ADMIN também tem acesso a estas telas
  // ========================================
  { pattern: /^\/professor\/dashboard(\/.*)?$/, roles: ["ADMIN", "TEACHER"] }, // Dashboard Professor
  { pattern: /^\/professor\/cursos(\/.*)?$/, roles: ["ADMIN", "TEACHER"] }, // Cursos do Professor
  { pattern: /^\/professor\/conteudo(\/.*)?$/, roles: ["ADMIN", "TEACHER"] }, // Conteúdo/Tarefas

  // ========================================
  // TELAS COMPARTILHADAS (ADMIN + TEACHER + STUDENT)
  // ========================================
  { pattern: /^\/cursos(\/.*)?$/, roles: ["ADMIN", "TEACHER", "STUDENT"] }, // Visualização de Cursos
  { pattern: /^\/ranking(\/.*)?$/, roles: ["ADMIN", "TEACHER", "STUDENT"] }, // Ranking
  { pattern: /^\/trilhas(\/.*)?$/, roles: ["ADMIN", "TEACHER", "STUDENT"] }, // Trilhas de Conhecimento

  // ========================================
  // TELAS DO ESTUDANTE (role=3)
  // ========================================
  { pattern: /^\/aluno\/dashboard(\/.*)?$/, roles: ["STUDENT"] }, // Dashboard Aluno
  { pattern: /^\/aluno\/trilhas(\/.*)?$/, roles: ["STUDENT"] }, // Trilhas do Aluno
  { pattern: /^\/aluno\/ead(\/.*)?$/, roles: ["STUDENT"] }, // EAD do Aluno
  { pattern: /^\/aluno\/ranking(\/.*)?$/, roles: ["STUDENT"] }, // Ranking EAD
  { pattern: /^\/home(\/.*)?$/, roles: ["ADMIN", "TEACHER", "STUDENT"] }, // Dashboard Geral (fallback)

  // ========================================
  // TELAS DE PERFIL (todos os roles autenticados)
  // ========================================
  { pattern: /^\/user\/profile(\/.*)?$/, roles: ["ADMIN", "TEACHER", "STUDENT", "USER"] }, // Perfil do Usuário
];

function matches(path: string, patterns: RegExp[]) {
  return patterns.some((re) => re.test(path));
}

function rolesFor(path: string): string[] | null {
  const rule = ROLE_RULES.find((r) => r.pattern.test(path));
  return rule ? rule.roles : null;
}

function getDefaultDashboard(user: AuthPayload): string {
  const userRole = Array.isArray(user.role) ? user.role[0] : user.role;

  switch (userRole) {
    case "ADMIN":
      return "/admin";
    case "TEACHER":
      return "/professor/dashboard";
    case "STUDENT":
      return "/aluno/dashboard";
    default:
      return "/ranking";
  }
}

function authGuard(req: NextRequest): {
  ok: boolean;
  user: AuthPayload | null;
  response?: NextResponse;
} {
  const { pathname } = req.nextUrl;

  // Permite acesso à página de login sem autenticação
  // Se estiver logado, redireciona para o dashboard apropriado
  if (pathname === "/login") {
    const token = req.cookies.get(TOKEN_COOKIE)?.value;
    const user = decodeJwtServer(token);

    // Se usuário está logado, redireciona para seu dashboard
    if (user) {
      const url = req.nextUrl.clone();
      url.pathname = getDefaultDashboard(user);
      return { ok: false, user, response: NextResponse.redirect(url) };
    }

    // Se não está logado, permite acesso à página de login
    return { ok: true, user: null };
  }

  if (!matches(pathname, AUTH_PROTECTED)) return { ok: true, user: null };

  const token = req.cookies.get(TOKEN_COOKIE)?.value;

  const user = decodeJwtServer(token);

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

  // Se usuário está logado e tentando acessar página raiz ("/"),
  // redirecionar para o dashboard correspondente ao seu role
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = getDefaultDashboard(user);
    return { ok: false, user, response: NextResponse.redirect(url) };
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

  if (!user || !hasAnyRoleServer(user, needed)) {
    const url = req.nextUrl.clone();

    // Se não tem usuário, redireciona para login
    if (!user) {
      url.pathname = "/login";
    } else {
      // Se tem usuário mas não tem permissão, redireciona para seu dashboard padrão
      url.pathname = getDefaultDashboard(user);
    }

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
    res.headers.set("x-user-roles", Array.isArray(auth.user.role) ? auth.user.role.join(",") : "");
  }
  return res;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/home/:path*",
    "/aluno/:path*",
    "/professor/:path*",
    "/admin/:path*",
    "/cursos/:path*",
    "/trilhas/:path*",
    "/ranking/:path*",
    "/user/:path*",
  ],
};
