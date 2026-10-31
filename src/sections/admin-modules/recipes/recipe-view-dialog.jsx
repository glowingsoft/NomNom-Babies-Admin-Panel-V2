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

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { fDateTime } from 'src/utils/format-time';

import { AdminDialogActions, AdminFormDialog } from '../components/admin-form-dialog';

// ----------------------------------------------------------------------

const statusColor = (status) => {
  if (status === 'published') return 'success';
  if (status === 'draft') return 'warning';
  return 'default';
};

function DetailBlock({ label, value }) {
  if (!value) return null;
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" sx={{ mt: 0.25, whiteSpace: 'pre-line' }}>
        {value}
      </Typography>
    </Box>
  );
}

export function RecipeViewDialog({ open, onClose, data, loading }) {
  const ingredients = data?.ingredients || [];
  const method = data?.method?.length ? [...data.method].sort((a, b) => a.step - b.step) : [];
  const nutritionTags = data?.nutritionTags || [];

  const detailBlocks = data
    ? [
        { label: 'Feeding insight', value: data.feedingInsight },
        { label: 'Allergy reminder', value: data.allergyReminder },
        { label: 'Notes', value: data.notes },
        { label: 'Acceptance labels', value: data.acceptanceLabel },
      ].filter((block) => block.value)
    : [];

  return (
    <AdminFormDialog open={open} onClose={onClose} title="Recipe details" maxWidth="sm">
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
                <Avatar src={data.image || undefined} variant="rounded" sx={{ width: 48, height: 48, bgcolor: 'primary.lighter', color: 'primary.dark', fontSize: 20 }}>
                  {data.icon || data.title?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">{data.title || '-'}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {data.country?.name || '-'} &middot; {data.babyStage?.title || '-'}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Label variant="soft" color={statusColor(data.status)}>
                  {data.status}
                </Label>
                <Label variant="soft" color={data.isActive ? 'success' : 'default'}>
                  {data.isActive ? 'Active' : 'Inactive'}
                </Label>
              </Stack>
            </Stack>

            {/* Summary chips */}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip icon={<Iconify icon="solar:chef-hat-bold" width={16} />} label={data.mealType?.name || 'No meal type'} size="small" />
              {data.prepTime ? <Chip icon={<Iconify icon="solar:clock-circle-bold" width={16} />} label={`${data.prepTime} min`} size="small" /> : null}
              <Chip icon={<Iconify icon="solar:eye-bold" width={16} />} label={`${data.views ?? 0} views`} size="small" />
            </Stack>

            {/* Ingredients */}
            <Stack spacing={1.25}>
              <Typography variant="subtitle2">Ingredients</Typography>

              {ingredients.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No ingredients listed.
                </Typography>
              ) : (
                <Card variant="outlined">
                  <Stack divider={<Divider />}>
                    {ingredients.map((ingredient) => (
                      <Stack key={ingredient._id ?? ingredient.name} direction="row" alignItems="center" spacing={1.5} sx={{ px: 2, py: 1.25 }}>
                        <Avatar variant="rounded" sx={{ width: 32, height: 32, bgcolor: 'background.neutral', fontSize: 16 }}>
                          {ingredient.icon || '🥄'}
                        </Avatar>

                        <Typography variant="body2" sx={{ flexGrow: 1, fontWeight: 500 }}>
                          {ingredient.name}
                        </Typography>

                        {ingredient.category && <Chip size="small" label={ingredient.category} variant="soft" />}

                        {ingredient.quantity && <Chip size="small" label={ingredient.quantity} sx={{ bgcolor: 'background.neutral', fontWeight: 600, minWidth: 64 }} />}
                      </Stack>
                    ))}
                  </Stack>
                </Card>
              )}
            </Stack>

            {/* Method */}
            <Stack spacing={1.25}>
              <Typography variant="subtitle2">Method</Typography>

              {method.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No steps listed.
                </Typography>
              ) : (
                <Card variant="outlined">
                  <Stack divider={<Divider />}>
                    {method.map((step, index) => (
                      <Stack key={step._id ?? index} direction="row" spacing={1.5} sx={{ px: 2, py: 1.25 }}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 13, bgcolor: 'primary.main', color: 'common.white', mt: 0.25 }}>{step.step ?? index + 1}</Avatar>
                        <Box>
                          {step.title ? <Typography variant="subtitle2">{step.title}</Typography> : null}
                          <Typography variant="body2">{step.instruction}</Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </Card>
              )}
            </Stack>

            {/* Nutrition tags */}
            {nutritionTags.length > 0 && (
              <Stack spacing={1}>
                <Typography variant="subtitle2">Nutrition tags</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {nutritionTags.map((tag) => (
                    <Chip key={tag._id || tag.name} label={tag.name || ''} size="small" variant="soft" color="primary" />
                  ))}
                </Stack>
              </Stack>
            )}

            {/* Additional details */}
            {detailBlocks.length > 0 && (
              <Card variant="outlined" sx={{ p: 2 }}>
                <Stack spacing={1.5}>
                  {detailBlocks.map((block) => (
                    <DetailBlock key={block.label} label={block.label} value={block.value} />
                  ))}
                </Stack>
              </Card>
            )}

            <Divider />

            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Typography variant="caption" color="text.secondary">
                Created {data.createdAt ? fDateTime(data.createdAt) : '-'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Updated {data.updatedAt ? fDateTime(data.updatedAt) : '-'}
              </Typography>
            </Stack>
          </Stack>
        )}
      </DialogContent>
      <AdminDialogActions onCancel={onClose} />
    </AdminFormDialog>
  );
}

RecipeViewDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object,
  loading: PropTypes.bool,
};
