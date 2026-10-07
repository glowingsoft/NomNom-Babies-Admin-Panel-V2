import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';

import { AdminDialogActions, AdminFormDialog } from '../components/admin-form-dialog';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' },
];

const defaultForm = {
  name: '',
  description: '',
  status: 'active',
  isActive: true,
};

// ----------------------------------------------------------------------

export function MealsFormDialog({ open, onClose, onSubmit, initialData, loadingInitialData, title, submitting }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (open) {
      setForm(
        initialData
          ? {
              name: initialData.name ?? '',
              description: initialData.description ?? '',
              status: initialData.status ?? 'active',
              isActive: initialData.isActive ?? true,
            }
          : defaultForm
      );
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!isValid) return;

    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      status: form.status,
      isActive: form.isActive,
    });
  };

  const isValid = form.name.trim() && form.description.trim();

  return (
    <AdminFormDialog open={open} onClose={onClose} title={title} maxWidth="sm">
      <DialogContent sx={{ position: 'relative' }}>
        {loadingInitialData ? (
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
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <TextField
              label="Meal Type Name"
              placeholder="e.g. Breakfast"
              value={form.name}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  name: e.target.value,
                }))
              }
              fullWidth
              required
            />

            <TextField
              label="Description"
              placeholder="Enter meal type description"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  description: e.target.value,
                }))
              }
              fullWidth
              multiline
              rows={4}
              required
            />

            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value,
                }))
              }
              fullWidth
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      isActive: e.target.checked,
                    }))
                  }
                />
              }
              label="Active"
            />
          </Stack>
        )}
      </DialogContent>

      <AdminDialogActions onCancel={onClose} onSubmit={handleSubmit} submitDisabled={!isValid || submitting || loadingInitialData} loading={submitting} />
    </AdminFormDialog>
  );
}

MealsFormDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  initialData: PropTypes.object,
  loadingInitialData: PropTypes.bool,
  title: PropTypes.string,
  submitting: PropTypes.bool,
};
