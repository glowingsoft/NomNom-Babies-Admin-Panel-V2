import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { Label } from 'src/components/label';

import {
  AdminDialogActions,
  AdminFormDialog,
} from '../components/admin-form-dialog';


const USAGE_LABELS = {
  active: 'Active',
  trial: 'Trial',
  inactive: 'Inactive',
};

const USAGE_COLORS = {
  active: 'success',
  trial: 'warning',
  inactive: 'default',
};


export function UserDetailDialog({ open, onClose, user }) {
  if (!user) return null;

  return (
    <AdminFormDialog
      open={open}
      onClose={onClose}
      title="User profile"
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            width: { xs: 'calc(100% - 24px)', sm: '100%' },
            m: { xs: 1.5, sm: 2 },
          },
        },
      }}
    >
      <DialogContent dividers sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 2.5 } }}>
        <Stack spacing={{ xs: 2, sm: 2.5 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Caregiver
            </Typography>
            <Typography variant="h6" sx={{ wordBreak: 'break-word' }}>
              {user.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
              {user.email}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Baby
            </Typography>
            <Typography variant="body1">{user.babyName || '—'}</Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Food cultures (selected countries)
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={0.75}>
              {user.foodCultures.map((country) => (
                <Chip key={country} label={country} size="small" variant="soft" color="primary" />
              ))}
            </Stack>
          </Box>

          <Grid container spacing={{ xs: 1.5, sm: 3 }}>
            <Grid xs={12} sm={4}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                App usage
              </Typography>
              <Label color={USAGE_COLORS[user.status] || 'default'} variant="soft">
                {USAGE_LABELS[user.status] || user.status}
              </Label>
            </Grid>
            <Grid xs={6} sm={4}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Joined
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                {user.joinedAt}
              </Typography>
            </Grid>
            <Grid xs={6} sm={4}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Last active
              </Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                {user.lastActiveAt}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>

      <AdminDialogActions onCancel={onClose} cancelLabel="Close" />
    </AdminFormDialog>
  );
}

UserDetailDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  user: PropTypes.object,
};
