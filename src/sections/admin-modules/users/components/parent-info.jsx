import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

const STATUS_COLORS = {
  active: 'success',
  inactive: 'error',
  suspended: 'warning',
  restricted: 'info',
  softDeleted: 'default',
};

// ----------------------------------------------------------------------

export function ParentInfo({ profileData }) {
  if (!profileData) return null;

  const fields = [
    { icon: 'fluent:mail-24-filled', label: 'Email', value: profileData.email },
    { icon: 'solar:phone-bold', label: 'Phone', value: profileData.phone },
    { icon: 'solar:global-bold', label: 'Food Cultures', value: profileData.foodCultures?.join(', ') },
    { icon: 'solar:calendar-date-bold', label: 'Joined', value: profileData.joinedAt },
    { icon: 'solar:clock-circle-bold', label: 'Last Active', value: profileData.lastActiveAt },
  ];

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Avatar
            alt={profileData.name}
            src={profileData.avatarUrl}
            sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: 'primary.main', color: 'common.white', fontSize: 48, fontWeight: 700 }}
          >
            {profileData.name?.charAt(0).toUpperCase()}
          </Avatar>

          <Typography variant="h6">{profileData.name}</Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
            {profileData.email}
          </Typography>

          <Label color={STATUS_COLORS[profileData.status] || 'default'}>{profileData.status || 'Unknown'}</Label>
        </Card>
      </Grid>

      <Grid xs={12} md={8}>
        <Card>
          <CardHeader title="Parent Details" />
          <Divider />

          <Stack spacing={2.5} sx={{ p: 3 }}>
            {fields.map((field) => (
              <Stack key={field.label} direction="row" spacing={2} alignItems="center">
                <Iconify icon={field.icon} width={22} sx={{ color: 'text.secondary', flexShrink: 0 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                    {field.label}
                  </Typography>
                  <Typography variant="body2">{field.value || '—'}</Typography>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Card>
      </Grid>
    </Grid>
  );
}
