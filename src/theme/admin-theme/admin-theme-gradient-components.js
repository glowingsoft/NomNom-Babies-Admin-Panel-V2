import { buttonClasses } from '@mui/material/Button';
import { switchClasses } from '@mui/material/Switch';
import { toggleButtonClasses } from '@mui/material/ToggleButton';
import { checkboxClasses } from '@mui/material/Checkbox';
import { radioClasses } from '@mui/material/Radio';
import { chipClasses } from '@mui/material/Chip';
import { linearProgressClasses } from '@mui/material/LinearProgress';
import { sliderClasses } from '@mui/material/Slider';
import { fabClasses } from '@mui/material/Fab';
import { paginationItemClasses } from '@mui/material/PaginationItem';

export function getAdminBrandGradient(preset) {
  return preset.brandGradient ?? preset.background?.gradient ?? null;
}

function createGradientSurface(gradient, fallbackColor) {
  return {
    background: gradient,
    backgroundColor: fallbackColor,
    color: '#FFFFFF',
  };
}

function createGradientHover(gradient, fallbackColor) {
  return {
    background: gradient,
    backgroundColor: fallbackColor,
    color: '#FFFFFF',
    filter: 'brightness(1.06)',
  };
}


export function getAdminGradientComponents(preset) {
  const gradient = getAdminBrandGradient(preset);

  if (!gradient) {
    return {};
  }

  const fallback = preset.primary.main;

  const fill = createGradientSurface(gradient, fallback);
  const fillHover = createGradientHover(gradient, fallback);

  const disabledFill = {
    background: 'var(--mui-palette-action-disabledBackground)',
    backgroundImage: 'none',
    backgroundColor: 'var(--mui-palette-action-disabledBackground)',
    color: 'var(--mui-palette-action-disabled)',
    filter: 'none',
  };

  const pillButton = {
    borderRadius: 50,
    textTransform: 'none',
    fontWeight: 600,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
    paddingBottom: 10,
    minHeight: 42,
  };

  return {
    MuiButton: {
      styleOverrides: {
        root: pillButton,
        outlinedPrimary: {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: preset.primary.main,
          color: preset.primary.main,
          '&:hover': {
            backgroundColor: preset.primary.lighter,
            borderColor: preset.primary.dark,
            color: preset.primary.dark,
            filter: 'none',
          },
        },
        containedPrimary: {
          ...fill,
          border: 'none',
          '&:hover': fillHover,
          [`&.${buttonClasses.disabled}`]: disabledFill,
        },
        containedSecondary: {
          ...fill,
          border: 'none',
          '&:hover': fillHover,
          [`&.${buttonClasses.disabled}`]: disabledFill,
        },
      },
    },
    MuiLoadingButton: {
      styleOverrides: {
        containedPrimary: {
          ...fill,
          '&:hover': fillHover,
          [`&.${buttonClasses.disabled}`]: disabledFill,
        },
        containedSecondary: {
          ...fill,
          '&:hover': fillHover,
          [`&.${buttonClasses.disabled}`]: disabledFill,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        primary: {
          ...fill,
          '&:hover': fillHover,
          [`&.${fabClasses.disabled}`]: disabledFill,
        },
        secondary: {
          ...fill,
          '&:hover': fillHover,
          [`&.${fabClasses.disabled}`]: disabledFill,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        colorPrimary: {
          '&:hover': {
            backgroundColor: 'rgba(28, 42, 237, 0.08)',
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          [`&.${switchClasses.checked}.${switchClasses.colorPrimary} + .${switchClasses.track}`]: {
            ...fill,
            opacity: 1,
          },
          [`&.${switchClasses.checked}.${switchClasses.colorSecondary} + .${switchClasses.track}`]: {
            ...fill,
            opacity: 1,
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          [`&.${checkboxClasses.checked}.${checkboxClasses.colorPrimary}`]: {
            color: fallback,
          },
          [`&.${checkboxClasses.indeterminate}.${checkboxClasses.colorPrimary}`]: {
            color: fallback,
          },
          [`&.${checkboxClasses.checked}.${checkboxClasses.colorSecondary}`]: {
            color: fallback,
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          [`&.${radioClasses.checked}.${radioClasses.colorPrimary}`]: {
            color: fallback,
          },
          [`&.${radioClasses.checked}.${radioClasses.colorSecondary}`]: {
            color: fallback,
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          [`&.${toggleButtonClasses.selected}.${toggleButtonClasses.colorPrimary}`]: {
            ...fill,
            borderColor: 'transparent',
            '&:hover': fillHover,
          },
          [`&.${toggleButtonClasses.selected}.${toggleButtonClasses.colorSecondary}`]: {
            ...fill,
            borderColor: 'transparent',
            '&:hover': fillHover,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            color: fallback,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        filledPrimary: fill,
        filledSecondary: fill,
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        bar: {
          [`&.${linearProgressClasses.barColorPrimary}`]: fill,
          [`&.${linearProgressClasses.barColorSecondary}`]: fill,
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        thumb: {
          [`&.${sliderClasses.colorPrimary}`]: {
            ...fill,
            border: '2px solid #FFFFFF',
          },
        },
        track: {
          [`&.${sliderClasses.track}`]: {
            ...fill,
            border: 'none',
          },
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          [`&.${paginationItemClasses.selected}`]: {
            ...fill,
            '&:hover': fillHover,
          },
        },
      },
    },
  };
}
