import Grid from '@mui/material/Unstable_Grid2';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

import { Iconify } from 'src/components/iconify';

export function AdminProfileHome({ info, onEdit }) {
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Card
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
          }}
        >
          <Avatar
            src={info.avatarUrl}
            sx={{
              width: 110,
              height: 110,
              mx: 'auto',
              mb: 2,
              bgcolor: 'primary.main',
              fontSize: 48,
              fontWeight: 700,
            }}
          >
            {info?.name?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Typography variant="h5" fontWeight={700}>
            {info.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {info.email}
          </Typography>
        </Card>
      </Grid>

      <Grid xs={12} md={8}>
        <Card>
          <CardHeader
            title="Account Information"
            action={
              <Button variant="contained" size="small" startIcon={<Iconify icon="solar:pen-bold" />} onClick={onEdit}>
                Edit Profile
              </Button>
            }
          />

          <Grid container spacing={2} sx={{ p: 3 }}>
            <Grid xs={12} sm={6}>
              <InfoCard title="Full Name" value={info.name} />
            </Grid>

            <Grid xs={12} sm={6}>
              <InfoCard title="Email" value={info.email} />
            </Grid>

            <Grid xs={12} sm={6}>
              <InfoCard title="Role" value={info.role} />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
}

function InfoCard({ title, value }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.neutral',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {title}
      </Typography>

      <Typography variant="subtitle2" sx={{ mt: 0.5 }}>
        {value || 'N/A'}
      </Typography>
    </Box>
  );
}
