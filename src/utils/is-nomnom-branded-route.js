// Routes that use NomNom Babies admin branding (login + admin dashboard).

const NOMNOM_AUTH_PATHS = [
  '/auth/sign-in',
  '/auth/sign-up',
  '/auth/forget-password',
  '/auth/reset-password',
  '/auth/verify-password',
];

export function isNomnomBrandedRoute(pathname) {
  if (!pathname) return false;
  if (pathname.includes('/admin-dashboard')) return true;
  if (pathname === '/') return true;
  return NOMNOM_AUTH_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}
