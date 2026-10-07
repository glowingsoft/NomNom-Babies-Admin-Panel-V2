import { ORIGINAL_DASHBOARD_BACKGROUND } from './original-background';

/** Single brand theme for NomNom admin (secondary / orange). */
export const ADMIN_THEME_OPTIONS = ['orange'];

export const DEFAULT_ADMIN_THEME = 'orange';

export const ADMIN_THEME_STORAGE_KEY = 'admin-dashboard-theme';

export const ADMIN_THEME_ROLE_LABELS = {
  orange: 'NomNom',
};

export const ADMIN_THEME_PRESETS = {
  orange: {
    label: 'NomNom',
    colorHint: 'Orange',
    role: 'secondary',
    brandGradient: 'linear-gradient(90deg, #F2692B 0%, #FB923C 100%)',
    primary: {
      lighter: '#FEEADB',
      light: '#FB923C',
      main: '#F2692B',
      dark: '#D95A24',
      darker: '#B84A1E',
      contrastText: '#FFFFFF',
    },
    secondary: {
      lighter: '#FEEADB',
      light: '#FB923C',
      main: '#F2692B',
      dark: '#D95A24',
      darker: '#B84A1E',
      contrastText: '#FFFFFF',
    },
    background: { ...ORIGINAL_DASHBOARD_BACKGROUND },
    text: {
      primary: '#000000',
      secondary: '#454F5B',
      disabled: '#919EAB',
    },
  },
};
