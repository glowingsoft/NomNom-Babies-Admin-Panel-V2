import { useMemo } from 'react';
import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/material/styles';
import { iconButtonClasses } from '@mui/material/IconButton';
import { useBoolean } from 'src/hooks/use-boolean';
import { allLangs } from 'src/locales';
import { _contacts, _notifications } from 'src/_mock';
import { varAlpha, stylesMode } from 'src/theme/styles';
import { bulletColor } from 'src/components/nav-section';
import { useSettingsContext } from 'src/components/settings';
import { useAdminThemeContext } from 'src/components/admin-theme/context/use-admin-theme-context';
import { ADMIN_THEME_PRESETS } from 'src/theme/admin-theme/presets';
import { getAdminNavSectionVars } from 'src/theme/admin-theme/nav-css-vars';
import {
  getAdminDashboardBackgroundCssValue,
  getAdminDashboardBackgroundSx,
  getAdminSidebarBackgroundCssValue,
  getAdminSidebarBackgroundSx,
} from 'src/theme/admin-theme/admin-theme-background';
import { useSelector } from 'react-redux';
import { Main } from './main';
import { NavMobile } from './nav-mobile';
import { layoutClasses } from '../classes';
import { NavVertical } from './nav-vertical';
import { NavHorizontal } from './nav-horizontal';
import { _account } from '../config-nav-account';
import { HeaderBase } from '../core/header-base';
import { _workspaces } from '../config-nav-workspace';
import { LayoutSection } from '../core/layout-section';
import { navData as dashboardNavData } from '../config-nav-dashboard';
import { navDataAdmin as dashboardNavDataAdmin } from '../config-nav-admin-dashboard';


export function DashboardLayout({ sx, children, data, showThemeColorSelect = false }) {
  const theme = useTheme();

  const mobileNavOpen = useBoolean();

  const { user } = useSelector((state) => state.user);

  const settings = useSettingsContext();

  const adminTheme = useAdminThemeContext();

  const adminBackgroundSx = showThemeColorSelect ? getAdminDashboardBackgroundSx() : undefined;
  const adminSidebarSx = showThemeColorSelect ? getAdminSidebarBackgroundSx() : undefined;

  const navColorVars = useNavColorVars(
    theme,
    settings,
    showThemeColorSelect,
    adminTheme.themeColor
  );

  const layoutQuery = 'lg';


  const navData = useMemo(() => {
    if (user?.permission === 1) {
      return dashboardNavDataAdmin;
    }

    return data?.nav ?? dashboardNavData;
  }, [user?.permission, data?.nav]);

  const isNavMini = settings.navLayout === 'mini';

  const isNavHorizontal = settings.navLayout === 'horizontal';

  const isNavVertical = isNavMini || settings.navLayout === 'vertical';

  return (
    <>
      <NavMobile
        data={navData}
        open={mobileNavOpen.value}
        onClose={mobileNavOpen.onFalse}
        cssVars={navColorVars.section}
        sx={adminSidebarSx}
      />

      <LayoutSection

        headerSection={
          <HeaderBase
            layoutQuery={layoutQuery}
            disableElevation={isNavVertical}
            disableOffset={showThemeColorSelect}
            sx={adminSidebarSx ?? adminBackgroundSx}
            onOpenNav={mobileNavOpen.onTrue}
            data={{
              nav: navData,
              langs: allLangs,
              account: _account,
              contacts: _contacts,
              workspaces: _workspaces,
              notifications: _notifications,
            }}
            slotsDisplay={{
              signIn: false,
              purchase: false,
              helpLink: false,
              notifications: false,
              settings: false,
            }}
            slots={{
              topArea: (
                <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                  This is an info Alert.
                </Alert>
              ),
              bottomArea: isNavHorizontal ? <NavHorizontal data={navData} layoutQuery={layoutQuery} cssVars={navColorVars.section} /> : null,
            }}
            slotProps={{
              toolbar: {
                sx: {
                  [`& [data-slot="logo"]`]: {
                    display: 'none',
                  },
                  [`& [data-area="right"]`]: {
                    gap: { xs: 0, sm: 0.75 },
                  },
                  ...(isNavHorizontal && {
                    bgcolor: 'var(--layout-nav-bg)',
                    [`& .${iconButtonClasses.root}`]: {
                      color: 'var(--layout-nav-text-secondary-color)',
                    },
                    [theme.breakpoints.up(layoutQuery)]: {
                      height: 'var(--layout-nav-horizontal-height)',
                    },
                    [`& [data-slot="workspaces"]`]: {
                      color: 'var(--layout-nav-text-primary-color)',
                    },
                    [`& [data-slot="logo"]`]: {
                      display: 'none',
                      [theme.breakpoints.up(layoutQuery)]: {
                        display: 'inline-flex',
                      },
                    },
                    [`& [data-slot="divider"]`]: {
                      [theme.breakpoints.up(layoutQuery)]: {
                        display: 'flex',
                      },
                    },
                  }),
                },
              },
              container: {
                maxWidth: false,
                sx: {
                  ...(isNavVertical && { px: { [layoutQuery]: 5 } }),
                },
              },
            }}
          />
        }

        sidebarSection={
          isNavHorizontal ? null : (
            <NavVertical
              data={navData}
              isNavMini={isNavMini}
              layoutQuery={layoutQuery}
              cssVars={navColorVars.section}
              sx={adminSidebarSx}
              onToggleNav={() => settings.onUpdateField('navLayout', settings.navLayout === 'vertical' ? 'mini' : 'vertical')}
            />
          )
        }

        footerSection={null}

        cssVars={{
          ...navColorVars.layout,
          ...(showThemeColorSelect && {
            '--layout-main-bg': getAdminDashboardBackgroundCssValue(),
            '--layout-card-bg': theme.vars.palette.background.paper,
            '--admin-dashboard-bg': getAdminDashboardBackgroundCssValue(),
          }),
          '--layout-transition-easing': 'linear',
          '--layout-transition-duration': '120ms',
          '--layout-nav-mini-width': '88px',
          '--layout-nav-vertical-width': '260px',
          '--layout-nav-horizontal-height': '64px',
          '--layout-dashboard-content-pt': showThemeColorSelect ? theme.spacing(5) : theme.spacing(1),
          '--layout-dashboard-content-pb': theme.spacing(8),
          '--layout-dashboard-content-px': theme.spacing(5),
        }}
        sx={{
          ...adminBackgroundSx,
          minHeight: showThemeColorSelect ? '100vh' : undefined,
          [`& .${layoutClasses.hasSidebar}`]: {
            ...(showThemeColorSelect && adminBackgroundSx),
            [theme.breakpoints.up(layoutQuery)]: {
              transition: theme.transitions.create(['padding-left'], {
                easing: 'var(--layout-transition-easing)',
                duration: 'var(--layout-transition-duration)',
              }),
              pl: isNavMini ? 'var(--layout-nav-mini-width)' : 'var(--layout-nav-vertical-width)',
            },
          },
          ...sx,
        }}
      >
        <Main
          isNavHorizontal={isNavHorizontal}
          sx={showThemeColorSelect ? { ...adminBackgroundSx, flex: '1 1 auto' } : undefined}
        >
          {children}
        </Main>
      </LayoutSection>
    </>
  );
}


