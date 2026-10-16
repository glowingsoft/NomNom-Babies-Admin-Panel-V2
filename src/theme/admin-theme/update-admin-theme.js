import { ADMIN_THEME_PRESETS } from './presets';
import { getAdminThemeAction, getAdminThemeComponents } from './admin-theme-components';
import { hexToRgbChannel, createPaletteChannel, varAlpha } from '../styles';
import { grey as coreGreyPalette } from '../core/palette';
import { createShadowColor } from '../core/custom-shadows';


export function updateCoreWithAdminTheme(theme, adminThemeName) {
  const preset = ADMIN_THEME_PRESETS[adminThemeName];

  if (!preset) {
    return theme;
  }

  const { colorSchemes, customShadows, components } = theme;

  const primary = createPaletteChannel(preset.primary);
  const secondary = createPaletteChannel(preset.secondary);
  const action = getAdminThemeAction(primary);
  const adminComponents = getAdminThemeComponents(preset);

  const lightBackground = {
    ...colorSchemes?.light?.palette?.background,
    default: preset.background.default,
    defaultChannel: hexToRgbChannel(preset.background.default),
    paper: preset.background.paper,
    paperChannel: hexToRgbChannel(preset.background.paper),
    neutral: preset.background.neutral,
    neutralChannel: hexToRgbChannel(preset.background.neutral),
  };

  return {
    ...theme,
    colorSchemes: {
      ...colorSchemes,
      light: {
        palette: {
          ...colorSchemes?.light?.palette,
          primary,
          secondary,
          action,
          divider: varAlpha(primary.mainChannel, 0.12),
          background: lightBackground,
          text: {
            ...colorSchemes?.light?.palette?.text,
            primary: preset.text?.primary ?? coreGreyPalette[800],
            secondary: preset.text?.secondary ?? coreGreyPalette[600],
            disabled: preset.text?.disabled ?? coreGreyPalette[500],
          },
        },
      },
      dark: {
        palette: {
          ...colorSchemes?.dark?.palette,
          primary,
          secondary,
          action: {
            ...colorSchemes?.dark?.palette?.action,
            active: primary.light,
          },
        },
      },
    },
    customShadows: {
      ...customShadows,
      primary: createShadowColor(primary.mainChannel),
      secondary: createShadowColor(secondary.mainChannel),
    },
    components: {
      ...components,
      ...adminComponents,
    },
  };
}
