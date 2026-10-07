import PropTypes from 'prop-types';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { AdminDialogActions, AdminFormDialog } from '../components/admin-form-dialog';

// ----------------------------------------------------------------------

export function GroceryListViewDialog({ open, onClose, data, loading }) {
  const recipes = data?.recipesIncluded || [];
  const ingredients = data?.groceryChecklist || [];

  return (
    <AdminFormDialog open={open} onClose={onClose} title="Grocery list details" maxWidth="sm">
      <DialogContent sx={{ position: 'relative' }}>
        {loading || !data ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <LinearProgress
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 9,
              }}
            />
          </Box>
        ) : (
          <Stack spacing={2.5} sx={{ pt: 0.5 }}>
            {/* Identity header */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              spacing={1.5}
              sx={{ p: 2, borderRadius: 1.5, bgcolor: 'background.neutral' }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Avatar
                  alt={data.user?.name}
                  sx={{ width: 48, height: 48, bgcolor: 'primary.main', color: 'common.white', fontWeight: 700 }}
                >
                  {data.user?.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">{data.user?.name || '-'}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {data.user?.email || '-'}
                  </Typography>
                </Box>
              </Stack>

              <Chip
                icon={<Iconify icon="solar:user-heart-bold" width={16} />}
                label={`Baby: ${data.baby?.name || '-'}`}
                size="small"
                variant="soft"
                color="primary"
              />
            </Stack>

            {/* Summary counts */}
            <Stack direction="row" spacing={1}>
              <Chip label={`${recipes.length} recipe${recipes.length !== 1 ? 's' : ''}`} size="small" />
              <Chip label={`${ingredients.length} ingredient${ingredients.length !== 1 ? 's' : ''}`} size="small" />
            </Stack>

            {/* Recipes */}
            <Stack spacing={1.25}>
              <Typography variant="subtitle2">Recipes</Typography>

              {recipes.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No recipes in this list.
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {recipes.map((recipe) => (
                    <Stack
                      key={recipe.recipeId}
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{
                        p: 1,
                        borderRadius: 1.5,
                        border: (theme) => `1px solid ${theme.vars.palette.divider}`,
                      }}
                    >
                      <Avatar variant="rounded" src={recipe.image || undefined} sx={{ width: 40, height: 40, bgcolor: 'primary.lighter', color: 'primary.dark' }}>
                        <Iconify icon="solar:notebook-bold" />
                      </Avatar>
                      <Typography variant="body2" fontWeight={600}>
                        {recipe.title || 'Untitled recipe'}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Stack>

            {/* Grocery checklist */}
            <Stack spacing={1.25}>
              <Typography variant="subtitle2">Grocery checklist</Typography>

              {ingredients.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Iconify icon="solar:cart-large-2-bold" width={40} sx={{ color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    This list has no ingredients yet.
                  </Typography>
                </Box>
              ) : (
                <Card variant="outlined">
                  <Stack divider={<Divider />}>
                    {ingredients.map((ingredient) => (
                      <Stack key={ingredient._id} direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, py: 1.25 }}>
                        <Avatar variant="rounded" sx={{ width: 32, height: 32, bgcolor: 'background.neutral', fontSize: 16 }}>
                          {ingredient.icon || '🛒'}
                        </Avatar>

                        <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500 }}>
                          {ingredient.name}
                        </Typography>

                        {ingredient.category && <Chip size="small" label={ingredient.category} variant="soft" />}

                        {ingredient.quantity && (
                          <Chip
                            size="small"
                            label={ingredient.quantity}
                            sx={{ bgcolor: 'background.neutral', fontWeight: 600, minWidth: 64 }}
                          />
                        )}
                      </Stack>
                    ))}
                  </Stack>
                </Card>
              )}
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <AdminDialogActions onCancel={onClose} />
    </AdminFormDialog>
  );
}

GroceryListViewDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
  loading: PropTypes.bool,
};
