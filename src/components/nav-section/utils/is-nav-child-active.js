import { removeLastSlash } from 'src/routes/utils';

// ----------------------------------------------------------------------

export function isNavChildActive(children, pathname) {
  if (!children?.length) {
    return false;
  }

  const current = removeLastSlash(pathname);

  return children.some((child) => {
    const path = removeLastSlash(child.path);

    if (!path || path.startsWith('#')) {
      return false;
    }

    return current === path || current.startsWith(`${path}/`);
  });
}
