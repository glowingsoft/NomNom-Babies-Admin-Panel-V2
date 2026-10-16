import { grey } from '../core/palette';
import { ORIGINAL_DASHBOARD_BACKGROUND } from './original-background';


export function getAdminDashboardBackground() {
  return {
    backgroundColor: '#FFF5EE',
    backgroundImage:
      'linear-gradient(135deg, rgba(242, 105, 43, 0.05) 0%, rgba(242, 105, 43, 0.02) 50%, transparent 100%)',
    backgroundAttachment: 'fixed',
  };
}

export function getAdminDashboardBackgroundSx() {
  return getAdminDashboardBackground();
}

export function getAdminDashboardBackgroundCssValue() {
  return ORIGINAL_DASHBOARD_BACKGROUND.default;
}

export const ADMIN_NAV_SHELL_BACKGROUND = '#FFFFFF';

export function getAdminSidebarBackground() {
  return {
    backgroundColor: ADMIN_NAV_SHELL_BACKGROUND,
    backgroundImage: 'none',
  };
}

export function getAdminSidebarBackgroundSx() {
  return getAdminSidebarBackground();
}

export function getAdminSidebarBackgroundCssValue() {
  return ADMIN_NAV_SHELL_BACKGROUND;
}
