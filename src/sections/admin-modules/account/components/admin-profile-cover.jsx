import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useTheme } from '@mui/material/styles';

import { bgGradient, varAlpha } from 'src/theme/styles';

export function AdminProfileCover({ name, avatarUrl, role, email, coverUrl }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',

        ...bgGradient({
          color: `180deg,
            ${varAlpha(theme.vars.palette.primary.darkerChannel, 0.7)},
            ${varAlpha(theme.vars.palette.primary.darkChannel, 0.9)}`,
          imgUrl: coverUrl,
        }),
      }}
    >
      <Paper
        elevation={8}
        sx={{
          position: 'absolute',

          left: { xs: 16, md: 24 },
          right: { xs: 16, md: 24 },

          bottom: { xs: 70, md: 85 },

          p: { xs: 2.5, md: 3 },

          borderRadius: 3,

          bgcolor: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(12px)',

          color: 'common.white',
        }}
      >
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'center', md: 'center' }}>
          <Avatar
            src={avatarUrl}
            alt={name}
            sx={{
              width: { xs: 100, md: 130 },
              height: { xs: 100, md: 130 },

              border: '4px solid white',

              flexShrink: 0,

              fontSize: {
                xs: 36,
                md: 48,
              },
            }}
          >
            {name?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Stack
            spacing={1}
            sx={{
              flexGrow: 1,
              textAlign: {
                xs: 'center',
                md: 'left',
              },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                textAlign: { xs: 'center', md: 'left' },
                fontSize: { xs: '1.6rem', md: '2rem' }
              }}
            >
              {name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                opacity: 0.9,
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              {email}
            </Typography>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              justifyContent={{
                xs: 'center',
                md: 'flex-start',
              }}
            >
              <Chip label={role || 'Admin'} color="primary" size="small" />

              <Chip label="Active" color="success" size="small" />
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
