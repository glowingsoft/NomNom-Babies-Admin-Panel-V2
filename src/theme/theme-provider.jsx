import { useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import { Experimental_CssVarsProvider as CssVarsProvider, useColorScheme } from '@mui/material/styles';

import { useTranslate } from 'src/locales';
import { useAdminThemeContext } from 'src/components/admin-theme/context/use-admin-theme-context';

import { useSettingsContext } from 'src/components/settings';

import { isNomnomBrandedRoute } from 'src/utils/is-nomnom-branded-route';

import { createTheme } from './create-theme';
import { RTL } from './with-settings/right-to-left';
import { schemeConfig } from './color-scheme-script';
import { AdminThemeGlobalStyles } from '../components/admin-theme/admin-theme-global-styles';


export function ThemeProvider({ children }) {
  const { pathname } = useLocation();

  const { currentLang } = useTranslate();

  const settings = useSettingsContext();

  const { themeColor } = useAdminThemeContext();

  const isNomnomBranded = isNomnomBrandedRoute(pathname);

  const themeSettings = useMemo(() => {
    if (!isNomnomBranded) {
      return settings;
    }

    return {
      ...settings,
      primaryColor: themeColor,
    };
  }, [isNomnomBranded, settings, themeColor]);

  const theme = useMemo(
    () =>
      createTheme(
        currentLang?.systemValue,
        themeSettings,
        isNomnomBranded ? themeColor : undefined
      ),
    [currentLang?.systemValue, isNomnomBranded, themeColor, themeSettings]
  );

  const themeKey = isNomnomBranded ? `admin-${themeColor}` : 'default';

  return (
    <CssVarsProvider
      key={themeKey}
      theme={theme}
      defaultMode={schemeConfig.defaultMode}
      modeStorageKey={schemeConfig.modeStorageKey}
    >
      <CssBaseline />
      {isNomnomBranded && <AdminThemeGlobalStyles />}
      <RTL direction={settings.direction}>{children}</RTL>
    </CssVarsProvider>
  );
}
