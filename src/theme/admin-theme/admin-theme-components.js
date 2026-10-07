import { buttonClasses } from '@mui/material/Button';
import { iconButtonClasses } from '@mui/material/IconButton';
import { layoutClasses } from 'src/layouts/classes';
import { varAlpha } from '../styles';
import { grey as coreGreyPalette } from '../core/palette';
import { ORIGINAL_DASHBOARD_BACKGROUND } from './original-background';
import { getAdminSidebarBackgroundCssValue, getAdminDashboardBackground } from './admin-theme-background';
import { getAdminBrandGradient, getAdminGradientComponents } from './admin-theme-gradient-components';


export function getAdminThemeComponents(preset) {
  const { background } = preset;

  const shellBackground = {
    ...getAdminDashboardBackground(),
    backgroundColor: background.default ?? ORIGINAL_DASHBOARD_BACKGROUND.default,
  };

  const navBackground = {
    backgroundColor: getAdminSidebarBackgroundCssValue(),
    backgroundImage: 'none',
  };

  const brandGradient = getAdminBrandGradient(preset);
  const tableHeadRowFill = brandGradient
    ? {
        background: brandGradient,
        backgroundColor: preset.primary.main,
      }
    : null;
  const tableHeadCellFill = brandGradient
    ? {
        backgroundColor: 'transparent',
        background: 'transparent',
        backgroundImage: 'none',
        color: '#FFFFFF',
      }
    : null;

  const gradientComponents = getAdminGradientComponents(preset);

  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: shellBackground,
        '#root': {
          minHeight: '100%',
          ...shellBackground,
        },
        '#root__layout': {
          minHeight: '100vh',
          ...shellBackground,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
          backgroundColor: theme.vars.palette.background.paper,
          [`&.${layoutClasses.header}`]: {
            ...navBackground,
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          position: 'relative',
          boxShadow: theme.customShadows.card,
          borderRadius: theme.shape.borderRadius * 2,
          zIndex: 0,
          backgroundColor: theme.vars.palette.background.paper,
        }),
      },
    },
    MuiTable: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${varAlpha(theme.vars.palette.primary.mainChannel, 0.36)}`,
          borderRadius: theme.shape.borderRadius,
          borderCollapse: 'separate',
          borderSpacing: 0,
          overflow: 'hidden',
          '--palette-TableCell-border': theme.vars.palette.divider,
        }),
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: ({ theme }) => ({
          '&:last-of-type .MuiTableCell-root': {
            borderBottom: 'none',
          },
          '&:hover .MuiTableCell-root': {
            backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.04),
          },
        }),
        head: tableHeadRowFill ?? {},
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: tableHeadRowFill ?? {},
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderBottom: `1px solid ${theme.vars.palette.divider}`,
          borderRight: 'none',
          backgroundColor: theme.vars.palette.background.paper,
        }),
        head: ({ theme }) => ({
          fontSize: 14,
          fontWeight: theme.typography.fontWeightSemiBold,
          color: theme.vars.palette.primary.contrastText,
          ...(tableHeadCellFill ?? { backgroundColor: theme.vars.palette.primary.main }),
          borderBottom: 'none',
          borderRight: 'none',
          '& .MuiTableSortLabel-root': {
            color: 'inherit',
            '&:hover': {
              color: 'inherit',
              opacity: 0.88,
            },
            '&.Mui-active': {
              color: 'inherit',
            },
            '& .MuiTableSortLabel-icon': {
              color: `${theme.vars.palette.primary.contrastText} !important`,
              opacity: 1,
            },
            '& svg': {
              color: 'inherit',
              fill: 'currentColor',
            },
          },
        }),
        stickyHeader: ({ theme }) => ({
          ...(tableHeadCellFill ?? { backgroundColor: theme.vars.palette.primary.main }),
          color: theme.vars.palette.primary.contrastText,
        }),
        paddingCheckbox: ({ theme }) => ({
          paddingLeft: theme.spacing(1),
        }),
      },
    },
    MuiTableSortLabel: {
      styleOverrides: {
        root: {
          color: 'inherit',
          '&:hover': {
            color: 'inherit',
          },
          '&.Mui-active': {
            color: 'inherit',
          },
        },
        icon: ({ theme }) => ({
          color: theme.vars.palette.primary.contrastText,
          opacity: 1,
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.vars.palette.background.paper,
          border: 'none',
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 50,
          textTransform: 'none',
          fontWeight: 600,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 10,
          paddingBottom: 10,
          minHeight: 42,
        },
        [`&.${buttonClasses.sizeSmall}`]: {
          paddingTop: 7,
          paddingBottom: 7,
          minHeight: 36,
        },
        [`&.${buttonClasses.sizeLarge}`]: {
          paddingTop: 12,
          paddingBottom: 12,
          minHeight: 48,
        },
        outlinedPrimary: ({ theme }) => ({
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: theme.vars.palette.primary.main,
          color: theme.vars.palette.primary.main,
          '&:hover': {
            backgroundColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.06),
            borderColor: theme.vars.palette.primary.dark,
            color: theme.vars.palette.primary.dark,
          },
        }),
        ...(!brandGradient && {
          containedPrimary: ({ theme }) => ({
            backgroundColor: theme.vars.palette.primary.main,
            color: theme.vars.palette.primary.contrastText,
            '&:hover': {
              backgroundColor: theme.vars.palette.primary.dark,
            },
          }),
        }),
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 10,
        },
        [`&.${iconButtonClasses.sizeSmall}`]: {
          padding: 9,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: navBackground,
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          ...navBackground,
          backdropFilter: 'blur(8px)',
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.background.paper,
          color: theme.vars.palette.text.primary,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.2),
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: varAlpha(theme.vars.palette.primary.mainChannel, 0.36),
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.vars.palette.primary.main,
          },
        }),
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.background.paper,
        }),
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.vars.palette.background.paper,
        }),
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: ({ theme }) => ({
          backgroundColor: theme.vars.palette.background.paper,
        }),
      },
    },
    MuiLink: {
      defaultProps: {
        color: 'primary',
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: ({ theme }) =>
          brandGradient
            ? {
                background: brandGradient,
                backgroundColor: background.default,
              }
            : {
                backgroundColor: theme.vars.palette.primary.main,
              },
      },
    },
    ...gradientComponents,
  };
}


export function getAdminThemeAction(primary) {
  return {
    hover: varAlpha(primary.mainChannel, 0.08),
    selected: varAlpha(primary.mainChannel, 0.16),
    focus: varAlpha(primary.mainChannel, 0.24),
    active: primary.dark,
    disabled: varAlpha(coreGreyPalette['500Channel'], 0.8),
    disabledBackground: varAlpha(coreGreyPalette['500Channel'], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  };
}
