import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';

import { varAlpha, bgGradient } from 'src/theme/styles';
import { Label } from 'src/components/label';

const TAB_BAR_HEIGHT = 64;

const STATUS_LABEL_COLOR = {
  active: 'success',
  inactive: 'error',
  suspended: 'warning',
  restricted: 'info',
  softDeleted: 'default',
};

// ----------------------------------------------------------------------

export function ProfileCover({ name, avatarUrl, role, coverUrl, childrenCount, recipiesCount, plansCount, favouriteCount }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...bgGradient({
          color: `0deg, ${varAlpha(theme.vars.palette.primary.darkerChannel, 0.8)}, ${varAlpha(theme.vars.palette.primary.darkerChannel, 0.8)}`,
          imgUrl: coverUrl,
        }),
        height: 1,
        color: 'common.white',
        position: 'relative',
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        sx={{
          position: 'absolute',
          bottom: TAB_BAR_HEIGHT + 14,
          left: 20,
          right: 20,
        }}
      >
        {/* Avatar */}
        <Avatar
          alt={name}
          src={avatarUrl}
          sx={{
            width: { xs: 80, md: 100 },
            height: { xs: 80, md: 100 },
            fontSize: { xs: 32, md: 40 },
            fontWeight: 700,
            border: `4px solid ${theme.vars.palette.common.white}`,
            bgcolor: 'primary.main',
            color: 'common.white',
            flexShrink: 0,
          }}
        >
          {name?.charAt(0).toUpperCase()}
        </Avatar>

        {/* Name + status pill */}
        <Box
          sx={{
            ml: 2,
            px: 2,
            py: 1,
            bgcolor: 'rgba(0,0,0,0.52)',
            borderRadius: 2,
            backdropFilter: 'blur(8px)',
            flexShrink: 0,
            maxWidth: { xs: 160, sm: 220, md: 280 },
          }}
        >
          <Typography variant="h5" sx={{ color: '#fff !important', fontWeight: 700, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {name}
          </Typography>
          <Label variant="soft" color={STATUS_LABEL_COLOR[role?.toLowerCase()] || 'default'} sx={{ mt: 0.75, textTransform: 'capitalize', color: '#fff !important' }}>
            {role}
          </Label>
        </Box>

        {/* Stats pill */}
        <Box
          sx={{
            ml: 'auto',
            display: { xs: 'none', md: 'flex' },
            gap: 3,
            px: 2.5,
            py: 1.25,
            bgcolor: 'rgba(0,0,0,0.52)',
            borderRadius: 2,
            backdropFilter: 'blur(8px)',
          }}
        >
          {[
            { count: childrenCount, label: 'Children' },
            { count: recipiesCount, label: 'Recipes' },
            { count: plansCount, label: 'Plans' },
            { count: favouriteCount, label: 'Favourites' },
          ].map(({ count, label }) => (
            <Box key={label} textAlign="center">
              <Typography variant="h4" sx={{ color: '#fff !important', lineHeight: 1.2 }}>
                {count}
              </Typography>
              <Typography variant="caption" sx={{ color: '#fff !important', opacity: 0.85 }}>
                {label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Stack>
    </Box>
  );
}
