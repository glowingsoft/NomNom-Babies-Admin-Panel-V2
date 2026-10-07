import GlobalStyles from '@mui/material/GlobalStyles';
import { useTheme } from '@mui/material/styles';
import { layoutClasses } from 'src/layouts/classes';
import { navSectionClasses } from 'src/components/nav-section/classes';
import {
  getAdminDashboardBackground,
  getAdminSidebarBackground,
} from 'src/theme/admin-theme/admin-theme-background';
import { ADMIN_THEME_PRESETS } from 'src/theme/admin-theme/presets';
export function AdminThemeGlobalStyles() {
  const theme = useTheme();

  const bgDefault = theme.vars.palette.background.default;
  const bgPaper = theme.vars.palette.background.paper;
  const adminShellBg = getAdminDashboardBackground();
  const navShellBg = getAdminSidebarBackground();

  const brandGradient = ADMIN_THEME_PRESETS.orange.brandGradient;
  const navTextColor = '#000000';
  const navSubheaderColor = '#000000';
  const headerTextColor = '#000000';

  const navActiveSelector = `[data-area="nav-vertical"] .${navSectionClasses.item.root}.${navSectionClasses.state.active}`;
  const navSubActiveSelector = `[data-area="nav-vertical"] .MuiCollapse-root .${navSectionClasses.item.root}.${navSectionClasses.state.active}`;

  const navActiveGradientStyles = brandGradient
    ? {
        [navActiveSelector]: {
          color: '#FFFFFF !important',
          background: `${brandGradient} !important`,
          backgroundColor: `${theme.vars.palette.primary.main} !important`,
          boxShadow: theme.customShadows.z4,
          '&:hover': {
            filter: 'brightness(1.06)',
            backgroundColor: `${theme.vars.palette.primary.main} !important`,
          },
        },
        [`${navActiveSelector} .${navSectionClasses.item.icon} svg`]: {
          color: '#FFFFFF !important',
        },
        [`${navActiveSelector} .${navSectionClasses.item.title}`]: {
          color: '#FFFFFF !important',
        },
        [`${navActiveSelector} .${navSectionClasses.item.arrow}`]: {
          color: '#FFFFFF !important',
        },
        [navSubActiveSelector]: {
          color: '#FFFFFF !important',
          background: `${brandGradient} !important`,
          backgroundColor: `${theme.vars.palette.primary.main} !important`,
          boxShadow: theme.customShadows.z4,
          '&:hover': {
            filter: 'brightness(1.06)',
            backgroundColor: `${theme.vars.palette.primary.main} !important`,
          },
        },
        [`${navSubActiveSelector} .${navSectionClasses.item.icon} svg`]: {
          color: '#FFFFFF !important',
        },
        [`${navSubActiveSelector} .${navSectionClasses.item.title}`]: {
          color: '#FFFFFF !important',
        },
      }
    : {};

  return (
    <GlobalStyles
      styles={{
        body: {
          ...adminShellBg,
        },
        '#root': {
          ...adminShellBg,
        },
        [`#root__layout, .${layoutClasses.root}`]: {
          ...adminShellBg,
        },
        [`.${layoutClasses.main}, .${layoutClasses.content}`]: {
          ...adminShellBg,
        },
        [`#root__layout .${layoutClasses.hasSidebar}`]: {
          ...adminShellBg,
        },
        [`#root__layout .${layoutClasses.hasSidebar} .${layoutClasses.header}`]: {
          ...navShellBg,
          backgroundImage: 'none !important',
          boxShadow: 'none !important',
          borderBottom: `1px solid ${theme.vars.palette.grey[300]}`,
        },
        [`#root__layout .${layoutClasses.hasSidebar} .${layoutClasses.header} .MuiToolbar-root`]: {
          backgroundColor: 'transparent !important',
          color: headerTextColor,
        },
        [`#root__layout:not(:has(.${layoutClasses.hasSidebar})) .${layoutClasses.header}`]: {
          ...adminShellBg,
          backgroundImage: 'none !important',
          boxShadow: 'none !important',
        },
        '[data-area="nav-vertical"]': {
          ...navShellBg,
          borderRight: `1px solid ${theme.vars.palette.grey[300]}`,
        },
        [`[data-area="nav-vertical"] .${navSectionClasses.subheader}`]: {
          color: `${navSubheaderColor} !important`,
          fontWeight: 700,
          opacity: 1,
        },
        [`[data-area="nav-vertical"] .${navSectionClasses.item.root}`]: {
          color: navTextColor,
          transition: theme.transitions.create(['background-color', 'color', 'box-shadow'], {
            duration: theme.transitions.duration.shorter,
          }),
        },
        [`[data-area="nav-vertical"] .${navSectionClasses.item.icon} svg`]: {
          color: navTextColor,
        },
        ...navActiveGradientStyles,
        [`[data-area="nav-vertical"] .${navSectionClasses.item.title}`]: {
          color: 'inherit',
          fontSize: theme.typography.pxToRem(14),
          letterSpacing: '0.01em',
        },
        [`[data-area="nav-vertical"] .${navSectionClasses.vertical.root}`]: {
          paddingTop: theme.spacing(0.5),
          paddingBottom: theme.spacing(1),
        },
        [`[data-area="nav-vertical"] .${navSectionClasses.ul}`]: {
          gap: '10px !important',
        },
        [`[data-area="nav-vertical"] .MuiCollapse-root`]: {
          paddingLeft: `${theme.spacing(1.5)} !important`,
        },
        [`[data-area="nav-vertical"] .MuiCollapse-root .${navSectionClasses.ul}`]: {
          position: 'relative',
          gap: '6px !important',
          paddingLeft: `${theme.spacing(2)} !important`,
          marginTop: theme.spacing(0.75),
          marginBottom: theme.spacing(0.5),
        },
        [`[data-area="nav-vertical"] .MuiCollapse-root .${navSectionClasses.ul}::before`]: {
          top: `${theme.spacing(0.5)} !important`,
          bottom: `${theme.spacing(0.5)} !important`,
          width: '2px !important',
          borderRadius: '4px',
          backgroundColor: `rgba(${theme.vars.palette.primary.mainChannel} / 0.2) !important`,
        },
        [`[data-area="nav-vertical"] .MuiCollapse-root .${navSectionClasses.item.root}::before`]: {
          display: 'none',
        },
        [`[data-area="nav-vertical"] .MuiCollapse-root .${navSectionClasses.item.root}`]: {
          minHeight: '40px !important',
          paddingLeft: `${theme.spacing(1.5)} !important`,
          fontWeight: theme.typography.fontWeightMedium,
        },
        [`[data-area="nav-vertical"] .MuiCollapse-root .${navSectionClasses.item.icon}`]: {
          width: 'var(--nav-sub-icon-size, 20px) !important',
          height: 'var(--nav-sub-icon-size, 20px) !important',
          margin: 'var(--nav-sub-icon-margin, 0 10px 0 0) !important',
        },
        [`[data-area="nav-vertical"] .MuiCollapse-root .${navSectionClasses.item.icon} svg`]: {
          color: 'inherit',
        },
        [`.MuiCard-root:not(.admin-dashboard-hero-card), .MuiPaper-root:not(.admin-dashboard-hero-card):not(.${layoutClasses.header})`]:
          {
            backgroundColor: bgPaper,
            backgroundImage: 'none',
          },
        ...(brandGradient && {
          '.admin-dashboard-hero-card.MuiBox-root': {
            background: `${brandGradient} !important`,
            backgroundColor: `${theme.vars.palette.primary.main} !important`,
            backgroundImage: 'none !important',
            color: '#FFFFFF !important',
          },
          [`.${layoutClasses.main} .admin-dashboard-hero-card .MuiTypography-root`]: {
            color: '#FFFFFF !important',
          },
        }),
        [`.${layoutClasses.header}.MuiAppBar-root`]: {
          ...navShellBg,
          color: `${headerTextColor} !important`,
        },
        [`.${layoutClasses.main} .MuiBox-root > .MuiStack-root:has(.MuiBreadcrumbs-root)`]: {
          backgroundColor: bgPaper,
          borderRadius: '8px',
          padding: theme.spacing(2.5, 3),
        },
        ...(brandGradient && {
          '.MuiTableHead-root .MuiTableRow-root': {
            background: brandGradient,
            backgroundColor: theme.vars.palette.primary.main,
          },
        }),
        '.MuiTableCell-head': {
          ...(brandGradient && {
            backgroundColor: 'transparent !important',
            backgroundImage: 'none !important',
          }),
          color: `${theme.vars.palette.primary.contrastText} !important`,
        },
        '.MuiTableCell-head .MuiTableSortLabel-root': {
          color: 'inherit !important',
        },
        '.MuiTableCell-head .MuiTableSortLabel-root.Mui-active': {
          color: 'inherit !important',
        },
        '.MuiTableCell-head .MuiTableSortLabel-icon': {
          color: 'inherit !important',
          opacity: '1 !important',
        },
        '.MuiTableCell-head .MuiTableSortLabel-root svg': {
          color: 'inherit !important',
          fill: 'currentColor !important',
        },
        '.MuiAccordion-root': {
          backgroundColor: bgPaper,
        },
        '.MuiDialog-paper': {
          backgroundColor: bgPaper,
          border: 'none',
        },
        '.MuiMenu-paper, .MuiPopover-paper': {
          backgroundColor: bgPaper,
        },
        '.MuiTable-root': {
          border: `1px solid rgba(${theme.vars.palette.primary.mainChannel} / 0.28)`,
          borderRadius: '8px',
          borderCollapse: 'separate',
          borderSpacing: 0,
          overflow: 'hidden',
          backgroundColor: bgPaper,
        },
        [`.${layoutClasses.main} .MuiTableBody-root .MuiTableCell-root`]: {
          backgroundColor: `${bgPaper} !important`,
        },
        [`.${layoutClasses.main} .MuiTableBody-root .MuiTableRow-root:hover .MuiTableCell-root`]: {
          backgroundColor: `${bgPaper} !important`,
        },
        [`.${layoutClasses.main} .MuiTypography-root:not(.MuiTableSortLabel-root)`]: {
          color: '#000000',
        },
        [`.${layoutClasses.main} .MuiTableCell-root:not(.MuiTableCell-head)`]: {
          color: '#000000',
        },
        [`.${layoutClasses.main} .MuiBreadcrumbs-root`]: {
          color: 'rgba(0, 0, 0, 0.72)',
        },
      }}
    />
  );
}
