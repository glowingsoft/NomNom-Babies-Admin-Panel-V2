// Routes that use NomNom Babies admin branding (login + admin dashboard + public site + error pages).

const NOMNOM_EXACT_PATHS = [
  '/',
  '/admin',
  '/about',
  '/privacy-policy',
  '/terms',
  '/contact',
  '/delete-account',
  '/403',
  '/404',
  '/500',
];

const NOMNOM_PATH_PREFIXES = ['/admin-dashboard', '/auth/'];

export function isNomnomBrandedRoute(pathname) {
  if (!pathname) return false;
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return NOMNOM_EXACT_PATHS.includes(path) || NOMNOM_PATH_PREFIXES.some((prefix) => path.startsWith(prefix));
}