function useNavColorVars(theme, settings, isAdminTheme = false, adminThemeColor = 'orange') {
  const {
    vars: { palette },
  } = theme;

  return useMemo(() => {
    if (isAdminTheme) {
      const layoutNavBg = getAdminSidebarBackgroundCssValue();
      const adminPreset = ADMIN_THEME_PRESETS[adminThemeColor] ?? ADMIN_THEME_PRESETS.orange;
      const layoutNavText = '#000000';
      const layoutNavTextMuted = 'rgba(0, 0, 0, 0.64)';

      return {
        layout: {
          '--layout-nav-bg': layoutNavBg,
          '--layout-nav-horizontal-bg': layoutNavBg,
          '--layout-nav-border-color': palette.grey[300],
          '--layout-nav-text-primary-color': layoutNavText,
          '--layout-nav-text-secondary-color': layoutNavTextMuted,
          '--layout-nav-text-disabled-color': 'rgba(0, 0, 0, 0.48)',
        },
        section: getAdminNavSectionVars(theme, adminThemeColor),
      };
    }

    switch (settings.navColor) {
      case 'integrate':
        return {
          layout: {
            '--layout-nav-bg': palette.background.default,
            '--layout-nav-horizontal-bg': varAlpha(palette.background.defaultChannel, 0.8),
            '--layout-nav-border-color': varAlpha(palette.grey['500Channel'], 0.12),
            '--layout-nav-text-primary-color': palette.text.primary,
            '--layout-nav-text-secondary-color': palette.text.secondary,
            '--layout-nav-text-disabled-color': palette.text.disabled,
            [stylesMode.dark]: {
              '--layout-nav-border-color': varAlpha(palette.grey['500Channel'], 0.08),
              '--layout-nav-horizontal-bg': varAlpha(palette.background.defaultChannel, 0.96),
            },
          },
          section: {},
        };
      case 'apparent':
        return {
          layout: {
            '--layout-nav-bg': palette.grey[900],
            '--layout-nav-horizontal-bg': varAlpha(palette.grey['900Channel'], 0.96),
            '--layout-nav-border-color': 'transparent',
            '--layout-nav-text-primary-color': palette.common.white,
            '--layout-nav-text-secondary-color': palette.grey[500],
            '--layout-nav-text-disabled-color': palette.grey[600],
            [stylesMode.dark]: {
              '--layout-nav-bg': palette.grey[800],
              '--layout-nav-horizontal-bg': varAlpha(palette.grey['800Channel'], 0.8),
            },
          },
          section: {
            '--nav-item-caption-color': palette.grey[600],
            '--nav-subheader-color': palette.grey[600],
            '--nav-subheader-hover-color': palette.common.white,
            '--nav-item-color': palette.grey[500],
            '--nav-item-root-active-color': palette.primary.light,
            '--nav-item-root-open-color': palette.common.white,
            '--nav-bullet-light-color': bulletColor.dark,
            ...(settings.navLayout === 'vertical' && {
              '--nav-item-sub-active-color': palette.common.white,
              '--nav-item-sub-open-color': palette.common.white,
            }),
          },
        };
      default:
        throw new Error(`Invalid color: ${settings.navColor}`);
    }
  }, [
    adminThemeColor,
    isAdminTheme,
    palette.background.default,
    palette.background.defaultChannel,
    palette.common.blackChannel,
    palette.common.white,
    palette.grey,
    palette.primary.light,
    palette.text.disabled,
    palette.text.primary,
    palette.text.secondary,
    settings.navColor,
    settings.navLayout,
  ]);
}
