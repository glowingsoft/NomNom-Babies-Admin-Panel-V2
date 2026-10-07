import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import { varAlpha } from 'src/theme/styles';
import { ADMIN_THEME_PRESETS } from 'src/theme/admin-theme/presets';

import { useAdminThemeContext } from './context/use-admin-theme-context';

// ----------------------------------------------------------------------

/**
 * @param {{ gradient?: boolean }} [options] — gradient: theme brand fill for welcome hero card
 */
export function useAdminDashboardCardSx(options = {}) {
  const { gradient = false } = options;
  const theme = useTheme();
  const { pathname } = useLocation();
  const { themeColor } = useAdminThemeContext();

  const isAdminDashboard = pathname.includes('/admin-dashboard');

  return useMemo(() => {
    if (!isAdminDashboard) {
      return null;
    }

    const preset = ADMIN_THEME_PRESETS[themeColor] ?? ADMIN_THEME_PRESETS.orange;
    const brandGradient = preset.brandGradient;

    if (gradient && brandGradient) {
      return {
        background: brandGradient,
        backgroundColor: preset.primary.main,
        backgroundImage: 'none',
        color: '#FFFFFF',
        border: `solid 1px ${varAlpha(theme.vars.palette.primary.mainChannel, 0.28)}`,
        boxShadow: theme.customShadows.card,
      };
    }

    return {
      backgroundColor: theme.vars.palette.background.paper,
      background: theme.vars.palette.background.paper,
      backgroundImage: 'none',
      color: theme.vars.palette.text.primary,
      border: `solid 1px ${varAlpha(theme.vars.palette.primary.mainChannel, 0.16)}`,
      boxShadow: theme.customShadows.card,
    };
  }, [
    gradient,
    isAdminDashboard,
    theme.customShadows.card,
    theme.vars.palette.background.paper,
    theme.vars.palette.primary.mainChannel,
    theme.vars.palette.text.primary,
    themeColor,
  ]);
}
