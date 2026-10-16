import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';

import { ADMIN_THEME_PRESETS } from 'src/theme/admin-theme/presets';

// ----------------------------------------------------------------------

export function NomnomAuthIllustration() {
  const preset = ADMIN_THEME_PRESETS.orange;
  const main = preset.primary.main;

  return (
    <Box
      sx={{
        width: 1,
        maxWidth: 320,
        mx: 'auto',
        py: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: { xs: 2, sm: 3 },
        flexWrap: 'wrap',
        color: main,
      }}
    >
      <Iconify icon="solar:heart-bold" width={56} />
      <Iconify icon="solar:bowl-bold" width={52} />
      <Iconify icon="mdi:fruit-cherries" width={48} />
      <Iconify icon="solar:chef-hat-bold" width={50} />
      <Iconify icon="solar:apple-bold" width={44} sx={{ color: 'warning.main' }} />
      <Iconify icon="solar:leaf-bold" width={40} sx={{ color: 'success.main' }} />
    </Box>
  );
}
