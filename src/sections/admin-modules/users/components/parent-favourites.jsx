import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';

export function ParentFavourites({ favourites }) {
  return (
    <Card>
      <CardHeader title="Favourite / Downloaded Recipes" subheader={
        <Chip
        label={`${favourites.length} saved`}
        size='small'
        sx={{
          mb: 1,
        }}
        />
      } />

      <Divider />

      {favourites.length === 0 && (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Iconify icon="solar:heart-bold" width={40} sx={{ color: 'text.disabled', mb: 1 }} />

          <Typography variant="body2" color="text.secondary">
            No favourites saved yet.
          </Typography>
        </Box>
      )}

      <Stack spacing={2} sx={{ p: 3 }}>
        {favourites.map((recipe) => (
          <Card
            key={recipe.id}
            variant="outlined"
            sx={{
              p: 2,
              transition: 'all .2s ease',
              '&:hover': {
                boxShadow: (theme) => theme.customShadows?.z8,
                transform: 'translateY(-2px)',
              },
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: recipe.downloaded ? 'success.lighter' : 'error.lighter',
                    color: recipe.downloaded ? 'success.main' : 'error.main',
                  }}
                >
                  <Iconify icon={recipe.downloaded ? 'solar:download-bold' : 'solar:heart-bold'} />
                </Avatar>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {recipe.name}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                    {recipe.category && <Chip size="small" label={recipe.category} color="primary" variant="soft" />}
                  </Stack>
                </Box>
              </Stack>

              {/* Right Side */}
              <Stack direction="row" spacing={1} alignItems="center">
                <Label color={recipe.downloaded ? 'success' : 'error'}>{recipe.downloaded ? 'Downloaded' : 'Favourite'}</Label>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Card>
  );
}
