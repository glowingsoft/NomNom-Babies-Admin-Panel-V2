import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';
import { Iconify } from 'src/components/iconify';

export function ParentRecipes({ recipes }) {
  return (
    <Card>
      <CardHeader title="Recipes Used" subheader={<Chip label={`${recipes.length} recipe${recipes.length !== 1 ? 's' : ''} used`} size="small" sx={{ mb: 1 }} />} />

      <Divider />

      {recipes.length === 0 && (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Iconify icon="solar:notebook-bold" width={40} sx={{ color: 'text.disabled', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No recipes used yet.
          </Typography>
        </Box>
      )}

      <Stack spacing={2} sx={{ p: 3 }}>
        {recipes.map((recipe) => (
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
                <Avatar variant="rounded" src={recipe.image || undefined} sx={{ width: 48, height: 48, bgcolor: 'primary.lighter' }}>
                  <Iconify icon="solar:notebook-bold" />
                </Avatar>

                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {recipe.title}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }} alignItems="center">
                    {recipe.category && <Chip size="small" label={recipe.category} color="primary" variant="soft" />}
                    {recipe.usedAt && (
                      <Typography variant="caption" color="text.secondary">
                        Used {fDate(recipe.usedAt)}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Card>
  );
}
