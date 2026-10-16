import { varAlpha } from '../styles';

import { ADMIN_THEME_PRESETS } from './presets';

// ----------------------------------------------------------------------

export function getAdminNavSectionVars(theme, themeKey = 'orange') {
  const { palette } = theme.vars;
  const { shape, spacing } = theme;

  const preset = ADMIN_THEME_PRESETS[themeKey] ?? ADMIN_THEME_PRESETS.orange;
  const hasGradientShell = false;
  const brandGradient = preset.brandGradient ?? preset.primary.main;

  const navItemColor = hasGradientShell ? '#FFFFFF' : '#000000';
  const navSubheaderColor = hasGradientShell ? 'rgba(255, 255, 255, 0.88)' : '#000000';
  const navHoverBg = hasGradientShell
    ? 'rgba(255, 255, 255, 0.14)'
    : varAlpha(palette.primary.mainChannel, 0.08);
  const navOpenBg = hasGradientShell
    ? 'rgba(255, 255, 255, 0.1)'
    : varAlpha(palette.primary.mainChannel, 0.1);

  return {
    '--admin-nav-active-gradient': brandGradient,
    '--admin-nav-active-fallback': preset.primary.main,
    '--nav-item-color': navItemColor,
    '--nav-item-hover-bg': navHoverBg,
    '--nav-item-caption-color': hasGradientShell ? 'rgba(255, 255, 255, 0.72)' : 'rgba(0, 0, 0, 0.64)',
    '--nav-item-root-active-color': '#FFFFFF',
    '--nav-item-root-active-color-on-dark': '#FFFFFF',
    '--nav-item-root-active-bg': preset.primary.main,
    '--nav-item-root-active-hover-bg': preset.primary.dark,
    '--nav-item-root-open-color': hasGradientShell ? '#FFFFFF' : palette.primary.dark,
    '--nav-item-root-open-bg': navOpenBg,
    '--nav-item-sub-active-color': '#FFFFFF',
    '--nav-item-sub-active-bg': preset.primary.main,
    '--nav-item-sub-open-color': hasGradientShell ? '#FFFFFF' : palette.primary.dark,
    '--nav-item-sub-open-bg': hasGradientShell
      ? 'rgba(255, 255, 255, 0.08)'
      : varAlpha(palette.primary.mainChannel, 0.08),
    '--nav-subheader-color': navSubheaderColor,
    '--nav-subheader-hover-color': navSubheaderColor,
    '--nav-bullet-light-color': hasGradientShell
      ? 'rgba(255, 255, 255, 0.28)'
      : varAlpha(palette.primary.mainChannel, 0.24),
    '--nav-bullet-dark-color': hasGradientShell
      ? 'rgba(255, 255, 255, 0.28)'
      : varAlpha(palette.primary.mainChannel, 0.24),
    // Spacing — roomier, modern sidebar
    '--nav-item-gap': spacing(1),
    '--nav-item-radius': `${shape.borderRadius * 1.25}px`,
    '--nav-item-pt': spacing(1),
    '--nav-item-pr': spacing(1.75),
    '--nav-item-pb': spacing(1),
    '--nav-item-pl': spacing(2),
    '--nav-item-root-height': '48px',
    '--nav-item-sub-height': '40px',
    '--nav-icon-size': '22px',
    '--nav-sub-icon-size': '20px',
    '--nav-icon-margin': spacing(0, 1.75, 0, 0),
    '--nav-sub-icon-margin': spacing(0, 1.25, 0, 0),
    '--nav-bullet-size': '0px',
  };
}
