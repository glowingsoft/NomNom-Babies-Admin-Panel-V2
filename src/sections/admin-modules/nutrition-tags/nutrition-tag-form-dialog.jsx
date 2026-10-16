import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import DialogContent from '@mui/material/DialogContent';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { AdminDialogActions, AdminFormDialog } from '../components/admin-form-dialog';

// ----------------------------------------------------------------------

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'disabled', label: 'Disabled' },
];

const defaultForm = { name: '', benefit: '', status: 'active' };

// ----------------------------------------------------------------------

export function NutritionTagFormDialog({ open, onClose, onSubmit, initialData, title, submitting }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (open) {
      setForm(initialData ? { name: initialData.name, benefit: initialData.benefit, status: initialData.status ?? 'active' } : defaultForm);
    }
  }, [open, initialData]);

  const handleSubmit = () => {
    if (!form.name.trim() || !form.benefit.trim()) return;
    onSubmit({
      name: form.name.trim(),
      benefit: form.benefit.trim(),
      status: form.status,
    });
  };

  return (
    <AdminFormDialog open={open} onClose={onClose} title={title} maxWidth="sm">
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField label="Tag name" placeholder="e.g. Iron" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} fullWidth />
          <TextField
            label="Benefit (shown under recipes)"
            placeholder="e.g. Supports healthy blood development"
            value={form.benefit}
            onChange={(e) => setForm((f) => ({ ...f, benefit: e.target.value }))}
            multiline
            rows={2}
            fullWidth
          />
          <TextField select label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} fullWidth>
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <AdminDialogActions onCancel={onClose} onSubmit={handleSubmit} submitDisabled={!form.name.trim() || !form.benefit.trim() || submitting} loading={submitting} />
    </AdminFormDialog>
  );
}

NutritionTagFormDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  initialData: PropTypes.object,
  title: PropTypes.string,
  submitting: PropTypes.bool,
};
