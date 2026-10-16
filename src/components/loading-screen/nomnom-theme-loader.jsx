import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { NOMNOM_LOGO } from 'src/assets/logo';
import { ADMIN_THEME_PRESETS } from 'src/theme/admin-theme/presets';

import { AnimateLogo1 } from 'src/components/animate';


export function NomnomThemeLoader({ showProgress = false, logoSize = 200, sx }) {
  const preset = ADMIN_THEME_PRESETS.orange;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        ...sx,
      }}
    >
      <AnimateLogo1
        sx={{ width: logoSize, height: logoSize }}
        logo={
          <Box
            component="img"
            alt="NomNom Babies"
            src={NOMNOM_LOGO}
            sx={{
              width: logoSize * 0.72,
              height: 'auto',
              maxHeight: logoSize * 0.55,
              objectFit: 'contain',
              display: 'block',
            }}
          />
        }
      />

      {showProgress && (
        <LinearProgress
          color="primary"
          sx={{
            width: 1,
            maxWidth: 320,
            height: 6,
            borderRadius: 1,
            bgcolor: 'action.hover',
            '& .MuiLinearProgress-bar': {
              borderRadius: 1,
              ...(preset?.primary?.main && {
                backgroundColor: preset.primary.main,
              }),
            },
          }}
        />
      )}
    </Box>
  );
}
