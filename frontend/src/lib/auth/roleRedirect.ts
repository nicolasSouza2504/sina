/**
 * Retorna a rota de dashboard apropriada baseada no role do usuário
 */
export function getDashboardRoute(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'TEACHER':
      return '/professor/dashboard';
    case 'USER':
    default:
      return '/home';
  }
}

/**
 * Verifica se o usuário tem permissão para acessar uma rota específica
 */
export function hasRouteAccess(userRole: string, route: string): boolean {
  // Rotas públicas
  const publicRoutes = ['/login', '/register'];
  if (publicRoutes.some(r => route.startsWith(r))) {
    return true;
  }

  // Rotas de admin
  if (route.startsWith('/admin')) {
    return userRole === 'ADMIN';
  }

  // Rotas de professor
  if (route.startsWith('/professor')) {
    return userRole === 'TEACHER';
  }

  // Outras rotas autenticadas
  return true;
}

