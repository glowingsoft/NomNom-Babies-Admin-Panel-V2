import { useEffect, useMemo } from 'react';

import { NOMNOM_LOGO } from 'src/assets/logo';
import { DEFAULT_ADMIN_THEME, ADMIN_THEME_STORAGE_KEY } from 'src/theme/admin-theme/presets';

import { AdminThemeContext } from './context/admin-theme-context';

// ----------------------------------------------------------------------

export function AdminThemeProvider({ children }) {
  const themeColor = DEFAULT_ADMIN_THEME;

  useEffect(() => {
    localStorage.setItem(ADMIN_THEME_STORAGE_KEY, DEFAULT_ADMIN_THEME);

    const favicon = document.querySelector("link[rel='icon']") || document.querySelector("link[rel='shortcut icon']");

    if (favicon) {
      favicon.setAttribute('href', NOMNOM_LOGO);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      themeColor,
      onChangeThemeColor: () => {},
    }),
    []
  );

  return <AdminThemeContext.Provider value={contextValue}>{children}</AdminThemeContext.Provider>;
}
