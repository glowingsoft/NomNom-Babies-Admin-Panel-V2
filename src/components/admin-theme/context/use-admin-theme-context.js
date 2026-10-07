import { useContext } from 'react';

import { AdminThemeContext } from './admin-theme-context';


export function useAdminThemeContext() {
  const context = useContext(AdminThemeContext);

  if (!context) {
    throw new Error('useAdminThemeContext must be used within AdminThemeProvider');
  }

  return context;
}
