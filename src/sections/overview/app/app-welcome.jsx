import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { CONFIG } from 'src/config-global';
import { varAlpha, bgGradient } from 'src/theme/styles';
import { useAdminDashboardCardSx } from 'src/components/admin-theme';

// ----------------------------------------------------------------------

export function AppWelcome({ title, description, action, img, sx, ...other }) {
  const theme = useTheme();

  const adminCardSx = useAdminDashboardCardSx({ gradient: true });

  return (
    <Box
      className={adminCardSx ? 'admin-dashboard-hero-card' : undefined}
      sx={{
        ...(adminCardSx ??
          bgGradient({
            color: `to right, ${varAlpha(
              theme.vars.palette.grey['900Channel'],
              0.88
            )} 0%, ${theme.vars.palette.grey[900]} 75%`,
            imgUrl: `${CONFIG.site.basePath}/assets/background/background-5.webp`,
          })),
        pt: 5,
        pb: 5,
        pr: 3,
        gap: 5,
        borderRadius: 2,
        display: 'flex',
        height: { md: 1 },
        position: 'relative',
        pl: { xs: 3, md: 5 },
        alignItems: 'center',
        color: adminCardSx ? 'common.white' : 'common.white',
        textAlign: { xs: 'center', md: 'left' },
        flexDirection: { xs: 'column', md: 'row' },
        ...(!adminCardSx && {
          border: `solid 1px ${theme.vars.palette.grey[800]}`,
        }),
        ...sx,
      }}
      {...other}
    >
      <Box
        sx={{
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
          alignItems: { xs: 'center', md: 'flex-start' },
        }}
      >
        <Typography variant="h4" sx={{ whiteSpace: 'pre-line', mb: 1 }}>
          {title}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            opacity: adminCardSx ? 0.88 : 0.72,
            color: adminCardSx ? 'common.white' : 'inherit',
            maxWidth: 360,
            ...(action && { mb: 3 }),
          }}
        >
          {description}
        </Typography>

        {action && action}
      </Box>

      {img && <Box sx={{ maxWidth: 260 }}>{img}</Box>}
    </Box>
  );
}
