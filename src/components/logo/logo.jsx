import { forwardRef } from 'react';
import { useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import NoSsr from '@mui/material/NoSsr';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { NOMNOM_LOGO } from 'src/assets/logo';
import { isNomnomBrandedRoute } from 'src/utils/is-nomnom-branded-route';

import { logoClasses } from './classes';
import { CONFIG } from 'src/config-global';


const ADMIN_LOGO_WIDTH = 100;
const ADMIN_LOGO_HEIGHT = 100;
const AUTH_LOGO_WIDTH = 100;
const AUTH_LOGO_HEIGHT = 70;

export const Logo = forwardRef(({ width, height, disableLink = false, className, href, sx, ...other }, ref) => {
  const { pathname } = useLocation();

  const isNomnomBrand = isNomnomBrandedRoute(pathname);
  const isAdminDashboard = pathname.includes('/admin-dashboard');

  const linkHref =
    href ?? (isAdminDashboard ? paths.adminDashboard.root : '/');
  const isAuthPage =
    pathname === '/' ||
    pathname.startsWith('/auth/sign-in') ||
    pathname.startsWith('/auth/forget-password') ||
    pathname.startsWith('/auth/reset-password') ||
    pathname.startsWith('/auth/verify-password');

  const logoWidth =
    width ?? (isAuthPage ? AUTH_LOGO_WIDTH : isNomnomBrand ? ADMIN_LOGO_WIDTH : 100);
  const logoHeight =
    height ?? (isAuthPage ? AUTH_LOGO_HEIGHT : isNomnomBrand ? ADMIN_LOGO_HEIGHT : 70);

  const logoSrc = isNomnomBrand ? NOMNOM_LOGO : `${CONFIG.site.basePath}/logo/logo-single.svg`;

  const logo = (
    <Box
      alt="NomNom Babies"
      component="img"
      src={logoSrc}
      sx={{
        width: logoWidth,
        height: logoHeight,
        objectFit: 'contain',
        display: 'block',
        ...(isAuthPage && { mt: 0.5 }),
      }}
    />
  );



  return (
    <NoSsr
      fallback={
        <Box
          width={logoWidth}
          height={logoHeight}
          className={logoClasses.root.concat(className ? ` ${className}` : '')}
          sx={{
            flexShrink: 0,
            display: 'inline-flex',
            verticalAlign: 'middle',
            ...sx,
          }}
        />
      }
    >
      <Box
        ref={ref}
        component={RouterLink}
        href={linkHref}
        width={logoWidth}
        height={logoHeight}
        className={logoClasses.root.concat(className ? ` ${className}` : '')}
        aria-label="logo"
        sx={{
          flexShrink: 0,
          display: 'inline-flex',
          verticalAlign: 'middle',
          ...(disableLink && { pointerEvents: 'none' }),
          ...sx,
        }}
        {...other}
      >
        {logo}
      </Box>
    </NoSsr>
  );
});
